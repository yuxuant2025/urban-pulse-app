import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, MailOpen } from 'lucide-react';
import { cn } from '../layout/MobileShell';

export const cityEmails = [
  {
    id: 'e1',
    sender: 'Central Park',
    subject: 'The cherry blossoms are peaking this weekend!',
    preview: 'I thought you might want to know... the warm breeze finally arrived, and the pink petals are dancing everywhere.',
    body: "Hello friend,\n\nI thought you might want to know... the warm breeze finally arrived, and the pink petals are dancing everywhere. The air smells sweet, and the paths are covered in a soft blanket of flowers.\n\nCome visit me before they blow away. I've saved a quiet bench for you under the oldest tree.\n\nWarmly,\nCentral Park",
    time: '10:00 AM',
    date: 'Today',
    unread: true,
    colorFrom: 'from-pink-300',
    colorTo: 'to-rose-100',
  },
  {
    id: 'e2',
    sender: 'Old Bookstore',
    subject: 'Found a story you might like',
    preview: 'Someone just dropped off a first edition of your favorite author. It smells like vanilla...',
    body: "Someone just dropped off a first edition of your favorite author. It smells like vanilla and old paper. It's resting on the third shelf, waiting for someone who will appreciate it as much as you.\n\nCome by when you need an escape.\n\nQuietly,\nOld Bookstore",
    time: 'Yesterday',
    date: 'Yesterday',
    unread: false,
    colorFrom: 'from-purple-300',
    colorTo: 'to-indigo-100',
  },
  {
    id: 'e3',
    sender: 'Midnight Cafe',
    subject: 'Rainy day playlist',
    preview: 'It\'s pouring outside. I put on that jazz record you liked last time...',
    body: "It's pouring outside today.\n\nI put on that jazz record you liked last time you were here. The espresso machine is humming, and the window seat is open if you want to watch the city get washed clean.\n\nSee you soon,\nMidnight Cafe",
    time: 'Tuesday',
    date: 'Tuesday',
    unread: false,
    colorFrom: 'from-amber-300',
    colorTo: 'to-yellow-100',
  }
];

export default function CityInbox() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#FAF9F7] relative overflow-hidden pb-32">
      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between p-6 pt-12">
        <button
          onClick={() => navigate('/discover')}
          className="p-3 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:scale-105 transition-transform"
        >
          <ChevronLeft size={24} className="text-stone-700" strokeWidth={1.5} />
        </button>
        <h1 className="text-lg font-medium text-stone-800 absolute left-1/2 -translate-x-1/2">City Inbox</h1>
        <div className="w-12" /> {/* Spacer */}
      </nav>

      {/* List */}
      <main className="flex-1 px-6 overflow-y-auto no-scrollbar">
        <div className="space-y-4 mt-4">
          {cityEmails.map((email, i) => (
            <motion.button
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => navigate(`/inbox/${email.id}`)}
              className="w-full bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-5 flex items-start space-x-4 text-left transition-all hover:bg-white/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
            >
              <div className={cn("relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr shadow-inner", email.colorFrom, email.colorTo)}>
                {email.unread ? <Mail className="text-white" size={20} /> : <MailOpen className="text-white/80" size={20} />}
              </div>
              <div className="flex-1 overflow-hidden pt-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={cn("text-base truncate", email.unread ? "font-semibold text-stone-800" : "font-medium text-stone-700")}>{email.sender}</h3>
                  <span className={cn("text-[11px] whitespace-nowrap ml-2", email.unread ? "font-semibold text-stone-600" : "font-medium text-stone-400")}>{email.time}</span>
                </div>
                <p className={cn("text-sm truncate mb-1.5", email.unread ? "font-medium text-stone-800" : "text-stone-600")}>{email.subject}</p>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-light">{email.preview}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}