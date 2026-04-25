import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { Place } from '../data';
import { useAuth } from '../context/AuthContext';

// Static pet-friendly map — keyed by place ID, avoids a DB column for now
const petFriendlyIds = new Set(['1', '3', '4', '6', '7']);

function formatRelativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  return `${Math.floor(days / 7)} weeks ago`;
}

function mapRow(p: any, up: any): Place {
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    mood: p.mood,
    personality: p.personality,
    color: { from: p.color_from, to: p.color_to, shadow: p.color_shadow },
    description: p.description ?? '',
    petFriendly: petFriendlyIds.has(p.id),
    relationshipLevel: up?.relationship_level ?? 0,
    lastVisited: up?.last_visited_at ? formatRelativeTime(up.last_visited_at) : 'Never',
    memories: up?.memories ?? [],
    capsules: [],
    chatHistory: [],
  };
}

export function usePlaces(discover = false) {
  const { user } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: pData, error: pErr } = await supabase
          .from('places')
          .select('*')
          .eq('is_discover', discover);
        if (pErr) throw pErr;

        let upMap: Record<string, any> = {};
        if (user) {
          const { data: upData } = await supabase
            .from('user_places')
            .select('*')
            .eq('user_id', user.id);
          upData?.forEach(row => { upMap[row.place_id] = row; });
        }

        setPlaces((pData ?? []).map(p => mapRow(p, upMap[p.id])));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, discover]);

  return { places, loading, error };
}

export function usePlace(id: string) {
  const { user } = useAuth();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase
        .from('places').select('*').eq('id', id).single();
      if (!p) { setLoading(false); return; }

      let up: any = null;
      if (user) {
        const { data } = await supabase
          .from('user_places').select('*')
          .eq('place_id', id).eq('user_id', user.id).maybeSingle();
        up = data;
      }

      setPlace(mapRow(p, up));
      setLoading(false);
    }
    load();
  }, [id, user]);

  return { place, loading };
}
