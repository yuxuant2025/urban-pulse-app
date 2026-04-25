import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { ChatMessage } from '../data';
import { useAuth } from '../context/AuthContext';

export interface PlaceContext {
  name: string;
  type: string;
  mood: string;
  personality: string;
  description: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function useChat(placeId: string, placeContext?: PlaceContext) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const placeContextRef = useRef<PlaceContext | undefined>(placeContext);
  placeContextRef.current = placeContext;
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    async function load() {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('place_id', placeId)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      setMessages(
        (data ?? []).map(m => ({
          id: m.id,
          sender: m.sender,
          text: m.content,
          time: formatTime(m.created_at),
          image: m.image_url ?? undefined,
        }))
      );
      setLoading(false);
    }
    load();
  }, [placeId, user]);

  const sendMessage = async (text: string, sender: 'user' | 'place' = 'user') => {
    if (!user) return;

    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Show message immediately regardless of DB success
    setMessages(prev => [
      ...prev,
      { id: tempId, sender, text, time: formatTime(now) },
    ]);

    // Persist to DB in background
    supabase.from('chat_messages')
      .insert({ place_id: placeId, user_id: user.id, sender, content: text })
      .select('id').single()
      .then(({ data }) => {
        if (data) {
          setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: data.id } : m));
        }
      });

    // After a user message, get an AI reply
    if (sender === 'user' && placeContextRef.current) {
      const placeContext = placeContextRef.current;
      setTyping(true);
      try {
        const currentMessages = messagesRef.current;
        const { data: fnData, error } = await supabase.functions.invoke('place-chat', {
          body: {
            placeContext,
            messages: [...currentMessages, { sender: 'user', text }],
          },
        });

        if (!error && fnData?.reply) {
          const replyId = crypto.randomUUID();
          setMessages(prev => [
            ...prev,
            { id: replyId, sender: 'place', text: fnData.reply, time: formatTime(new Date().toISOString()) },
          ]);
          supabase.from('chat_messages')
            .insert({ place_id: placeId, user_id: user.id, sender: 'place', content: fnData.reply });
        }
      } finally {
        setTyping(false);
      }
    }
  };

  return { messages, loading, typing, sendMessage };
}
