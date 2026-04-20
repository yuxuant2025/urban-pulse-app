import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Camera, MessageSquare, Plus, X, Download } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../layout/MobileShell';

interface TimeCapsule {
  id: string;
  author: string;
  type: 'stranger' | 'friend';
  text: string;
  time: string;
  position: { top: string; left: string };
  size: number;
  delay: number;
}

const capsules: TimeCapsule[] = [
  {
    id: 'c1',
    author: 'Stranger',
    type: 'stranger',
    text: "Sat here for two hours watching the clouds. Everything felt okay for a moment.",
    time: "2 hours ago",
    position: { top: '35%', left: '25%' },
    size: 140,
    delay: 0,
  },
  {
    id: 'c2',
    author: 'Sarah',
    type: 'friend',
    text: "This spot always reminds me of that summer we stayed out till 4am laughing at nothing.",
    time: "Yesterday",
    position: { top: '55%', left: '75%' },
    size: 160,
    delay: 2.5,
  },
  {
    id: 'c3',
    author: 'Stranger',
    type: 'stranger',
    text: "The coffee here is terrible but the view is everything.",
    time: "4 hours ago",
    position: { top: '25%', left: '65%' },
    size: 120,
    delay: 5,
  },
  {
    id: 'c4',
    author: 'Marcus',
    type: 'friend',
    text: "Waiting for you here. Hurry up!",
    time: "Just now",
    position: { top: '70%', left: '35%' },
    size: 150,
    delay: 7.5,
  }
];

export default function MapScreen() {
  const navigate = useNavigate();
  // view: entry -> initial screen, camera -> AR view
  const [view, setView] = useState<'entry' | 'camera'>('entry');
  const [activeCapsule, setActiveCapsule] = useState<TimeCapsule | null>(null);
  const [screenCaptured, setScreenCaptured] = useState(false);
  const [capturedState, setCapturedState] = useState<{
    capsule: TimeCapsule | null;
    image: string;
    location: string;
    time: string;
  } | null>(null);
  const [caption, setCaption] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleCapture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScreenCaptured(true);
    setTimeout(() => {
      setScreenCaptured(false);
      setCapturedState({
        capsule: activeCapsule,
        image: "https://images.unsplash.com/photo-1775608523794-3bd5857c40f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVycmVkJTIwY2l0eSUyMHBhcmslMjBwbGF6YSUyMG91dGRvb3IlMjBkdXNrfGVufDF8fHx8MTc3NTc5MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        location: "Central Park Plaza",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setActiveCapsule(null);
    }, 400);
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReplying(true);
  };

  const sendReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplyText("");
    setIsReplying(false);
    setActiveCapsule(null); // optionally close the capsule after sending
  };

  return (
    <div className="flex flex-col h-[100dvh] relative overflow-hidden bg-stone-900 text-stone-100">
      <AnimatePresence mode="wait">
        {view === 'entry' ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            {/* Cinematic soft background gradient */}
            <motion.div 
              animate={{ 
                background: [
                  "radial-gradient(circle at 30% 30%, rgba(35,35,45,1) 0%, rgba(20,20,25,1) 100%)",
                  "radial-gradient(circle at 70% 70%, rgba(45,35,35,1) 0%, rgba(20,20,25,1) 100%)",
                  "radial-gradient(circle at 30% 30%, rgba(35,35,45,1) 0%, rgba(20,20,25,1) 100%)"
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 z-0 pointer-events-none"
            />

            <div className="z-10 flex flex-col items-center justify-center w-full h-full px-8">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="text-2xl font-light tracking-wide text-stone-300 text-center leading-relaxed mb-6"
              >
                Time capsules<br/>are floating here.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="text-stone-500 font-light text-sm text-center max-w-[280px]"
              >
                Discover what friends and strangers have left behind in this exact spot.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="absolute bottom-24 z-10"
            >
              <button 
                onClick={() => setView('camera')}
                className="px-10 py-3.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium tracking-[0.15em] uppercase text-stone-300 hover:bg-white/10 hover:text-white transition-all duration-700"
              >
                Open Lens
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 flex flex-col z-10 bg-black"
          >
            {/* Simulated AR Background View */}
            <img 
              src="https://images.unsplash.com/photo-1775608523794-3bd5857c40f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVycmVkJTIwY2l0eSUyMHBhcmslMjBwbGF6YSUyMG91dGRvb3IlMjBkdXNrfGVufDF8fHx8MTc3NTc5MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="AR Environment"
              className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
              style={{ filter: 'blur(8px) brightness(0.65)' }}
            />

            {/* Simulated Camera Flash Effect */}
            <AnimatePresence>
              {screenCaptured && (
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-white z-50 pointer-events-none" 
                />
              )}
            </AnimatePresence>

            {/* Ambient drifting particles for spatial depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ 
                    opacity: 0, 
                    x: `${Math.random() * 100}vw`, 
                    y: `${Math.random() * 100}vh`,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    opacity: [0, 0.4, 0],
                    x: `+=${(Math.random() - 0.5) * 60}`,
                    y: `-=${Math.random() * 60 + 30}`
                  }}
                  transition={{ 
                    duration: 15 + Math.random() * 20, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 15 
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-stone-300/40 blur-[2px]"
                />
              ))}
            </div>

            {/* Minimal Top Nav */}
            <div className="absolute top-14 left-6 z-30 flex items-center justify-between right-6">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setView('entry');
                }}
                className="p-3 bg-black/10 backdrop-blur-lg rounded-full text-white/60 hover:text-white/90 transition-colors border border-white/5"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              
              {/* Legend Hint */}
              <div className="flex space-x-4 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Friends</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-stone-300 shadow-[0_0_8px_rgba(214,211,209,0.8)]" />
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Strangers</span>
                </div>
              </div>
            </div>

            {/* Interactive Capsules (Dots) */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {capsules.map(cap => {
                const isFriend = cap.type === 'friend';
                const colorGlow = isFriend ? 'bg-emerald-400' : 'bg-stone-300';
                const colorCore = isFriend ? 'bg-emerald-300' : 'bg-white';

                return (
                  <motion.div
                    key={cap.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: [0.6, 1, 0.6], 
                      scale: [1, 1.15, 1],
                      y: [0, -15, 0] // Gentle floating bob
                    }}
                    transition={{ 
                      duration: 4 + cap.delay * 0.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: cap.delay
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCapsule(cap);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
                    style={{ 
                      top: cap.position.top, 
                      left: cap.position.left,
                      width: cap.size, 
                      height: cap.size,
                    }}
                  >
                    {/* The glowing aura */}
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-[24px] opacity-40 group-hover:opacity-60 transition-opacity",
                      colorGlow
                    )} />
                    
                    {/* Outer ring */}
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: cap.delay }}
                      className={cn("absolute w-12 h-12 rounded-full blur-[6px] pointer-events-none opacity-30", colorGlow)}
                    />

                    {/* The solid core */}
                    <div className={cn(
                      "relative w-3.5 h-3.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.9)] z-10",
                      colorCore
                    )} />
                  </motion.div>
                );
              })}
            </div>

            {/* Capsule Content Modal */}
            <AnimatePresence>
              {activeCapsule && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-[60] flex items-center justify-center px-6 bg-black/40 backdrop-blur-md"
                  onClick={() => {
                    setActiveCapsule(null);
                    setIsReplying(false);
                    setReplyText("");
                  }}
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-[340px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Subtle color bleed behind content */}
                    <div className={cn(
                      "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[50px] opacity-20 pointer-events-none",
                      activeCapsule.type === 'friend' ? 'bg-emerald-400' : 'bg-stone-300'
                    )} />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border border-white/20 shadow-inner",
                          activeCapsule.type === 'friend' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-stone-300/20 text-stone-200'
                        )}>
                          <span className="text-sm font-medium">{activeCapsule.author[0]}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm leading-none">{activeCapsule.author}</p>
                          <p className="text-white/40 text-[11px] mt-1 uppercase tracking-wider">{activeCapsule.time}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setActiveCapsule(null);
                          setIsReplying(false);
                          setReplyText("");
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                      >
                        <X size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    {/* Body */}
                    <div className="mb-8 relative z-10">
                      <AnimatePresence mode="wait">
                        {!isReplying ? (
                          <motion.p 
                            key="view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white/90 text-lg font-light leading-relaxed tracking-wide"
                          >
                            "{activeCapsule.text}"
                          </motion.p>
                        ) : (
                          <motion.div 
                            key="reply"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col"
                          >
                            <textarea 
                              autoFocus
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${activeCapsule.author}...`}
                              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white/90 placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 min-h-[100px] resize-none mb-4"
                            />
                            <button 
                              onClick={sendReply}
                              disabled={!replyText.trim()}
                              className="w-full py-3 px-4 bg-white disabled:bg-white/50 text-stone-900 disabled:text-stone-500 rounded-xl font-medium text-sm transition-colors"
                            >
                              Send
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <AnimatePresence>
                      {!isReplying && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10, position: 'absolute', pointerEvents: 'none' }}
                          className="flex space-x-3 relative z-10"
                        >
                          <button 
                            onClick={handleCapture}
                            className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl flex items-center justify-center space-x-2 text-white/90 text-sm font-medium border border-white/10 backdrop-blur-md"
                          >
                            <Camera size={18} strokeWidth={1.5} />
                            <span>Capture</span>
                          </button>
                          <button 
                            onClick={handleReply}
                            className="flex-1 py-3.5 px-4 bg-white hover:bg-white/90 transition-colors rounded-2xl flex items-center justify-center space-x-2 text-stone-900 text-sm font-medium shadow-lg"
                          >
                            <MessageSquare size={18} strokeWidth={1.5} />
                            <span>Reply</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Very Small Hint Text */}
            <div className="absolute bottom-12 inset-x-0 flex justify-center pointer-events-none z-20">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 3, delay: 2.5 }}
                className="text-[10px] uppercase tracking-[0.25em] font-medium text-stone-300"
              >
                Look around slowly
              </motion.p>
            </div>

            {/* Capture Review Overlay */}
            <AnimatePresence>
              {capturedState && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 z-[70] bg-stone-900 flex flex-col"
                >
                  <div className="flex items-center justify-between p-6 pt-12 z-10 relative">
                    <button 
                      onClick={() => {
                        setCapturedState(null);
                        setCaption("");
                      }}
                      className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                    >
                      <X size={24} strokeWidth={1.5} />
                    </button>
                    <span className="text-white font-medium text-sm tracking-wide">New Memory</span>
                    <div className="w-10" />
                  </div>

                  <div className="flex-1 px-6 pb-8 flex flex-col relative z-10 overflow-y-auto no-scrollbar">
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-black shrink-0 aspect-[3/4]">
                      <img src={capturedState.image} alt="Capture" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                      
                      {/* Stamp Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                          <div className="flex justify-between items-end">
                            <div>
                              <h3 className="text-white font-medium text-lg tracking-tight">{capturedState.location}</h3>
                              <p className="text-white/60 text-[11px] uppercase tracking-wider mt-1">{capturedState.time} • Urban Lenses</p>
                            </div>
                          </div>
                          {capturedState.capsule && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-white/90 text-sm font-light leading-relaxed">
                                "{capturedState.capsule.text}"
                              </p>
                              <p className="text-white/50 text-xs mt-2">- {capturedState.capsule.author}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 shrink-0">
                      <textarea 
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Add a thought to this memory..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-colors resize-none h-[100px] text-sm"
                      />
                    </div>

                    <button 
                      onClick={() => {
                        setCapturedState(null);
                        setCaption("");
                      }}
                      className="w-full mt-6 py-4 rounded-[1.5rem] bg-white text-stone-900 font-medium text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 shrink-0"
                    >
                      <Download size={18} strokeWidth={2} />
                      <span>Save to My Memory</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}