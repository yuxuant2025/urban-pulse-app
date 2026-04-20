import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { myPlaces } from '../data';
import { PlaceAvatar } from '../components/Avatar';
import { MapPin } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-stone-50/50 pb-32">
      {/* Soft Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-stone-200/50 to-transparent pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="px-8 pt-16 pb-8 z-10"
      >
        <p className="text-stone-400 text-sm font-medium tracking-wide uppercase mb-1">Your Companions</p>
        <h1 className="text-3xl font-medium tracking-tight text-stone-800 leading-[1.1]">
          Who will you <br/>visit today?
        </h1>
      </motion.header>

      {/* Cards List */}
      <div className="px-6 flex-1 flex flex-col space-y-6 z-10 overflow-visible">
        {myPlaces.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(`/place/${place.id}`)}
            className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] border border-stone-100 flex flex-col items-center cursor-pointer hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500 overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${place.color.from} to-transparent opacity-20 blur-3xl rounded-full pointer-events-none group-hover:opacity-40 transition-opacity duration-1000`} />

            {/* Avatar Centered */}
            <div className="py-6 flex justify-center w-full">
              <PlaceAvatar
                colorFrom={place.color.from}
                colorTo={place.color.to}
                shadow={place.color.shadow}
                mood={place.mood}
                size="lg"
              />
            </div>

            {/* Info Section */}
            <div className="w-full mt-4 text-center">
              <h2 className="text-2xl font-medium tracking-tight text-stone-800 mb-1">{place.name}</h2>
              <div className="flex items-center justify-center space-x-1.5 text-stone-400 mb-4">
                <MapPin size={12} />
                <span className="text-xs uppercase tracking-wider font-medium">{place.type}</span>
              </div>
              
              {/* Mood Indicator */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-100/50 border border-stone-200/50 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)] bg-gradient-to-tr ${place.color.from} ${place.color.to}`} />
                <span className="text-sm text-stone-600 font-medium">Feels {place.mood}</span>
              </div>
            </div>
            
            {/* Relationship Soft Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${place.relationshipLevel}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${place.color.from} ${place.color.to}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
