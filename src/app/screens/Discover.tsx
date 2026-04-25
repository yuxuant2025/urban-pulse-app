import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Mail } from 'lucide-react';
import { cn } from '../layout/MobileShell';

interface DiscoverPlace {
  id: string;
  name: string;
  moodLine: string;
  invitation: string;
  colorType: 'pink' | 'yellow' | 'blue' | 'green' | 'purple';
  colorFrom: string;
  colorTo: string;
  position: { top: string; left: string };
  size: number;
  delay: number;
}

const places: DiscoverPlace[] = [
  {
    id: '4',
    name: 'The High Line',
    moodLine: 'Feels playful today',
    invitation: 'You might like this right now',
    colorType: 'pink',
    colorFrom: 'from-rose-300',
    colorTo: 'to-orange-100',
    position: { top: '25%', left: '20%' },
    size: 120,
    delay: 0,
  },
  {
    id: '5',
    name: 'Caffe Dante',
    moodLine: 'A little restless tonight',
    invitation: '15 min away',
    colorType: 'yellow',
    colorFrom: 'from-amber-300',
    colorTo: 'to-yellow-100',
    position: { top: '65%', left: '60%' },
    size: 100,
    delay: 1,
  },
  {
    id: '6',
    name: 'Washington Square Park',
    moodLine: 'Lively and open',
    invitation: '10 min away',
    colorType: 'purple',
    colorFrom: 'from-violet-300',
    colorTo: 'to-purple-100',
    position: { top: '40%', left: '70%' },
    size: 140,
    delay: 2,
  },
  {
    id: '7',
    name: 'Chelsea Market',
    moodLine: 'Warm and inviting',
    invitation: 'A short walk from here',
    colorType: 'blue',
    colorFrom: 'from-orange-300',
    colorTo: 'to-amber-100',
    position: { top: '75%', left: '25%' },
    size: 160,
    delay: 1.5,
  },
  {
    id: '8',
    name: 'Grand Central Terminal',
    moodLine: 'Steady and magnificent',
    invitation: 'Perfect for right now',
    colorType: 'green',
    colorFrom: 'from-sky-300',
    colorTo: 'to-blue-100',
    position: { top: '15%', left: '65%' },
    size: 90,
    delay: 0.5,
  }
];

export default function Discover() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'city'>('list');
  const [expandingNode, setExpandingNode] = useState<string | null>(null);

  const handleNodeClick = (id: string) => {
    setExpandingNode(id);
    setTimeout(() => {
      navigate(`/discover/${id}`);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#FAF9F7] relative overflow-hidden pb-32">
      
      {/* Top Toggle */}
      <div className="absolute top-12 inset-x-0 z-50 flex justify-center">
        <div className="bg-white/40 backdrop-blur-md p-1 rounded-full flex items-center shadow-sm border border-white/50">
          <button
            onClick={() => setView('list')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              view === 'list' ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            Places
          </button>
          <button
            onClick={() => setView('city')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              view === 'city' ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            City
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1 z-10 pt-28 px-6 overflow-y-auto no-scrollbar pb-32"
          >
            <div className="mb-8 pl-2 shrink-0">
              <h1 className="text-3xl font-medium tracking-tight text-stone-800 leading-[1.2]">
                New companions <br/>await you.
              </h1>
            </div>

            <div className="flex flex-col space-y-6 pb-8">
              {places.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => navigate(`/discover/${place.id}`)}
                  className="group relative bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.05)] border border-white flex flex-col cursor-pointer overflow-hidden transition-all hover:bg-white/80"
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${place.colorFrom} to-transparent opacity-10 blur-3xl rounded-full pointer-events-none group-hover:opacity-30 transition-opacity duration-1000`} />
                  
                  <div className="flex flex-col items-center text-center space-y-5 z-10">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      {/* Breathing aura */}
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                        className={cn(`absolute inset-0 rounded-full blur-xl bg-gradient-to-tr ${place.colorFrom} ${place.colorTo} opacity-40`)}
                      />
                      {/* Solid core */}
                      <div className={cn(`relative w-16 h-16 rounded-full bg-gradient-to-tr ${place.colorFrom} ${place.colorTo} shadow-inner flex items-center justify-center border-2 border-white/50`)} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-medium tracking-tight text-stone-800 mb-1">{place.name}</h2>
                      <p className="text-[15px] text-stone-500 font-light mb-4">"{place.moodLine}"</p>
                      
                      <div className="inline-flex items-center justify-center px-4 py-1.5 bg-stone-100/50 rounded-full">
                        <span className="text-xs font-medium uppercase tracking-widest text-stone-400">{place.invitation}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="city"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-10 flex flex-col"
          >
            {/* Atmospheric Background Gradient */}
            <div className="absolute inset-0 bg-stone-50 mix-blend-multiply opacity-50 pointer-events-none" />
            <motion.div 
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-rose-50/40 to-amber-50/40 pointer-events-none blur-3xl"
            />

            <div className="relative z-20 pt-32 px-8 text-center pointer-events-none">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-2xl font-medium tracking-tight text-stone-700 leading-snug"
              >
                The city feels playful tonight.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-stone-400 text-sm mt-3 font-light"
              >
                Tap a presence to connect
              </motion.p>
            </div>

            {/* Glowing Nodes */}
            <div className="absolute inset-0 top-20 overflow-hidden pointer-events-auto">
              {places.map((place) => {
                const isExpanding = expandingNode === place.id;
                
                return (
                  <motion.div
                    key={place.id}
                    className="absolute cursor-pointer flex flex-col items-center justify-center"
                    style={{ top: place.position.top, left: place.position.left }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isExpanding 
                        ? { scale: 30, opacity: 1, zIndex: 50 } 
                        : { opacity: 1, scale: 1, zIndex: 10 }
                    }
                    transition={
                      isExpanding 
                        ? { duration: 0.8, ease: "circIn" }
                        : { duration: 1.5, delay: place.delay, type: "spring", bounce: 0.2 }
                    }
                    onClick={() => handleNodeClick(place.id)}
                  >
                    {!expandingNode && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.15, 1],
                          opacity: [0.6, 0.9, 0.6],
                        }}
                        transition={{ 
                          duration: 4 + Math.random() * 2, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: Math.random() * 2 
                        }}
                        className={cn(
                          "rounded-full blur-2xl mix-blend-multiply",
                          `bg-gradient-to-tr ${place.colorFrom} ${place.colorTo}`
                        )}
                        style={{ width: place.size, height: place.size }}
                      />
                    )}
                    
                    {/* The core node */}
                    <motion.div 
                      className={cn(
                        "absolute rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)]",
                        `bg-gradient-to-tr ${place.colorFrom} ${place.colorTo}`
                      )}
                      style={{ 
                        width: place.size * 0.4, 
                        height: place.size * 0.4,
                        filter: isExpanding ? 'blur(20px)' : 'blur(4px)'
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
            
            {/* Overlay during expansion */}
            <AnimatePresence>
              {expandingNode && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="absolute inset-0 bg-white/40 backdrop-blur-md z-40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Inbox Floating Card */}
            {!expandingNode && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, type: "spring", bounce: 0.4 }}
                className="absolute bottom-[130px] left-6 right-6 z-40"
              >
                <button
                  onClick={() => navigate('/inbox')}
                  className="w-full bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-4 flex items-center space-x-4 hover:bg-white/90 transition-all text-left"
                >
                  <div className="relative flex-shrink-0 w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-pink-300 to-rose-100 flex items-center justify-center shadow-inner">
                    <Mail className="text-white" size={20} />
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 overflow-hidden pt-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-medium tracking-tight text-stone-800 text-[15px]">City Inbox</span>
                      <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/50">1 New</span>
                    </div>
                    <p className="text-xs text-stone-500 truncate font-light mt-1"><span className="font-medium text-stone-700">Central Park:</span> The cherry blossoms...</p>
                  </div>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}