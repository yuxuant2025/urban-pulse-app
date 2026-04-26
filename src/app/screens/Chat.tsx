import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { MessageCircle, MapPin } from 'lucide-react';
import { PlaceAvatar } from '../components/Avatar';
import { usePlaces } from '../hooks/usePlaces';

export default function Chat() {
  const navigate = useNavigate();
  const { places, loading } = usePlaces(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-stone-50/50 pb-32">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-stone-200/50 to-transparent pointer-events-none" />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="px-8 pt-16 pb-8 z-10"
      >
        <p className="text-stone-400 text-sm font-medium tracking-wide uppercase mb-1">Conversations</p>
        <h1 className="text-3xl font-medium tracking-tight text-stone-800 leading-[1.1]">
          Speak with <br/>your city.
        </h1>
      </motion.header>

      <div className="px-6 flex-1 flex flex-col space-y-4 z-10">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white/70 rounded-[2rem] p-5 animate-pulse border border-stone-100 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 rounded-full w-1/2" />
                <div className="h-3 bg-stone-100 rounded-full w-3/4" />
              </div>
            </div>
          ))
        ) : (
          places.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/visit/${place.id}`, { state: { mode: 'chat' } })}
              className="group bg-white/70 backdrop-blur-xl rounded-[2rem] p-5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-stone-100 flex items-center space-x-4 cursor-pointer hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] transition-shadow duration-500 overflow-hidden relative"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${place.color.from} to-transparent opacity-10 blur-2xl rounded-full pointer-events-none`} />

              <PlaceAvatar
                colorFrom={place.color.from}
                colorTo={place.color.to}
                shadow={place.color.shadow}
                mood={place.mood}
                personality={place.personality}
                relationshipLevel={place.relationshipLevel}
                size="xs"
                noStageScale
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-medium tracking-tight text-stone-800">{place.name}</h2>
                <div className="flex items-center space-x-1 text-stone-400 mt-0.5">
                  <MapPin size={10} />
                  <span className="text-xs uppercase tracking-wider font-medium">{place.type}</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 italic truncate">"{place.personality}"</p>
              </div>

              <div className="shrink-0">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${place.color.from} ${place.color.to} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <MessageCircle size={16} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
