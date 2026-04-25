import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { PlaceAvatar, getBondStage, stageLabels, BondStage } from '../components/Avatar';
import { MapPin, PawPrint } from 'lucide-react';
import { usePlaces } from '../hooks/usePlaces';
import { cn } from '../layout/MobileShell';

const stageBadge: Record<BondStage, { dot: string; label: string }> = {
  introduced: { dot: 'bg-stone-400',   label: 'text-stone-500' },
  familiar:   { dot: 'bg-indigo-400',  label: 'text-indigo-500' },
  regular:    { dot: 'bg-emerald-500', label: 'text-emerald-600' },
  kept:       { dot: 'bg-rose-400',    label: 'text-rose-500' },
};

export default function Home() {
  const navigate = useNavigate();
  const { places, loading } = usePlaces(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Derive available type filters from fetched places
  const typeFilters = useMemo(() => {
    const types = [...new Set(places.map(p => p.type))];
    return types;
  }, [places]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return places;
    if (activeFilter === 'pet-friendly') return places.filter(p => p.petFriendly);
    return places.filter(p => p.type.toLowerCase() === activeFilter.toLowerCase());
  }, [places, activeFilter]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-stone-50/50 pb-32">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-stone-200/50 to-transparent pointer-events-none" />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="px-8 pt-16 pb-6 z-10"
      >
        <p className="text-stone-400 text-sm font-medium tracking-wide uppercase mb-1">Your Companions</p>
        <h1 className="text-3xl font-medium tracking-tight text-stone-800 leading-[1.1]">
          Who will you <br/>visit today?
        </h1>
      </motion.header>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-6 pb-6 z-10 flex space-x-2 overflow-x-auto no-scrollbar"
      >
        {['all', ...typeFilters, 'pet-friendly'].map(f => {
          const active = activeFilter === f;
          const label = f === 'all' ? 'All' : f === 'pet-friendly' ? 'Pet Friendly' : f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'shrink-0 flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                active
                  ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                  : 'bg-white/70 text-stone-500 border-stone-200/60 hover:bg-white'
              )}
            >
              {f === 'pet-friendly' && <PawPrint size={12} />}
              <span>{label}</span>
            </button>
          );
        })}
      </motion.div>

      <div className="px-6 flex-1 flex flex-col space-y-6 z-10 overflow-visible">
        {loading ? (
          // Skeleton cards while loading
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white/70 rounded-[2rem] p-6 animate-pulse border border-stone-100">
              <div className="w-20 h-20 rounded-full bg-stone-200 mx-auto mb-6" />
              <div className="h-5 bg-stone-200 rounded-full w-3/4 mx-auto mb-3" />
              <div className="h-3 bg-stone-100 rounded-full w-1/2 mx-auto" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-stone-400 text-sm pt-16"
          >
            No companions match this filter.
          </motion.p>
        ) : (
          filtered.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/place/${place.id}`)}
              className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] border border-stone-100 flex flex-col items-center cursor-pointer hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${place.color.from} to-transparent opacity-20 blur-3xl rounded-full pointer-events-none group-hover:opacity-40 transition-opacity duration-1000`} />

              {/* Bond stage badge */}
              {(() => {
                const stage = getBondStage(place.relationshipLevel);
                const badge = stageBadge[stage];
                return (
                  <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span className={`text-[11px] font-semibold uppercase tracking-widest ${badge.label}`}>
                      {stageLabels[stage]}
                    </span>
                  </div>
                );
              })()}

              <div className="py-6 flex justify-center w-full">
                <PlaceAvatar
                  colorFrom={place.color.from}
                  colorTo={place.color.to}
                  shadow={place.color.shadow}
                  mood={place.mood}
                  relationshipLevel={place.relationshipLevel}
                  size="lg"
                />
              </div>

              <div className="w-full mt-4 text-center">
                <h2 className="text-2xl font-medium tracking-tight text-stone-800 mb-1">{place.name}</h2>
                <div className="flex items-center justify-center space-x-1.5 text-stone-400 mb-4">
                  <MapPin size={12} />
                  <span className="text-xs uppercase tracking-wider font-medium">{place.type}</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-100/50 border border-stone-200/50 backdrop-blur-sm">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)] bg-gradient-to-tr ${place.color.from} ${place.color.to}`} />
                  <span className="text-sm text-stone-600 font-medium">Feels {place.mood}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${place.relationshipLevel}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${place.color.from} ${place.color.to}`}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
