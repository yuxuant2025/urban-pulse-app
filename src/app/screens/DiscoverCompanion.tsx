import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Wind, 
  MapPin, 
  Users, 
  Heart, 
  Cat, 
  Dog, 
  Sun, 
  Coffee, 
  BookOpen, 
  Leaf, 
  Waves,
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';
import { PlaceAvatar } from '../components/Avatar';
import { cn } from '../layout/MobileShell';

interface DetailedPlace {
  id: string;
  name: string;
  mood: string;
  personality: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  shadow: string;
  age: string;
  hobby: string;
  petPreference: 'Dog' | 'Cat' | 'Both' | 'None';
  friendCount: number;
  seasonalActivities: { icon: any; label: string }[];
  recommendations: { id: string; name: string; color: string }[];
}

const detailedPlaces: Record<string, DetailedPlace> = {
  '4': {
    id: '4',
    name: 'The Botanical Gardens',
    mood: 'Feels playful today',
    personality: 'The gentle giant',
    description: 'A sprawling sanctuary of ancient trees and quiet corners. It breathes slowly and deeply.',
    colorFrom: 'from-pink-300',
    colorTo: 'to-rose-100',
    shadow: 'shadow-pink-200',
    age: '142 years',
    hobby: 'Watching clouds & collecting fallen leaves',
    petPreference: 'Both',
    friendCount: 12450,
    seasonalActivities: [
      { icon: Leaf, label: 'Spring Blooms' },
      { icon: Sun, label: 'Summer Picnics' }
    ],
    recommendations: [
      { id: '7', name: 'River Walk', color: 'bg-blue-200' },
      { id: '8', name: 'City Square', color: 'bg-emerald-200' }
    ]
  },
  '5': {
    id: '5',
    name: 'Midnight Cafe',
    mood: 'A little restless tonight',
    personality: 'The energetic heart',
    description: 'A warm glow in the dark streets. It thrives on quiet conversations and the smell of roasted beans.',
    colorFrom: 'from-amber-300',
    colorTo: 'to-yellow-100',
    shadow: 'shadow-amber-200',
    age: '12 years',
    hobby: 'Eavesdropping on dates & smelling coffee',
    petPreference: 'Cat',
    friendCount: 3820,
    seasonalActivities: [
      { icon: Coffee, label: 'Winter Warmth' },
      { icon: Sparkles, label: 'Autumn Jazz' }
    ],
    recommendations: [
      { id: '6', name: 'Old Bookstore', color: 'bg-purple-200' },
      { id: '8', name: 'City Square', color: 'bg-emerald-200' }
    ]
  },
  '6': {
    id: '6',
    name: 'Old Bookstore',
    mood: 'Quiet and open',
    personality: 'The wise elder',
    description: 'A hushed temple of stories. It hums with the soft sound of turning pages.',
    colorFrom: 'from-purple-300',
    colorTo: 'to-indigo-100',
    shadow: 'shadow-purple-200',
    age: '68 years',
    hobby: 'Hoarding secrets & smelling like vanilla',
    petPreference: 'Cat',
    friendCount: 1840,
    seasonalActivities: [
      { icon: BookOpen, label: 'Rainy Day Reading' },
      { icon: Sparkles, label: 'Winter Poetry' }
    ],
    recommendations: [
      { id: '5', name: 'Midnight Cafe', color: 'bg-amber-200' },
      { id: '4', name: 'The Botanical Gardens', color: 'bg-pink-200' }
    ]
  },
  '7': {
    id: '7',
    name: 'River Walk',
    mood: 'Drifting and calm',
    personality: 'The quiet observer',
    description: 'Stretching out into the city, it watches the tides come and go with melancholic patience.',
    colorFrom: 'from-blue-300',
    colorTo: 'to-cyan-100',
    shadow: 'shadow-blue-200',
    age: '110 years',
    hobby: 'Reflecting city lights & listening to ducks',
    petPreference: 'Dog',
    friendCount: 8900,
    seasonalActivities: [
      { icon: Waves, label: 'Summer Breezes' },
      { icon: Sun, label: 'Spring Sunsets' }
    ],
    recommendations: [
      { id: '4', name: 'The Botanical Gardens', color: 'bg-pink-200' },
      { id: '8', name: 'City Square', color: 'bg-emerald-200' }
    ]
  },
  '8': {
    id: '8',
    name: 'City Square',
    mood: 'Grounded and steady',
    personality: 'The playful spirit',
    description: 'The pulsing heart of the town, always awake and always welcoming to strangers.',
    colorFrom: 'from-emerald-300',
    colorTo: 'to-teal-100',
    shadow: 'shadow-emerald-200',
    age: '205 years',
    hobby: 'People watching & listening to buskers',
    petPreference: 'Both',
    friendCount: 45200,
    seasonalActivities: [
      { icon: Sparkles, label: 'Winter Markets' },
      { icon: Sun, label: 'Summer Festivals' }
    ],
    recommendations: [
      { id: '7', name: 'River Walk', color: 'bg-blue-200' },
      { id: '5', name: 'Midnight Cafe', color: 'bg-amber-200' }
    ]
  }
};

export default function DiscoverCompanion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = id ? detailedPlaces[id] : null;

  if (!place) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF9F7] items-center justify-center p-6">
        <p className="text-stone-500 mb-6">Companion not found.</p>
        <button onClick={() => navigate('/discover')} className="px-6 py-3 bg-stone-200 rounded-full text-stone-700">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-[#FAF9F7]">
      
      {/* Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          filter: ['blur(60px)', 'blur(80px)', 'blur(60px)'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-[10%] -right-[20%] w-[120%] h-[100%] bg-gradient-to-bl ${place.colorFrom} ${place.colorTo} rounded-full mix-blend-multiply opacity-30 z-0 pointer-events-none`}
      />

      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate('/discover')}
          className="p-3 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:scale-105 transition-transform"
        >
          <ChevronLeft size={24} className="text-stone-700" strokeWidth={1.5} />
        </button>
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full border border-white/60 shadow-sm">
          <Wind size={14} className="text-stone-600" />
          <span className="text-xs font-medium uppercase tracking-widest text-stone-600">New Presence</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col px-6 pb-32 overflow-y-auto no-scrollbar">
        
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mt-4 mb-8"
        >
          <div className="mb-6">
            <PlaceAvatar
              colorFrom={place.colorFrom}
              colorTo={place.colorTo}
              shadow={place.shadow}
              mood={place.mood as any}
              size="lg"
            />
          </div>
          
          <h1 className="text-3xl tracking-tight font-medium text-stone-800 text-center mb-2">
            {place.name}
          </h1>
          <p className="text-stone-500 font-light mb-4">"{place.mood}"</p>
          
          <div className="flex items-center space-x-2 text-sm text-stone-600 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white">
            <Users size={16} className="text-stone-400" />
            <span className="font-medium">{place.friendCount.toLocaleString()} <span className="font-light">friends</span></span>
          </div>
        </motion.div>

        {/* Basic Info Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-5 border border-white flex flex-col">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-widest mb-1">Age</span>
            <span className="text-stone-800 text-lg font-medium">{place.age}</span>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-5 border border-white flex flex-col">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-widest mb-1">Pets</span>
            <div className="flex items-center space-x-2 mt-1">
              {place.petPreference === 'Dog' && <Dog size={20} className="text-stone-700" />}
              {place.petPreference === 'Cat' && <Cat size={20} className="text-stone-700" />}
              {place.petPreference === 'Both' && <><Dog size={18} className="text-stone-600" /><Cat size={18} className="text-stone-600" /></>}
              <span className="text-stone-800 font-medium ml-1">Likes {place.petPreference.toLowerCase()}s</span>
            </div>
          </div>

          <div className="col-span-2 bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-5 border border-white flex flex-col">
            <span className="text-stone-400 text-xs font-medium uppercase tracking-widest mb-2">Hobby</span>
            <span className="text-stone-800 text-md">{place.hobby}</span>
          </div>
        </motion.div>

        {/* Seasonal Activities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white mb-6"
        >
          <div className="flex items-center space-x-2 text-stone-800 mb-5">
            <Calendar size={18} strokeWidth={1.5} />
            <h3 className="font-medium tracking-tight">Seasonal Activities</h3>
          </div>
          <div className="space-y-3">
            {place.seasonalActivities.map((activity, i) => (
              <div key={i} className="flex items-center space-x-4 bg-white/40 p-4 rounded-2xl">
                <div className={cn(`w-10 h-10 rounded-full bg-gradient-to-tr ${place.colorFrom} ${place.colorTo} flex items-center justify-center text-white opacity-90`)}>
                  <activity.icon size={18} />
                </div>
                <span className="text-stone-700 font-medium">{activity.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Similar Companions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h3 className="font-medium tracking-tight text-stone-800 mb-4 px-2">People who like this also like...</h3>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar px-2 pb-4">
            {place.recommendations.map((rec, i) => (
              <button 
                key={i} 
                onClick={() => navigate(`/discover/${rec.id}`)}
                className="flex-shrink-0 flex flex-col items-center w-28 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white hover:bg-white/80 transition-colors"
              >
                <div className={cn(`w-12 h-12 rounded-full ${rec.color} mb-3 shadow-inner`)} />
                <span className="text-xs text-center font-medium text-stone-700 leading-tight">{rec.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4"
        >
          <button
            onClick={() => navigate(`/home`)}
            className="w-full py-5 bg-stone-900 text-[#FAF9F7] rounded-[2rem] text-lg font-medium shadow-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center space-x-2"
          >
            <Plus size={22} strokeWidth={2} />
            <span>Add to Companions</span>
          </button>
        </motion.div>

      </main>
    </div>
  );
}