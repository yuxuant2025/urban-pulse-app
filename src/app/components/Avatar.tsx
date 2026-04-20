import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '../layout/MobileShell';
import { Mood } from '../data';

interface AvatarProps {
  colorFrom: string;
  colorTo: string;
  shadow: string;
  mood: Mood;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  animate?: boolean;
}

export function PlaceAvatar({
  colorFrom,
  colorTo,
  shadow,
  mood,
  size = 'md',
  className,
  animate = true,
}: AvatarProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (!animate) return;

    // Mood-based breathing animation
    let duration = 4;
    let scale = [1, 1.05, 1];
    let borderRadius = ['45%', '55%', '45%'];
    let rotation = [0, 5, -5, 0];

    switch (mood) {
      case 'calm':
      case 'peaceful':
      case 'quiet':
        duration = 6;
        scale = [1, 1.03, 1];
        borderRadius = ['50%', '45%', '50%'];
        rotation = [0, 2, -2, 0];
        break;
      case 'energetic':
      case 'lively':
        duration = 2.5;
        scale = [1, 1.1, 1];
        borderRadius = ['40%', '60%', '40%'];
        rotation = [0, 10, -10, 0];
        break;
      case 'lonely':
      case 'misses you':
        duration = 5;
        scale = [1, 0.95, 1];
        borderRadius = ['60%', '40%', '60%'];
        rotation = [0, -3, 3, 0];
        break;
      case 'a bit crowded':
        duration = 3;
        scale = [1, 1.08, 1];
        borderRadius = ['35%', '65%', '35%'];
        rotation = [0, 8, -8, 0];
        break;
    }

    controls.start({
      scale,
      borderRadius,
      rotate: rotation,
      transition: {
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    });
  }, [mood, animate, controls]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    hero: 'w-64 h-64', // Very large for the detail screen
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer ambient glow */}
      <motion.div
        animate={animate ? controls : {}}
        className={cn(
          'absolute inset-0 bg-gradient-to-tr blur-2xl opacity-40 mix-blend-multiply',
          colorFrom,
          colorTo
        )}
      />
      
      {/* Core Entity */}
      <motion.div
        animate={animate ? controls : {}}
        className={cn(
          'relative bg-gradient-to-tr shadow-2xl backdrop-blur-md border border-white/20',
          colorFrom,
          colorTo,
          shadow,
          sizeClasses[size]
        )}
        style={{
          boxShadow: 'inset 0 0 40px rgba(255,255,255,0.4), 0 20px 50px -10px rgba(0,0,0,0.1)',
        }}
      >
        {/* Inner subtle core */}
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay rounded-[inherit]" />
      </motion.div>
    </div>
  );
}
