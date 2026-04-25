import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { Capsule } from '../data';
import { useAuth } from '../context/AuthContext';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function useCapsules(placeId: string) {
  const { user } = useAuth();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data, error } = await supabase
      .from('capsules')
      .select('*, author:profiles!author_id(id, name, avatar_url)')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    if (error || !data) return;

    let friendIds = new Set<string>();
    if (user) {
      const { data: friends } = await supabase
        .from('friendships').select('friend_id').eq('user_id', user.id);
      friends?.forEach(f => friendIds.add(f.friend_id));
    }

    setCapsules(data.map(c => ({
      id: c.id,
      type: c.type,
      text: c.content,
      mediaUrl: c.media_url,
      date: formatDate(c.created_at),
      color: c.color,
      author: {
        id: c.author.id,
        name: c.author.id === user?.id ? 'You' : c.author.name,
        avatar: c.author.avatar_url,
        isFriend: c.author.id === user?.id || friendIds.has(c.author.id),
      },
    })));
    setLoading(false);
  }, [placeId, user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addCapsule = async (
    type: 'text' | 'photo' | 'voice',
    content: string,
    mediaUrl?: string,
    color = 'bg-stone-50'
  ) => {
    if (!user) return;
    const { data } = await supabase
      .from('capsules')
      .insert({ place_id: placeId, author_id: user.id, type, content, media_url: mediaUrl, color })
      .select('*')
      .single();

    if (data) {
      const optimistic: Capsule = {
        id: data.id,
        type,
        text: content,
        mediaUrl,
        date: 'Just now',
        color,
        author: { id: user.id, name: 'You', isFriend: true },
      };
      setCapsules(prev => [optimistic, ...prev]);
    }
  };

  const toggleFriend = async (authorId: string) => {
    if (!user || authorId === user.id) return;
    const { data: existing } = await supabase
      .from('friendships').select('friend_id')
      .eq('user_id', user.id).eq('friend_id', authorId).maybeSingle();

    if (existing) {
      await supabase.from('friendships').delete()
        .eq('user_id', user.id).eq('friend_id', authorId);
    } else {
      await supabase.from('friendships').insert({ user_id: user.id, friend_id: authorId });
    }
    fetch();
  };

  return { capsules, loading, addCapsule, toggleFriend, refetch: fetch };
}
