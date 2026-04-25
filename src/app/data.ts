export type Mood = 'calm' | 'quiet' | 'energetic' | 'nostalgic' | 'misses you' | 'a bit crowded' | 'peaceful' | 'lively' | 'lonely';
export type Personality = 'The gentle giant' | 'The quiet observer' | 'The energetic heart' | 'The wise elder' | 'The playful spirit';

export interface Capsule {
  id: string;
  type: 'text' | 'photo' | 'voice';
  text?: string;
  mediaUrl?: string; // photo url or voice duration etc (for mock we can use string for photo url, or "0:12" for voice)
  date: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isFriend?: boolean;
  };
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'place' | 'user';
  text: string;
  time: string;
  image?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Place {
  id: string;
  name: string;
  type: string;
  mood: Mood;
  personality: Personality;
  relationshipLevel: number; // 0-100
  color: {
    from: string;
    to: string;
    shadow: string;
  };
  memories: string[];
  capsules: Capsule[];
  chatHistory: ChatMessage[];
  lastVisited: string;
  description: string;
  petFriendly?: boolean;
}

export const myPlaces: Place[] = [
  {
    id: '1',
    name: 'Bryant Park',
    type: 'Park',
    mood: 'peaceful',
    personality: 'The gentle giant',
    relationshipLevel: 65,
    color: {
      from: 'from-emerald-300',
      to: 'to-teal-100',
      shadow: 'shadow-emerald-200',
    },
    memories: ['A quiet morning surrounded by skyscrapers', 'Reading on the lawn at golden hour'],
    capsules: [
      { id: 'c1', type: 'text', text: 'The cherry blossoms are finally blooming. It feels like waking up.', date: 'May 12', author: { id: 'u1', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1603775493298-e06a5f21e46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc1NjM4OTk2fDA&ixlib=rb-4.1.0&q=80&w=1080', isFriend: false }, color: 'bg-emerald-50' },
      { id: 'c2', type: 'photo', text: 'Sat here reading for 3 hours. Best afternoon in weeks.', mediaUrl: 'https://images.unsplash.com/photo-1720815369506-2bc13b1f837e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjBwYXJrfGVufDF8fHx8MTc3NTY5ODIyMHww&ixlib=rb-4.1.0&q=80&w=1080', date: 'May 11', author: { id: 'u0', name: 'You', isFriend: true }, color: 'bg-teal-50' },
      { id: 'c3', type: 'voice', mediaUrl: '0:14', text: 'Lost my favorite scarf here, but the sunset made up for it.', date: 'May 09', author: { id: 'u2', name: 'Marcus', isFriend: false }, color: 'bg-stone-50' },
      { id: 'c4', type: 'text', text: 'Quiet. Just the way it should be.', date: 'May 08', author: { id: 'u3', name: 'Sarah', isFriend: true }, color: 'bg-emerald-50/50' },
      { id: 'c5', type: 'photo', mediaUrl: 'https://images.unsplash.com/photo-1699446602537-17836341cbee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwYXJrfGVufDF8fHx8MTc3NTY5ODIyMHww&ixlib=rb-4.1.0&q=80&w=1080', text: 'Summer breeze & soft whispers in the trees.', date: 'May 05', author: { id: 'u0', name: 'You' }, color: 'bg-teal-50/50' },
    ],
    chatHistory: [
      { id: 'm1', sender: 'place', text: 'Welcome back to my green heart, friend. I’ve been sitting here since 1882. Do you feel that soft breeze? It’s just me exhaling after a long afternoon of sunshine.', time: '14:02' },
      { id: 'm2', sender: 'user', text: 'It’s beautiful here today. I never realized how many secret corners you have. What’s your favorite spot?', time: '14:04' },
      { id: 'm3', sender: 'place', text: 'Oh, a secret! I’m quite fond of the old stone bridge. But if you want a quiet whisper, sit near the mossy fountain. The water has stories to tell... would you like to see my secret map?', time: '14:05', 
        image: 'https://images.unsplash.com/photo-1677742865244-571be4c271f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNyZXQlMjBtYXAlMjBmb3Jlc3QlMjBhZXJpYWx8ZW58MXx8fHwxNzc1Njk3NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        action: { label: 'See the Secret Map', onClick: () => console.log('Action clicked') }
      },
    ],
    lastVisited: '2 days ago',
    description: 'A sunlit refuge behind the library, ringed by Midtown towers but somehow always peaceful. It breathes slowly and deeply.',
  },
  {
    id: '2',
    name: 'New York Public Library',
    type: 'Library',
    mood: 'quiet',
    personality: 'The wise elder',
    relationshipLevel: 82,
    color: {
      from: 'from-indigo-300',
      to: 'to-purple-100',
      shadow: 'shadow-indigo-200',
    },
    memories: ['Sheltering from the rain', 'Getting lost in a novel for hours'],
    capsules: [
      { id: 'c6', type: 'text', text: 'The smell of old paper always grounds me.', date: 'Apr 22', author: { id: 'u0', name: 'You' }, color: 'bg-indigo-50' },
      { id: 'c7', type: 'text', text: 'Found a note folded in a book from 1998 today.', date: 'Apr 20', author: { id: 'u4', name: 'David' }, color: 'bg-purple-50' },
    ],
    chatHistory: [
      { id: 'm4', sender: 'place', text: 'Hush now... the books are sleeping. Welcome back.', time: '09:15' },
    ],
    lastVisited: '1 week ago',
    description: 'Two stone lions guard a million stories on Fifth Avenue. It hums with whispered ambitions and the soft rustle of turning pages.',
  },
  {
    id: '3',
    name: 'Brooklyn Bridge Park',
    type: 'Waterfront',
    mood: 'misses you',
    personality: 'The quiet observer',
    relationshipLevel: 15,
    color: {
      from: 'from-blue-300',
      to: 'to-cyan-100',
      shadow: 'shadow-blue-200',
    },
    memories: ['Watching the sunset over the water'],
    capsules: [],
    chatHistory: [],
    lastVisited: '3 weeks ago',
    description: 'Stretching along the East River with its eyes fixed on the Manhattan skyline, watching the city shimmer with patient longing.',
  },
];

export const discoverPlaces: Place[] = [
  {
    id: '4',
    name: 'The High Line',
    type: 'Park',
    mood: 'calm',
    personality: 'The playful spirit',
    relationshipLevel: 0,
    color: {
      from: 'from-rose-300',
      to: 'to-orange-100',
      shadow: 'shadow-rose-200',
    },
    memories: [],
    capsules: [],
    chatHistory: [],
    lastVisited: 'Never',
    description: 'An old rail line reborn as a garden in the sky. It winds above the West Side, surprising you at every turn with unexpected beauty.',
  },
  {
    id: '5',
    name: 'Caffe Dante',
    type: 'Cafe',
    mood: 'lonely',
    personality: 'The energetic heart',
    relationshipLevel: 0,
    color: {
      from: 'from-amber-300',
      to: 'to-yellow-100',
      shadow: 'shadow-amber-200',
    },
    memories: [],
    capsules: [],
    chatHistory: [],
    lastVisited: 'Never',
    description: 'A West Village institution glowing golden past midnight. It thrives on lingering conversations, negronis, and the smell of espresso.',
  }
];
