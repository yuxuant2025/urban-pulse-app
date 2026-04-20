import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Wind, MessageSquareHeart, MapPin, Feather, Clock } from 'lucide-react';
import { myPlaces } from '../data';
import { PlaceAvatar } from '../components/Avatar';

export default function PlaceCompanion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = myPlaces.find(p => p.id === id);

  if (!place) {
    return <div className="p-8 text-center text-stone-500">Companion not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-stone-50">
      
      {/* Dynamic Ambient Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          filter: ['blur(60px)', 'blur(80px)', 'blur(60px)'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-to-br ${place.color.from} ${place.color.to} rounded-full mix-blend-multiply opacity-40 z-0 pointer-events-none`}
      />

      {/* Top Bar Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate('/home')}
          className="p-3 bg-white/40 backdrop-blur-md rounded-full shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] border border-white/50 hover:scale-105 transition-transform"
        >
          <ChevronLeft size={24} className="text-stone-700" strokeWidth={1.5} />
        </button>
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/30 backdrop-blur-xl rounded-full border border-white/40">
          <Wind size={14} className="text-stone-600" />
          <span className="text-xs font-medium uppercase tracking-widest text-stone-600">{place.mood}</span>
        </div>
      </nav>

      {/* Main Avatar Area */}
      <main className="relative z-10 flex-1 flex flex-col pt-8 pb-32 px-6 no-scrollbar overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-12"
        >
          <PlaceAvatar
            colorFrom={place.color.from}
            colorTo={place.color.to}
            shadow={place.color.shadow}
            mood={place.mood}
            size="hero"
          />
        </motion.div>

        {/* Info & Personality */}
        <div className="text-center mb-10 space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl tracking-tight font-semibold text-stone-800"
          >
            {place.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-stone-500 font-light flex items-center justify-center space-x-2"
          >
            <Feather size={16} />
            <span>{place.personality}</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-stone-500/80 max-w-[280px] mx-auto text-sm leading-relaxed"
          >
            {place.description}
          </motion.p>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col space-y-4 mb-12"
        >
          <button
            onClick={() => navigate(`/visit/${place.id}`)}
            className="w-full py-5 bg-stone-900 text-[#FAF9F7] rounded-[2rem] text-lg font-medium shadow-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center space-x-3"
          >
            <MessageSquareHeart size={22} strokeWidth={1.5} />
            <span>Spend Time</span>
          </button>
          
          <button
            className="w-full py-5 bg-white/50 backdrop-blur-xl text-stone-800 rounded-[2rem] text-lg font-medium shadow-sm border border-white/60 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center space-x-3"
          >
            <MapPin size={22} strokeWidth={1.5} className="text-stone-400" />
            <span>Find them</span>
          </button>
        </motion.div>

        {/* Relationship Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-sm mb-6"
        >
          <div className="flex justify-between items-end mb-4 text-stone-600">
            <span className="text-sm font-medium">Bond</span>
            <span className="text-xs font-mono">{place.relationshipLevel}%</span>
          </div>
          <div className="h-2 w-full bg-stone-200/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${place.relationshipLevel}%` }}
              transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${place.color.from} ${place.color.to}`}
            />
          </div>
        </motion.div>

        {/* Memories Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-sm"
        >
          <div className="flex items-center space-x-2 text-stone-800 mb-6">
            <Clock size={18} strokeWidth={1.5} />
            <h3 className="font-medium">Shared Memories</h3>
          </div>
          <div className="space-y-4">
            {place.memories.length > 0 ? (
              place.memories.map((memory, index) => (
                <div key={index} className="flex space-x-4 items-start relative pb-4 border-l border-stone-200 ml-2 pl-4">
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gradient-to-tr ${place.color.from} ${place.color.to}`} />
                  <p className="text-sm text-stone-600 leading-relaxed">{memory}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-400 italic text-center py-4">No memories yet. Spend time together to create some.</p>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
