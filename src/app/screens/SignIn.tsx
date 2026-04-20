import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Mail, ArrowRight } from 'lucide-react';
import { cn } from '../layout/MobileShell';

export default function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Navigate to the onboarding flow
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-stone-900 text-stone-100">
      
      {/* Cinematic ambient background */}
      <motion.div 
        animate={{ 
          background: [
            "radial-gradient(circle at 50% 0%, rgba(45,45,55,1) 0%, rgba(20,20,25,1) 100%)",
            "radial-gradient(circle at 50% 10%, rgba(55,45,45,1) 0%, rgba(20,20,25,1) 100%)",
            "radial-gradient(circle at 50% 0%, rgba(45,45,55,1) 0%, rgba(20,20,25,1) 100%)"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 z-0 pointer-events-none opacity-80"
      />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle glowing orbs representing the 'pulse' of the city */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[60px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[30%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-500/10 blur-[80px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full px-8 pt-32 pb-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center w-full mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="w-3 h-3 rounded-full bg-stone-300 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
            <h1 className="text-3xl font-light tracking-wide text-stone-200 mb-4">
              Urban Pulse
            </h1>
            <p className="text-sm text-stone-400 font-light tracking-widest uppercase">
              Build a relationship with your city.
            </p>
          </motion.div>
        </div>

        {/* Action Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col space-y-4 max-w-sm mx-auto mb-8 mt-16"
        >
          <button 
            onClick={handleSignIn}
            className="w-full relative group overflow-hidden rounded-[2rem] bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 p-4 transition-all duration-500"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 text-sm font-medium tracking-[0.1em] text-stone-200 uppercase">
              Continue with Apple
            </span>
          </button>
          
          <button 
            onClick={handleSignIn}
            className="w-full rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-sm border border-white/5 p-4 transition-all duration-500"
          >
            <span className="text-sm font-medium tracking-[0.1em] text-stone-400 uppercase">
              Continue with Google
            </span>
          </button>

          <button 
            onClick={handleSignIn}
            className="w-full flex items-center justify-center space-x-2 rounded-[2rem] bg-transparent hover:bg-white/5 border border-transparent p-4 transition-all duration-500 mt-2"
          >
            <Mail size={16} className="text-stone-500" />
            <span className="text-xs font-medium tracking-[0.1em] text-stone-500 uppercase">
              Continue with Email
            </span>
          </button>
        </motion.div>
        
        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-[10px] text-stone-500 text-center max-w-[250px] leading-relaxed"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}