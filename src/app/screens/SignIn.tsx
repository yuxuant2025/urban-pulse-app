import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) navigate('/home', { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setWorking(true);
    setError('');

    if (isSignUp) {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setWorking(false); return; }
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: email.split('@')[0],
        });
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setWorking(false); return; }
    }

    setWorking(false);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-stone-900 text-stone-100">

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
            <h1 className="text-3xl font-light tracking-wide text-stone-200 mb-4">Urban Pulse</h1>
            <p className="text-sm text-stone-400 font-light tracking-widest uppercase">
              Build a relationship with your city.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col space-y-3 max-w-sm mx-auto mb-8 mt-16"
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-4 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm"
          />

          {error && (
            <p className={`text-xs px-2 ${error.startsWith('Check') ? 'text-teal-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={working || !email.trim() || !password.trim()}
            className="w-full flex items-center justify-center space-x-2 rounded-[2rem] bg-white/10 hover:bg-white/15 border border-white/10 p-4 transition-all disabled:opacity-50 mt-2"
          >
            {working
              ? <span className="text-sm text-stone-300">Please wait…</span>
              : <>
                  <span className="text-sm font-medium text-stone-200">{isSignUp ? 'Create account' : 'Sign in'}</span>
                  <ArrowRight size={16} className="text-stone-400" />
                </>
            }
          </button>

          <button
            onClick={() => { setIsSignUp(v => !v); setError(''); }}
            className="w-full text-xs text-stone-500 hover:text-stone-300 transition-colors py-2"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-[10px] text-stone-500 text-center max-w-[250px] leading-relaxed"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </div>
    </div>
  );
}
