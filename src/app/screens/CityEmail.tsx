import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin } from 'lucide-react';
import { cityEmails } from './CityInbox';
import { cn } from '../layout/MobileShell';

export default function CityEmail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const email = cityEmails.find(e => e.id === id);

  if (!email) {
     return <div className="p-8 text-center text-stone-500">Email not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#FAF9F7] relative overflow-hidden pb-32">
      {/* Ambient Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className={cn("absolute top-[-5%] right-[-15%] w-[350px] h-[350px] rounded-full blur-[80px] mix-blend-multiply pointer-events-none bg-gradient-to-bl", email.colorFrom, email.colorTo)}
      />

      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between p-6 pt-12">
        <button
          onClick={() => navigate('/inbox')}
          className="p-3 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:scale-105 transition-transform"
        >
          <ChevronLeft size={24} className="text-stone-700" strokeWidth={1.5} />
        </button>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex-1 px-8 overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4"
        >
          <div className="flex items-center space-x-4 mb-8 bg-white/40 p-4 rounded-[2rem] border border-white shadow-sm backdrop-blur-xl">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr shadow-inner shrink-0", email.colorFrom, email.colorTo)}>
              <span className="text-white font-medium text-xl">{email.sender[0]}</span>
            </div>
            <div>
              <h2 className="text-lg font-medium text-stone-800">{email.sender}</h2>
              <p className="text-sm text-stone-500 font-light">{email.date} at {email.time}</p>
            </div>
          </div>

          <h1 className="text-2xl font-medium tracking-tight text-stone-800 mb-8 leading-snug">
            {email.subject}
          </h1>

          <div className="prose prose-stone prose-p:leading-relaxed text-stone-600 font-light text-[15px] whitespace-pre-wrap">
            {email.body}
          </div>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 mb-8"
        >
          <button
            onClick={() => navigate('/discover')}
            className="w-full py-5 bg-stone-900 text-[#FAF9F7] rounded-[2rem] text-base font-medium shadow-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center space-x-3"
          >
            <MapPin size={20} strokeWidth={1.5} />
            <span>Visit {email.sender}</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
}