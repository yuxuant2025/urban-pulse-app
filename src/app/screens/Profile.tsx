import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Map, MapPin, ChevronLeft, ChevronRight, Flame, Image as ImageIcon, Sparkles, User, Calendar, Heart, HandHeart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../layout/MobileShell';
import { myPlaces } from '../data';
import { PlaceAvatar } from '../components/Avatar';

const MEMORIES = [
  { 
    id: 'm1', 
    image: 'https://images.unsplash.com/photo-1586633582499-c40a488cd1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBjaXR5JTIwc3Vuc2V0fGVufDF8fHx8MTc3NTk0MTk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
    companionId: '1', 
    text: "Felt peaceful watching the sunset.", 
    position: { top: '15%', left: '10%' },
    date: "OCT 12"
  },
  { 
    id: 'm2', 
    image: 'https://images.unsplash.com/photo-1772436927552-398a418eae6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwaW4lMjBjb3JuZXJ8ZW58MXx8fHwxNzc1OTQxOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
    companionId: '2', 
    text: "Quietly reading in the corner.", 
    position: { top: '55%', left: '55%' },
    date: "OCT 15"
  },
  { 
    id: 'm3', 
    image: 'https://images.unsplash.com/photo-1775608523794-3bd5857c40f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVycmVkJTIwY2l0eSUyMHBhcmslMjBwbGF6YSUyMG91dGRvb3IlMjBkdXNrfGVufDF8fHx8MTc3NTc5MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
    companionId: '1', 
    text: "Sat here for two hours watching the clouds.", 
    position: { top: '35%', left: '60%' },
    date: "OCT 16"
  },
  {
    id: 'm4', 
    image: 'https://images.unsplash.com/photo-1666282842588-65441e96af4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbG9jYWwlMjBjYWZlJTIwY29mZmVlfGVufDF8fHx8MTc3NTk0MTk2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
    companionId: '3', 
    text: "Perfect morning brew.", 
    position: { top: '75%', left: '25%' },
    date: "OCT 18"
  }
];

export default function Profile() {
  const [showAlbum, setShowAlbum] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-stone-50/50 pb-32">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-stone-200/50 to-transparent pointer-events-none" />

      {/* Headings */}
      <header className="px-8 pt-16 pb-2 z-10">
        <p className="text-stone-400 text-sm font-medium tracking-wide uppercase mb-1">Your Story</p>
        <h1 className="text-3xl font-medium tracking-tight text-stone-800 leading-[1.1]">
          Your connection <br/>to the city
        </h1>
      </header>

      {/* Profile Details */}
      <div className="px-6 flex flex-col items-center pt-6 pb-8 z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative mb-4"
        >
          <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-white shadow-xl bg-stone-200 flex items-center justify-center text-stone-400">
             <User size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-2 bg-stone-900 text-white text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-full shadow-lg border border-stone-800">
            Level 12
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-medium tracking-tight text-stone-800 mt-2"
        >
          Alex
        </motion.h1>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-stone-500 font-light mt-0.5"
        >
          Urban Explorer
        </motion.p>
        
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center space-x-8 mt-8 w-full"
        >
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium text-stone-800">42h</p>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mt-1">Time Spent</p>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium text-stone-800">{myPlaces.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mt-1">Companions</p>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div className="flex flex-col items-center">
            <p className="text-xl font-medium text-stone-800">{MEMORIES.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mt-1">Memories</p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 flex-1 flex flex-col z-10">
        
        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 font-medium">Badges</h2>
            <span className="text-[10px] font-medium text-stone-300 uppercase tracking-widest">3 Unlocked</span>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-2 shadow-sm text-orange-500 border border-orange-200/50">
                <Flame size={20} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">Streak</span>
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2 shadow-sm text-blue-500 border border-blue-200/50">
                <Map size={20} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">Explorer</span>
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-2 shadow-sm text-emerald-500 border border-emerald-200/50">
                <ImageIcon size={20} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">Lens Master</span>
            </div>
            <div className="flex flex-col items-center flex-shrink-0 opacity-40 grayscale">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-2 border border-stone-200 border-dashed text-stone-400">
                <Sparkles size={20} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">Bonded</span>
            </div>
          </div>
        </motion.div>

        {/* Companions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 font-medium">My Companions</h2>
            <span className="text-[10px] font-medium text-stone-300 uppercase tracking-widest">View All</span>
          </div>
          <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-4 px-2">
            {myPlaces.map(place => {
              const hours = Math.round(place.relationshipLevel / 5) || 1;
              return (
                <div 
                  key={place.id} 
                  onClick={() => navigate(`/place/${place.id}`)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-16 h-16 mb-3 relative flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlaceAvatar
                      colorFrom={place.color.from}
                      colorTo={place.color.to}
                      shadow={place.color.shadow}
                      mood={place.mood}
                      size="sm"
                    />
                  </div>
                  <span className="text-[10px] text-stone-700 font-medium leading-tight max-w-[64px] text-center mb-0.5 truncate w-full">
                    {place.name}
                  </span>
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider font-medium">
                    {hours}h spent
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Memory Album Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-4">Saved Memories</h2>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAlbum(true)}
            className="relative h-[180px] w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 cursor-pointer overflow-hidden"
          >
            {/* Stack of photos simulation */}
            <div className="absolute right-4 top-8 w-28 h-36 bg-stone-200 rounded-xl rotate-[15deg] shadow-sm border-4 border-white overflow-hidden origin-bottom-right">
              <img src={MEMORIES[0].image} className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="absolute right-12 top-6 w-28 h-36 bg-stone-300 rounded-xl -rotate-[5deg] shadow-md border-4 border-white overflow-hidden origin-bottom-right">
              <img src={MEMORIES[1].image} className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="absolute right-[4.5rem] top-4 w-[110px] h-[140px] bg-stone-100 rounded-xl -rotate-2 shadow-lg border-4 border-white overflow-hidden origin-bottom-right">
              <img src={MEMORIES[2].image} className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute inset-y-0 left-0 p-7 flex flex-col justify-center w-[55%] z-10 bg-gradient-to-r from-white via-white/90 to-transparent">
              <h3 className="text-[22px] font-medium text-stone-800 leading-[1.1] tracking-tight">Memory<br/>Album</h3>
              <p className="text-stone-400 text-xs font-medium uppercase tracking-widest mt-3">{MEMORIES.length} Captures</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Become a Guardian */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-4">Become a Guardian</h2>
          <div className="flex flex-col space-y-3">
            {/* Volunteer */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <HandHeart size={18} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Volunteer</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 font-medium">Give your time</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-300" />
            </div>
            
            {/* Host Activity */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Calendar size={18} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Host Activity</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 font-medium">Organize an event</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-300" />
            </div>
            
            {/* Donate */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Heart size={18} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Donate</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 font-medium">Support the city</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-stone-300" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Memory Map Full Screen View */}
      <AnimatePresence>
        {showAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-[#F5F4F0] overflow-hidden flex flex-col"
          >
            {/* Soft grid background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]" 
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 inset-x-0 p-6 pt-14 z-20 flex items-center justify-between pointer-events-none"
            >
              <button 
                onClick={() => setShowAlbum(false)}
                className="p-3 rounded-full bg-white/70 backdrop-blur-xl shadow-sm pointer-events-auto border border-stone-200/50 hover:bg-white transition-colors"
              >
                <ChevronLeft size={24} className="text-stone-800" strokeWidth={1.5} />
              </button>
              <div className="flex flex-col items-center bg-white/70 backdrop-blur-xl px-6 py-2.5 rounded-full shadow-sm border border-stone-200/50 pointer-events-auto">
                <span className="text-stone-800 font-medium tracking-wide text-sm">Memory Map</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">Pan around</span>
              </div>
              <div className="w-[50px]" /> {/* spacer for center alignment */}
            </motion.div>

            {/* Draggable Map Canvas */}
            <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
              <motion.div 
                initial={{ x: -150, y: -50 }}
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                className="w-[1000px] h-[1000px] cursor-grab active:cursor-grabbing"
              >
                {MEMORIES.map((mem, i) => {
                  const companion = myPlaces.find(c => c.id === mem.companionId);
                  return (
                    <motion.div
                      key={mem.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 20 }}
                      className="absolute group"
                      style={{ top: mem.position.top, left: mem.position.left }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                    >
                      {/* The Photo Polaroid Style */}
                      <div className="w-[170px] bg-white p-2.5 pb-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-[2px] relative transition-transform">
                        <div className="aspect-[4/5] bg-stone-100 rounded-[1px] overflow-hidden">
                          <img src={mem.image} className="w-full h-full object-cover" />
                        </div>
                        
                        <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] opacity-80">
                          {mem.date}
                        </p>
                        
                        {/* Companion Pin/Avatar attached to the side */}
                        {companion && (
                          <div className="absolute -right-6 -top-6 rotate-12 transition-transform flex items-center justify-center z-10">
                            <PlaceAvatar
                              colorFrom={companion.color.from}
                              colorTo={companion.color.to}
                              shadow={companion.color.shadow}
                              mood={companion.mood}
                              size="sm"
                              animate={false}
                            />
                          </div>
                        )}
                      </div>

                      {/* Memory Text Floating Card */}
                      <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-max max-w-[200px] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-stone-200/60 pointer-events-none">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 border-l border-t border-stone-200/60 rotate-45" />
                        <p className="text-[13px] text-stone-600 leading-snug font-medium text-center relative z-10">"{mem.text}"</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}