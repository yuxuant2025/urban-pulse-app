import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Heart, Share2, Search, SlidersHorizontal, Send, MapPin, Bookmark, MessageCircle, Camera, Mic, Type, Play, UserPlus, Check, Grid, Scan } from 'lucide-react';
import { Capsule } from '../data';
import { PlaceAvatar } from '../components/Avatar';
import { cn } from '../layout/MobileShell';
import { useAuth } from '../context/AuthContext';
import { usePlace } from '../hooks/usePlaces';
import { useCapsules } from '../hooks/useCapsules';
import { useChat } from '../hooks/useChat';

const feelingOptions = [
  'Peaceful', 'Anxious', 'Joyful', 'Tired', 'Inspired', 'Lonely', 'Curious'
];

type InteractionMode = 'checkin' | 'feed' | 'ar' | 'chat';

export default function VisitFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { place } = usePlace(id!);
  const { capsules, addCapsule, toggleFriend } = useCapsules(id!);
  const { messages, typing, sendMessage } = useChat(id!, place ? {
    name: place.name,
    type: place.type,
    mood: place.mood,
    personality: place.personality,
    description: place.description,
  } : undefined);

  const [mode, setMode] = useState<InteractionMode>(
    location.state?.mode === 'chat' ? 'chat' : 'checkin'
  );
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setChatInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const [capsuleInput, setCapsuleInput] = useState('');
  const [showCapsuleInput, setShowCapsuleInput] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'photo' | 'voice'>('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'friends'>('all');

  const myCapsules = capsules.filter(c => c.author.id === user?.id);
  const filteredCapsules = capsules.filter(c => {
    const matchesSearch =
      (c.text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.date.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'friends') return matchesSearch && c.author.id !== user?.id;
    return matchesSearch;
  });

  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep modal in sync after toggleFriend refetch
  useEffect(() => {
    if (selectedCapsule) {
      const updated = capsules.find(c => c.id === selectedCapsule.id);
      if (updated) setSelectedCapsule(updated);
    }
  }, [capsules]);

  const handleToggleFriend = (e: React.MouseEvent, authorId: string) => {
    e.stopPropagation();
    toggleFriend(authorId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === 'chat' || mode === 'ar') scrollToBottom();
  }, [messages, typing, mode]);

  if (!place) return null;

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling);
    setTimeout(() => {
      setMode('feed');
    }, 600);

  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    await sendMessage(text, 'user');
  };

  const handleAddCapsule = async () => {
    if (!capsuleInput.trim() && inputType === 'text') return;
    const content = inputType === 'text' ? capsuleInput : (inputType === 'photo' ? 'A beautiful moment captured.' : 'Voice note');
    const mediaUrl = inputType === 'photo'
      ? 'https://images.unsplash.com/photo-1699446602537-17836341cbee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwYXJrfGVufDF8fHx8MTc3NTY5ODIyMHww&ixlib=rb-4.1.0&q=80&w=1080'
      : inputType === 'voice' ? '0:24' : undefined;
    const color = place ? `bg-${place.color.from.split('-')[1]}-50` : 'bg-stone-50';
    await addCapsule(inputType, content, mediaUrl, color);
    setCapsuleInput('');
    setShowCapsuleInput(false);
    setInputType('text');
  };

  const renderCapsuleCard = (capsule: Capsule, i: number) => {
    const cardContent = (
      <>
        {capsule.type === 'photo' && capsule.mediaUrl && (
          <div className="w-full aspect-[4/5] relative">
            <img src={capsule.mediaUrl} alt="Memory" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-md">{capsule.date}</span>
              <Heart size={14} className="text-white drop-shadow-md" />
            </div>
            <div className="flex items-center space-x-2 mb-2 pt-2 border-t border-white/20">
              <button className="flex items-center justify-center p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm" title="Like"><Heart size={14} className="text-white" /></button>
              <button className="flex items-center justify-center p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm" title="Reply"><MessageCircle size={14} className="text-white" /></button>
              <button className="flex items-center justify-center p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm" title="Save"><Bookmark size={14} className="text-white" /></button>
              <button className="flex items-center justify-center p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm" title="Share"><Share2 size={14} className="text-white" /></button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
              <p className="text-sm font-medium leading-tight mb-2 drop-shadow-md line-clamp-2">{capsule.text}</p>
              <div className="flex items-center space-x-2">
                {capsule.author.avatar ? (
                  <img src={capsule.author.avatar} alt={capsule.author.name} className="w-5 h-5 rounded-full object-cover border border-white/50 pointer-events-auto" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 border border-white/50 flex items-center justify-center text-[10px] font-bold pointer-events-auto">
                    {capsule.author.name[0]}
                  </div>
                )}
                <span className="text-[10px] font-medium opacity-90 drop-shadow-md pointer-events-auto">{capsule.author.name}</span>
              </div>
            </div>
          </div>
        )}

        {capsule.type !== 'photo' && (
          <>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                {capsule.author.avatar ? (
                  <img src={capsule.author.avatar} alt={capsule.author.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                    {capsule.author.name[0]}
                  </div>
                )}
                <span className="text-xs font-medium text-stone-700">{capsule.author.name}</span>
              </div>
            </div>
            
            {capsule.type === 'voice' ? (
              <div className="flex items-center space-x-3 mb-4 bg-white/40 p-3 rounded-2xl border border-white/60">
                <button className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0">
                  <Play size={14} className="ml-0.5" />
                </button>
                <div className="flex-1 flex items-center space-x-1">
                  {[1,2,3,4,5,6,5,4,3].map((h, idx) => (
                    <div key={idx} className="w-1 bg-stone-400/50 rounded-full" style={{ height: `${h * 4}px` }} />
                  ))}
                </div>
                <span className="text-[10px] font-medium text-stone-500">{capsule.mediaUrl}</span>
              </div>
            ) : (
              <p className="text-stone-700 font-medium leading-relaxed text-sm mb-4">
                {capsule.text}
              </p>
            )}

            <div className="flex justify-between items-center mt-auto pt-3 border-t border-black/5">
              <div className="flex items-center space-x-1 -ml-2">
                <button className="flex items-center justify-center p-2 hover:bg-black/5 rounded-full transition-colors text-stone-500 hover:text-red-500" title="Like"><Heart size={16} /></button>
                <button className="flex items-center justify-center p-2 hover:bg-black/5 rounded-full transition-colors text-stone-500 hover:text-blue-500" title="Reply"><MessageCircle size={16} /></button>
                <button className="flex items-center justify-center p-2 hover:bg-black/5 rounded-full transition-colors text-stone-500 hover:text-stone-800" title="Save"><Bookmark size={16} /></button>
                <button className="flex items-center justify-center p-2 hover:bg-black/5 rounded-full transition-colors text-stone-500 hover:text-stone-800" title="Share"><Share2 size={16} /></button>
              </div>
            </div>
          </>
        )}
      </>
    );

    const card = (
      <div 
        onClick={() => setSelectedCapsule(capsule)}
        className={cn(
          "p-5 rounded-[2rem] border shadow-sm relative group cursor-pointer overflow-hidden",
          capsule.color,
          capsule.type === 'photo' ? 'p-0' : '',
          "border-white/50 backdrop-blur-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        )}
      >
        {cardContent}
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        key={capsule.id}
        className="relative"
      >
        {/* Timeline Node */}
        <div className="absolute -left-[35px] top-4 w-6 h-6 rounded-full bg-white border-4 border-stone-200 shadow-sm flex items-center justify-center z-10" />
        
        <div className="text-xs font-bold text-stone-400 mb-2 tracking-wide uppercase pl-2">{capsule.date}</div>
        {card}
      </motion.div>
    );
  };

  // --------------------------------------------------------
  // RENDER: CHECK-IN
  // --------------------------------------------------------
  if (mode === 'checkin') {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-stone-900 text-[#FAF9F7] px-6 py-8 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], filter: ['blur(40px)', 'blur(80px)', 'blur(40px)'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-tr ${place.color.from} ${place.color.to} rounded-full mix-blend-screen opacity-20 pointer-events-none -z-10`}
        />
        <nav className="flex justify-between items-center z-10">
          <button onClick={() => navigate(`/place/${id}`)} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </nav>
        <div className="flex-1 flex flex-col justify-center max-w-[320px] mx-auto z-10 w-full mt-12 mb-32">
          <AnimatePresence mode="wait">
            <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="space-y-12 w-full">
              <div className="flex justify-center">
                <PlaceAvatar colorFrom={place.color.from} colorTo={place.color.to} shadow={place.color.shadow} mood={place.mood} relationshipLevel={place.relationshipLevel} size="sm" />
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-center leading-snug">
                How are you feeling<br/>right now?
              </h1>
              <div className="flex flex-wrap gap-3 justify-center">
                {feelingOptions.map(feeling => (
                  <button
                    key={feeling}
                    onClick={() => handleFeelingSelect(feeling)}
                    className={`px-5 py-3 rounded-[2rem] text-sm tracking-wide transition-all duration-300 backdrop-blur-md border ${
                      selectedFeeling === feeling
                        ? 'bg-white text-stone-900 border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: INTERACTION HUB (Feed / Chat)
  // --------------------------------------------------------
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#FAF9F7] relative overflow-hidden">
      
      {/* Ambient background for the hub */}
      <div className={`absolute top-0 left-0 w-full h-64 bg-gradient-to-b ${place.color.from} to-transparent opacity-10 pointer-events-none`} />

      {/* Top Nav & Mode Switcher */}
      <header className="pt-14 pb-4 px-6 z-20 bg-[#FAF9F7]/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => mode === 'chat' ? navigate('/chat') : navigate(`/place/${id}`)} className="p-2 -ml-2 text-stone-500 hover:text-stone-800 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5 text-xs font-medium uppercase tracking-widest text-stone-400 mb-1">
              <MapPin size={10} />
              <span>Presently Here</span>
            </div>
            <h1 className="text-lg font-medium tracking-tight text-stone-800">{place.name}</h1>
          </div>
          
          <div className="w-10 flex justify-end">
            <PlaceAvatar colorFrom={place.color.from} colorTo={place.color.to} shadow={place.color.shadow} mood={place.mood} relationshipLevel={place.relationshipLevel} size="sm" animate={false} className="scale-50 origin-right" />
          </div>
        </div>

        {/* Tab Switcher — hidden in chat mode */}
        {mode !== 'chat' && (
          <div className="flex justify-center">
            <div className="bg-stone-100/80 p-1.5 rounded-full flex space-x-1 border border-stone-200/50 shadow-inner">
              <button
                onClick={() => setMode('feed')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2",
                  mode === 'feed' ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"
                )}
              >
                <Grid size={16} strokeWidth={mode === 'feed' ? 2 : 1.5} />
                <span>Capsules</span>
              </button>
              <button
                onClick={() => setMode('ar')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2",
                  mode === 'ar' ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"
                )}
              >
                <Scan size={16} strokeWidth={mode === 'ar' ? 2 : 1.5} />
                <span>AR</span>
              </button>
            </div>
          </div>
        )}
        {mode === 'chat' && (
          <p className="text-center text-xs font-medium text-stone-400">
            A conversation with {place.personality}
          </p>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="p-6 pb-32"
            >
              {/* Feed Header / Search */}
              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories..." 
                  className="w-full bg-white border border-stone-200 rounded-full py-3.5 pl-12 pr-12 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-300 focus:ring-4 focus:ring-stone-100 transition-all shadow-sm"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <SlidersHorizontal size={18} />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 flex-1 mr-4">
                  <button onClick={() => setActiveFilter('all')} className={cn("shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors", activeFilter === 'all' ? "bg-stone-800 text-white" : "bg-white text-stone-500 border border-stone-200")}>All</button>
                  <button onClick={() => setActiveFilter('my')} className={cn("shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors", activeFilter === 'my' ? "bg-stone-800 text-white" : "bg-white text-stone-500 border border-stone-200")}>My Capsule</button>
                  <button onClick={() => setActiveFilter('friends')} className={cn("shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors", activeFilter === 'friends' ? "bg-stone-800 text-white" : "bg-white text-stone-500 border border-stone-200")}>Friends</button>
                </div>
              </div>

              {/* Memory View: Bottle or Timeline */}
              <AnimatePresence mode="wait">
                {activeFilter === 'my' ? (
                  <motion.div
                    key="bottle"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center pt-2 pb-32"
                  >
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-8">
                      {myCapsules.length} {myCapsules.length === 1 ? 'memory' : 'memories'} sealed here
                    </p>

                    <div className="relative w-[200px]">
                      {/* SVG Bottle */}
                      <svg viewBox="0 0 200 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        {/* Cork */}
                        <rect x="68" y="2" width="64" height="24" rx="12" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
                        <line x1="82" y1="11" x2="118" y2="11" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1"/>
                        <line x1="78" y1="17" x2="122" y2="17" stroke="#F59E0B" strokeOpacity="0.3" strokeWidth="1"/>

                        {/* Bottle body (neck + shoulder + body) */}
                        <path
                          d="M80 26 L80 58 C80 58 26 78 14 104 L14 320 Q14 402 100 398 Q186 402 186 320 L186 104 C174 78 120 58 120 58 L120 26 Z"
                          fill="rgba(220,252,248,0.55)"
                          stroke="rgba(160,200,195,0.85)"
                          strokeWidth="1.5"
                        />
                        {/* Neck fill (covers the gap between cork and shoulder path) */}
                        <rect x="80" y="26" width="40" height="32" fill="rgba(220,252,248,0.55)"/>

                        {/* Left glass shine */}
                        <path d="M28 112 C24 170 24 250 28 310 C24 250 28 170 36 112 Z" fill="rgba(255,255,255,0.5)"/>
                        {/* Right subtle shine */}
                        <path d="M166 120 C168 160 168 220 166 270 C168 220 170 160 170 120 Z" fill="rgba(255,255,255,0.2)"/>
                      </svg>

                      {/* Capsules overlaid inside the bottle body */}
                      <div className="absolute inset-0 pt-[104px] px-[22px] pb-[30px] flex flex-col">
                        {myCapsules.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2.5 content-start">
                            {myCapsules.map((capsule, i) => (
                              <motion.button
                                key={capsule.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                                transition={{ delay: i * 0.12, type: 'spring', stiffness: 220, damping: 22 }}
                                onClick={() => setSelectedCapsule(capsule)}
                                className={cn(
                                  "p-2.5 rounded-xl border border-white/80 shadow-sm hover:scale-105 active:scale-95 transition-transform overflow-hidden flex flex-col gap-1 text-left",
                                  capsule.color || 'bg-stone-50'
                                )}
                              >
                                {capsule.type === 'photo' && capsule.mediaUrl ? (
                                  <img src={capsule.mediaUrl} alt="" className="w-full aspect-square object-cover rounded-lg" />
                                ) : capsule.type === 'voice' ? (
                                  <div className="flex items-end justify-center h-10 gap-0.5 py-1">
                                    {[2,5,7,4,3,6,4,2].map((h, idx) => (
                                      <div key={idx} className="w-0.5 bg-stone-400/60 rounded-full" style={{ height: `${h * 2.5}px` }} />
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-stone-700 leading-relaxed line-clamp-3">{capsule.text}</p>
                                )}
                                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wide mt-auto block">{capsule.date}</span>
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center flex-1 text-stone-400 space-y-1.5">
                            <p className="text-[11px] font-medium text-center">Your bottle is empty</p>
                            <p className="text-[10px] text-stone-300 text-center leading-relaxed">Leave a memory capsule<br/>to fill it</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="relative pl-8 ml-2 border-l-2 border-stone-200/60 space-y-10 py-4 max-w-md mx-auto">
                      {filteredCapsules.map((capsule, i) => renderCapsuleCard(capsule, i))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : mode === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col min-h-full"
            >
              <div className="flex-1 px-4 pb-32 space-y-3 pt-4">
                {messages.map((msg, i) => {
                  const isPlace = msg.sender === 'place';
                  return (
                    <div key={msg.id} className={cn("flex w-full", isPlace ? "justify-start" : "justify-end")}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn("max-w-[75%] relative flex flex-col", isPlace ? "items-start" : "items-end")}
                      >
                        <div className="flex items-end space-x-1.5">
                          {isPlace && (
                            <div className="shrink-0 mb-1">
                              <PlaceAvatar colorFrom={place.color.from} colorTo={place.color.to} shadow={place.color.shadow} mood={place.mood} relationshipLevel={place.relationshipLevel} size="sm" animate={false} className="w-5 h-5 scale-90 origin-bottom opacity-90" />
                            </div>
                          )}
                          <div className={cn(
                            "px-3.5 py-2 text-[15px] leading-snug shadow-sm",
                            isPlace
                              ? "bg-white border border-stone-100 text-stone-800 rounded-2xl rounded-bl-sm"
                              : "bg-[#0A7AFF] text-white border border-[#007AFF] rounded-2xl rounded-br-sm"
                          )}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                        <div className={cn("text-[10px] mt-1 font-medium opacity-60 px-1", isPlace ? "text-stone-500 ml-7" : "text-stone-500 mr-1")}>
                          {msg.time}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                {typing && (
                  <div className="flex w-full justify-start">
                    <div className="flex items-end space-x-1.5">
                      <div className="shrink-0 mb-1">
                        <PlaceAvatar colorFrom={place.color.from} colorTo={place.color.to} shadow={place.color.shadow} mood={place.mood} size="sm" animate={false} className="w-5 h-5 scale-90 origin-bottom opacity-90" />
                      </div>
                      <div className="px-4 py-3 bg-white border border-stone-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center space-x-1">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
              <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7] to-transparent pt-10 z-30">
                <div className="relative max-w-[420px] mx-auto flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={listening ? 'Listening...' : `Ask ${place.name} anything...`}
                      className={cn(
                        "w-full backdrop-blur-xl border rounded-[2rem] py-3 pl-5 pr-5 text-stone-700 placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-stone-100 transition-all shadow-sm text-[15px]",
                        listening ? "bg-red-50 border-red-200 placeholder:text-red-400" : "bg-stone-200/60 border-white/50 focus:bg-white"
                      )}
                    />
                    {listening && (
                      <motion.div
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <button
                    onClick={startListening}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0",
                      listening
                        ? "bg-red-500 text-white scale-110"
                        : "bg-stone-200/80 text-stone-500 hover:bg-stone-300"
                    )}
                  >
                    <Mic size={18} />
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="w-10 h-10 bg-[#0A7AFF] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-stone-300 transition-colors shadow-sm hover:bg-[#0060CC] shrink-0"
                  >
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-full px-8 pb-32 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className={`w-24 h-24 rounded-full bg-gradient-to-tr ${place.color.from} ${place.color.to} opacity-20 blur-2xl mb-8`}
              />
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${place.color.from} ${place.color.to} flex items-center justify-center shadow-lg mb-6`}>
                <Scan size={28} className="text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-medium text-stone-800 mb-2">AR Experience</h2>
              <p className="text-sm text-stone-400 leading-relaxed max-w-[240px]">
                Point your camera to reveal hidden memories and stories left here by others.
              </p>
              <div className="mt-8 px-6 py-3 rounded-full border border-stone-200 text-xs text-stone-400 font-medium tracking-wide uppercase">
                Coming soon
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Input Trigger (Always visible in feed mode) */}
      <AnimatePresence>
        {mode === 'feed' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px]"
          >
            {showCapsuleInput ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-white rounded-[2rem] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] border border-stone-200 p-4"
              >
                <div className="flex space-x-2 mb-3">
                  <button onClick={() => setInputType('text')} className={cn("p-2 rounded-full", inputType === 'text' ? "bg-stone-100 text-stone-900" : "text-stone-400")}><Type size={16} /></button>
                  <button onClick={() => setInputType('photo')} className={cn("p-2 rounded-full", inputType === 'photo' ? "bg-stone-100 text-stone-900" : "text-stone-400")}><Camera size={16} /></button>
                  <button onClick={() => setInputType('voice')} className={cn("p-2 rounded-full", inputType === 'voice' ? "bg-stone-100 text-stone-900" : "text-stone-400")}><Mic size={16} /></button>
                </div>
                
                {inputType === 'text' && (
                  <textarea 
                    autoFocus
                    value={capsuleInput}
                    onChange={(e) => setCapsuleInput(e.target.value)}
                    placeholder="Leave a piece of yourself here..."
                    className="w-full bg-stone-50 border-none rounded-xl p-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none resize-none min-h-[80px] mb-3"
                  />
                )}
                {inputType === 'photo' && (
                  <div className="w-full h-[120px] bg-stone-50 rounded-xl border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 mb-3">
                    <Camera size={24} className="mb-2" />
                    <span className="text-xs font-medium">Tap to take a photo</span>
                  </div>
                )}
                {inputType === 'voice' && (
                  <div className="w-full h-[120px] bg-stone-50 rounded-xl flex flex-col items-center justify-center text-stone-400 mb-3 space-y-4">
                    <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Mic size={20} />
                    </button>
                    <span className="text-xs font-medium">Hold to record</span>
                  </div>
                )}

                <div className="flex justify-between items-center px-1">
                  <button onClick={() => setShowCapsuleInput(false)} className="text-stone-400 text-sm font-medium">Cancel</button>
                  <button onClick={handleAddCapsule} className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium">Drop Capsule</button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full flex justify-center"
              >
                <button
                  onClick={() => setShowCapsuleInput(true)}
                  className="w-full bg-white/90 backdrop-blur-xl border border-stone-200 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] rounded-full py-4 text-stone-700 text-sm font-medium flex items-center justify-center space-x-2 hover:bg-stone-50 hover:scale-[1.02] transition-all"
                >
                  <Heart size={16} className="text-stone-500" />
                  <span>Leave a memory capsule...</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capsule Detail Modal */}
      <AnimatePresence>
        {selectedCapsule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedCapsule(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-[360px] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border",
                selectedCapsule.type === 'photo' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              )}
            >
              {selectedCapsule.type === 'photo' && selectedCapsule.mediaUrl && (
                <div className="relative w-full aspect-[4/5]">
                  <img src={selectedCapsule.mediaUrl} alt="Memory" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
                  <button onClick={() => setSelectedCapsule(null)} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80 drop-shadow-md mb-2 block">{selectedCapsule.date}</span>
                    <p className="text-lg font-medium leading-tight drop-shadow-md">{selectedCapsule.text}</p>
                  </div>
                </div>
              )}

              {selectedCapsule.type !== 'photo' && (
                <div className={cn("p-8 relative", selectedCapsule.color)}>
                  <button onClick={() => setSelectedCapsule(null)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors">
                    <X size={20} />
                  </button>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500/70 mb-6 block">{selectedCapsule.date}</span>
                  
                  {selectedCapsule.type === 'voice' ? (
                    <div className="my-8">
                      <button className="w-16 h-16 mx-auto rounded-full bg-stone-800 text-white flex items-center justify-center mb-6 shadow-xl shadow-stone-800/20 hover:scale-105 transition-transform">
                        <Play size={24} className="ml-1" />
                      </button>
                      <div className="flex justify-center items-center space-x-1.5 h-12">
                        {[2,3,5,8,4,2,3,6,9,12,8,5,3,2,4,7,5,3,2].map((h, idx) => (
                          <div key={idx} className="w-1.5 bg-stone-400/60 rounded-full" style={{ height: `${h * 4}px` }} />
                        ))}
                      </div>
                      <p className="text-center text-sm font-medium text-stone-500 mt-4">{selectedCapsule.mediaUrl}</p>
                    </div>
                  ) : (
                    <p className="text-xl text-stone-800 font-medium leading-relaxed my-4">
                      "{selectedCapsule.text}"
                    </p>
                  )}
                </div>
              )}

              {/* Interaction Bar */}
              <div className={cn(
                "px-6 py-4 flex items-center justify-between border-t",
                selectedCapsule.type === 'photo' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
              )}>
                <div className="flex items-center space-x-2">
                  <button className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors",
                    selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-red-400' : 'hover:bg-stone-100 text-stone-500 hover:text-red-500'
                  )} title="Like"><Heart size={18} /></button>
                  <button className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors",
                    selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-blue-400' : 'hover:bg-stone-100 text-stone-500 hover:text-blue-500'
                  )} title="Reply"><MessageCircle size={18} /></button>
                  <button className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors",
                    selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
                  )} title="Save"><Bookmark size={18} /></button>
                </div>
                <button className={cn(
                  "flex items-center justify-center p-2 rounded-full transition-colors",
                  selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
                )} title="Share"><Share2 size={18} /></button>
              </div>

              {/* Interaction Bar */}
              <div className={cn(
                "px-6 py-4 flex items-center justify-between border-t",
                selectedCapsule.type === 'photo' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
              )}>
                <div className="flex items-center space-x-2">
                  <button className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors",
                    selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-red-400' : 'hover:bg-stone-100 text-stone-500 hover:text-red-500'
                  )} title="Like"><Heart size={18} /></button>
                  <button className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors",
                    selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-blue-400' : 'hover:bg-stone-100 text-stone-500 hover:text-blue-500'
                  )} title="Reply"><MessageCircle size={18} /></button>
                  <button className={cn(
                    "flex items-center justify-center p-2 rounded-full transition-colors",
                    selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
                  )} title="Save"><Bookmark size={18} /></button>
                </div>
                <button className={cn(
                  "flex items-center justify-center p-2 rounded-full transition-colors",
                  selectedCapsule.type === 'photo' ? 'hover:bg-white/10 text-white/80 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
                )} title="Share"><Share2 size={18} /></button>
              </div>

              {/* Author Info & Connect */}
              <div className={cn(
                "p-6 flex items-center justify-between",
                selectedCapsule.type === 'photo' ? 'bg-stone-900 border-t border-stone-800 text-white' : 'bg-white border-t border-stone-100'
              )}>
                <div className="flex items-center space-x-3">
                  {selectedCapsule.author.avatar ? (
                    <img src={selectedCapsule.author.avatar} alt={selectedCapsule.author.name} className="w-10 h-10 rounded-full object-cover border border-stone-200/20 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 shadow-sm">
                      {selectedCapsule.author.name[0]}
                    </div>
                  )}
                  <div>
                    <p className={cn("text-sm font-semibold", selectedCapsule.type === 'photo' ? 'text-white' : 'text-stone-800')}>{selectedCapsule.author.name}</p>
                    <p className={cn("text-xs", selectedCapsule.type === 'photo' ? 'text-stone-400' : 'text-stone-500')}>Wanderer</p>
                  </div>
                </div>

                {selectedCapsule.author.id !== 'u0' && (
                  <button 
                    onClick={(e) => handleToggleFriend(e, selectedCapsule.author.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5",
                      selectedCapsule.author.isFriend 
                        ? (selectedCapsule.type === 'photo' ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700")
                        : (selectedCapsule.type === 'photo' ? "bg-white text-stone-900" : "bg-stone-900 text-white hover:bg-stone-800")
                    )}
                  >
                    {selectedCapsule.author.isFriend ? (
                      <>
                        <Check size={14} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="interaction-test" />
              <div className={cn(
                "p-6 flex items-center justify-between",
                selectedCapsule.type === 'photo' ? 'bg-stone-900 border-t border-stone-800 text-white' : 'bg-white border-t border-stone-100'
              )}>
                <div className="flex items-center space-x-3">
                  {selectedCapsule.author.avatar ? (
                    <img src={selectedCapsule.author.avatar} alt={selectedCapsule.author.name} className="w-10 h-10 rounded-full object-cover border border-stone-200/20 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 shadow-sm">
                      {selectedCapsule.author.name[0]}
                    </div>
                  )}
                  <div>
                    <p className={cn("text-sm font-semibold", selectedCapsule.type === 'photo' ? 'text-white' : 'text-stone-800')}>{selectedCapsule.author.name}</p>
                    <p className={cn("text-xs", selectedCapsule.type === 'photo' ? 'text-stone-400' : 'text-stone-500')}>Wanderer</p>
                  </div>
                </div>

                {selectedCapsule.author.id !== 'u0' && (
                  <button 
                    onClick={(e) => handleToggleFriend(e, selectedCapsule.author.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5",
                      selectedCapsule.author.isFriend 
                        ? (selectedCapsule.type === 'photo' ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700")
                        : (selectedCapsule.type === 'photo' ? "bg-white text-stone-900" : "bg-stone-900 text-white hover:bg-stone-800")
                    )}
                  >
                    {selectedCapsule.author.isFriend ? (
                      <>
                        <Check size={14} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
