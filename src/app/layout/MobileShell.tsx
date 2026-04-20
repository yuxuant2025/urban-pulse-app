import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, Compass, Scan, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MobileShell() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on onboarding and visit flows
  const hideNav = location.pathname === '/' || location.pathname.startsWith('/visit');

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Compass, path: '/discover', label: 'Explore' },
    { icon: Scan, path: '/map', label: 'AR' },
    { icon: User, path: '/profile', label: 'Me' },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-100/50">
      <div className="w-full max-w-[420px] h-[100dvh] bg-[#FDFCFB] sm:rounded-[3rem] sm:shadow-2xl sm:h-[850px] sm:max-h-[90vh] relative overflow-hidden flex flex-col sm:border-[8px] sm:border-stone-800 ring-1 ring-stone-200">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Soft Bottom Navigation */}
        <AnimatePresence>
          {!hideNav && (
            <motion.nav
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-0 w-full h-[110px] bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB]/90 to-transparent flex items-end justify-between px-6 pb-6 z-50 pointer-events-none"
            >
              <div className="flex items-center justify-between w-full pointer-events-auto bg-[#FDFCFB]/80 backdrop-blur-xl px-4 py-3 rounded-[2rem] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] border border-stone-100/50">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "relative flex flex-col items-center justify-center transition-all duration-500 ease-out w-16",
                        isActive ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
                      )}
                    >
                      <item.icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        className={cn("transition-all duration-500 mb-1.5", isActive && "scale-110 -translate-y-1")}
                      />
                      <span className={cn(
                        "text-[10px] font-medium tracking-wide transition-all duration-300",
                        isActive ? "opacity-100" : "opacity-70"
                      )}>
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1.5 w-1 h-1 bg-stone-900 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      
      {/* Global styles for hiding scrollbar but allowing scroll */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
