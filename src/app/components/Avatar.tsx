import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '../layout/MobileShell';
import { Mood } from '../data';

export type BondStage = 'introduced' | 'familiar' | 'regular' | 'kept';

export function getBondStage(level: number): BondStage {
  if (level >= 75) return 'kept';
  if (level >= 50) return 'regular';
  if (level >= 25) return 'familiar';
  return 'introduced';
}

export const stageLabels: Record<BondStage, string> = {
  introduced: 'Introduced',
  familiar: 'Familiar',
  regular: 'Regular',
  kept: 'Kept',
};

const FACE = 'rgba(30,18,6,0.82)';
const SHINE = 'rgba(255,255,255,0.90)';

// Oval eyes — wide ellipses, soot-sprite proportion
function CreatureFace() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="absolute inset-0 pointer-events-none">
      {/* Left eye */}
      <ellipse cx="33" cy="50" rx="13" ry="18" fill={FACE} />
      <ellipse cx="37" cy="44" rx="4.5" ry="6" fill={SHINE} />

      {/* Right eye */}
      <ellipse cx="67" cy="50" rx="13" ry="18" fill={FACE} />
      <ellipse cx="71" cy="44" rx="4.5" ry="6" fill={SHINE} />
    </svg>
  );
}

const stageScale: Record<BondStage, number> = {
  introduced: 0.58,
  familiar:   0.73,
  regular:    0.87,
  kept:       1.00,
};

const glowOpacity: Record<BondStage, number> = {
  introduced: 0.20,
  familiar:   0.32,
  regular:    0.44,
  kept:       0.60,
};

const roseOverlay: Record<BondStage, number> = {
  introduced: 0,
  familiar:   0.03,
  regular:    0.07,
  kept:       0.13,
};

interface AvatarProps {
  colorFrom: string;
  colorTo: string;
  shadow: string;
  mood: Mood;
  relationshipLevel?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  animate?: boolean;
  noStageScale?: boolean;
}

export function PlaceAvatar({
  colorFrom,
  colorTo,
  shadow,
  mood,
  relationshipLevel = 0,
  size = 'md' as 'xs' | 'sm' | 'md' | 'lg' | 'hero',
  className,
  animate = true,
  noStageScale = false,
}: AvatarProps) {
  const controls = useAnimation();
  const stage = getBondStage(relationshipLevel);
  const scale = noStageScale ? 1 : stageScale[stage];

  useEffect(() => {
    if (!animate) return;

    let duration = 4;
    let scaleAnim = [1, 1.05, 1];
    let borderRadius = ['45%', '55%', '45%'];
    let rotation = [0, 5, -5, 0];

    switch (mood) {
      case 'calm':
      case 'peaceful':
      case 'quiet':
        duration = 6;
        scaleAnim = [1, 1.03, 1];
        borderRadius = ['50%', '45%', '50%'];
        rotation = [0, 2, -2, 0];
        break;
      case 'energetic':
      case 'lively':
        duration = 2.5;
        scaleAnim = [1, 1.1, 1];
        borderRadius = ['40%', '60%', '40%'];
        rotation = [0, 10, -10, 0];
        break;
      case 'lonely':
      case 'misses you':
        duration = 5;
        scaleAnim = [1, 0.95, 1];
        borderRadius = ['60%', '40%', '60%'];
        rotation = [0, -3, 3, 0];
        break;
      case 'a bit crowded':
        duration = 3;
        scaleAnim = [1, 1.08, 1];
        borderRadius = ['35%', '65%', '35%'];
        rotation = [0, 8, -8, 0];
        break;
    }

    controls.start({
      scale: scaleAnim,
      borderRadius,
      rotate: rotation,
      transition: { duration, ease: 'easeInOut', repeat: Infinity },
    });
  }, [mood, animate, controls]);

  const sizeClasses = {
    xs:   'w-10 h-10',
    sm:   'w-16 h-16',
    md:   'w-24 h-24',
    lg:   'w-32 h-32',
    hero: 'w-64 h-64',
  };

  const showFace = true;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Ambient glow */}
      <motion.div
        animate={animate ? controls : {}}
        className={cn('absolute inset-0 bg-gradient-to-tr blur-2xl mix-blend-multiply', colorFrom, colorTo)}
        style={{ opacity: glowOpacity[stage] }}
      />

      {/* Body pulse — steady heartbeat on the whole creature */}
      <motion.div
        animate={animate ? { scale: [1, 1.07, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
      {/* Stage scale wrapper — grows the body with bond level */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
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
          <div className="absolute inset-0 bg-white/20 mix-blend-overlay rounded-[inherit]" />

          {/* Warmth overlay — rosier as bond deepens */}
          {roseOverlay[stage] > 0 && (
            <div
              className="absolute inset-0 rounded-[inherit]"
              style={{ background: `rgba(255,110,90,${roseOverlay[stage]})` }}
            />
          )}

          {showFace && <CreatureFace />}
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}
