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
  familiar:   'Familiar',
  regular:    'Regular',
  kept:       'Kept',
};

const E     = 'rgba(22,14,6,0.88)';
const CHEEK = 'rgba(238,100,118,0.30)';
const TEAR  = 'rgba(120,185,255,0.88)';
const MOUTH_FILL = 'rgba(200,80,90,0.90)';

// Small tick eyebrows — same across all expressions
function Brows({ sad = false }: { sad?: boolean }) {
  return sad ? (
    <>
      <path d="M 31 39 Q 34 37 37 40" stroke={E} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M 63 40 Q 66 37 69 39" stroke={E} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  ) : (
    <>
      <path d="M 32 39 Q 35 37 38 38" stroke={E} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M 62 38 Q 65 37 68 39" stroke={E} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  );
}

// Expressions based on reference image — 4 types
function MoodFace({ mood }: { mood: Mood }) {
  const svgProps = {
    viewBox: '0 0 100 100',
    width: '100%',
    height: '100%',
    className: 'absolute inset-0 pointer-events-none' as const,
    style: { overflow: 'visible' as const },
  };

  // ── PEACEFUL / CONTENT ── closed ∪ eyes, rosy cheeks, cat-smile
  if (mood === 'peaceful' || mood === 'calm' || mood === 'quiet' || mood === 'nostalgic') {
    return (
      <svg {...svgProps}>
        <Brows />
        <ellipse cx="23" cy="57" rx="10" ry="6" fill={CHEEK} />
        <ellipse cx="77" cy="57" rx="10" ry="6" fill={CHEEK} />
        {/* Closed content eyes — downward ∪ curves */}
        <path d="M 29 47 Q 36 53 43 47" stroke={E} strokeWidth="3"   strokeLinecap="round" fill="none" />
        <path d="M 57 47 Q 64 53 71 47" stroke={E} strokeWidth="3"   strokeLinecap="round" fill="none" />
        {/* Gentle upward smile */}
        <path d="M 40 63 Q 50 70 60 63" stroke={E} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // ── EXCITED / HAPPY ── medium eyes w/ sclera, open mouth
  if (mood === 'energetic' || mood === 'lively') {
    return (
      <svg {...svgProps}>
        <Brows />
        <ellipse cx="22" cy="57" rx="11" ry="6.5" fill={CHEEK} />
        <ellipse cx="78" cy="57" rx="11" ry="6.5" fill={CHEEK} />
        {/* Eyes: white sclera + dark pupil + highlight */}
        <circle cx="35" cy="46" r="10" fill="white" />
        <circle cx="65" cy="46" r="10" fill="white" />
        <circle cx="35" cy="47" r="6"  fill={E} />
        <circle cx="65" cy="47" r="6"  fill={E} />
        <circle cx="32" cy="44" r="2.8" fill="white" />
        <circle cx="62" cy="44" r="2.8" fill="white" />
        {/* Open mouth */}
        <path d="M 37 63 Q 50 77 63 63 Q 50 68 37 63 Z" fill={E} />
        <ellipse cx="50" cy="70" rx="9" ry="4.5" fill={MOUTH_FILL} />
      </svg>
    );
  }

  // ── SAD / CRYING ── big teary eyes, frown
  if (mood === 'lonely' || mood === 'misses you') {
    return (
      <svg {...svgProps}>
        <Brows sad />
        <ellipse cx="22" cy="60" rx="9" ry="5.5" fill={CHEEK} />
        <ellipse cx="78" cy="60" rx="9" ry="5.5" fill={CHEEK} />
        {/* Big eyes: white sclera + pupil */}
        <circle cx="34" cy="47" r="12" fill="white" />
        <circle cx="66" cy="47" r="12" fill="white" />
        <circle cx="34" cy="48" r="7"  fill={E} />
        <circle cx="66" cy="48" r="7"  fill={E} />
        <circle cx="30" cy="44" r="3.5" fill="white" />
        <circle cx="62" cy="44" r="3.5" fill="white" />
        {/* Tears */}
        <path d="M 30 61 Q 27 68 30 74 Q 33 68 30 61 Z" fill={TEAR} />
        <path d="M 36 63 Q 33 69 36 74 Q 39 69 36 63 Z" fill={TEAR} opacity="0.7" />
        {/* Frown */}
        <path d="M 40 68 Q 50 63 60 68" stroke={E} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // ── STRESSED ── big worried eyes, wavy mouth, no tears
  if (mood === 'a bit crowded') {
    return (
      <svg {...svgProps}>
        <Brows sad />
        <ellipse cx="22" cy="59" rx="9" ry="5.5" fill={CHEEK} />
        <ellipse cx="78" cy="59" rx="9" ry="5.5" fill={CHEEK} />
        <circle cx="34" cy="47" r="11" fill="white" />
        <circle cx="66" cy="47" r="11" fill="white" />
        <circle cx="34" cy="47" r="6.5" fill={E} />
        <circle cx="66" cy="47" r="6.5" fill={E} />
        <circle cx="30" cy="44" r="3"   fill="white" />
        <circle cx="62" cy="44" r="3"   fill="white" />
        {/* Wavy stressed mouth */}
        <path d="M 40 65 Q 45 69 50 65 Q 55 61 60 65" stroke={E} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // ── DEFAULT / HAPPY ── small eyes, smile, cheeks (top-left in reference)
  return (
    <svg {...svgProps}>
      <Brows />
      <ellipse cx="23" cy="57" rx="10" ry="6" fill={CHEEK} />
      <ellipse cx="77" cy="57" rx="10" ry="6" fill={CHEEK} />
      <circle cx="36" cy="47" r="6"   fill={E} />
      <circle cx="64" cy="47" r="6"   fill={E} />
      <circle cx="34" cy="45" r="2.2" fill="white" />
      <circle cx="62" cy="45" r="2.2" fill="white" />
      <path d="M 40 62 Q 50 70 60 62" stroke={E} strokeWidth="2.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const glowOpacity: Record<BondStage, number> = {
  introduced: 0.20, familiar: 0.32, regular: 0.44, kept: 0.60,
};
const roseOverlay: Record<BondStage, number> = {
  introduced: 0, familiar: 0.03, regular: 0.07, kept: 0.13,
};

const baseSizes = { xs: 40, sm: 64, md: 96, lg: 128, hero: 256 };

interface AvatarProps {
  colorFrom: string;
  colorTo: string;
  shadow: string;
  mood: Mood;
  personality?: string;
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
}: AvatarProps) {
  const controls = useAnimation();
  const stage = getBondStage(relationshipLevel);
  const px = baseSizes[size];

  useEffect(() => {
    if (!animate) return;

    // Mood sets pulse speed — shape stays a perfect circle
    let duration = 5;
    let scaleAnim = [1, 1.05, 1];
    let rotation  = [0, 2, -2, 0];

    switch (mood) {
      case 'energetic':
      case 'lively':
        duration = 2.2; scaleAnim = [1, 1.09, 1]; rotation = [0, 6, -6, 0]; break;
      case 'lonely':
      case 'misses you':
        duration = 6;   scaleAnim = [1, 0.97, 1]; rotation = [0, -1, 1, 0]; break;
      case 'a bit crowded':
        duration = 2.8; scaleAnim = [1, 1.06, 1]; rotation = [0, 5, -5, 0]; break;
      case 'peaceful':
      case 'calm':
        duration = 6;   scaleAnim = [1, 1.03, 1]; rotation = [0, 1, -1, 0]; break;
    }

    controls.start({
      scale: scaleAnim,
      rotate: rotation,
      transition: { duration, ease: 'easeInOut', repeat: Infinity },
    });
  }, [mood, animate, controls]);

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Ambient glow */}
      <motion.div
        animate={animate ? controls : {}}
        className={cn('absolute bg-gradient-to-tr blur-2xl mix-blend-multiply', colorFrom, colorTo)}
        style={{ width: px, height: px, borderRadius: '50%', opacity: glowOpacity[stage] }}
      />

      {/* Body pulse */}
      <motion.div
        animate={animate ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={animate ? controls : {}}
          className={cn(
            'relative bg-gradient-to-tr shadow-2xl backdrop-blur-md border border-white/20',
            colorFrom, colorTo, shadow
          )}
          style={{
            width: px,
            height: px,
            borderRadius: '50%',
            boxShadow: 'inset 0 0 40px rgba(255,255,255,0.4), 0 20px 50px -10px rgba(0,0,0,0.1)',
          }}
        >
          <div className="absolute inset-0 bg-white/20 mix-blend-overlay rounded-full" />
          {roseOverlay[stage] > 0 && (
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: `rgba(255,110,90,${roseOverlay[stage]})` }}
            />
          )}
          <MoodFace mood={mood} />
        </motion.div>
      </motion.div>
    </div>
  );
}
