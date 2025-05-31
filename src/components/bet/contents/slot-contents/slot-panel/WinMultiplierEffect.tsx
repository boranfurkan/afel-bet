import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinMultiplierEffectProps {
  multiplier: number;
  winAmount: number;
  isVisible: boolean;
  winningPatterns: number[][];
  isFreeSpin?: boolean; // Add this prop to indicate if it's a free spin win
}

interface WinEffect {
  id: string;
  pattern: number[];
  delay: number;
  position: { x: number; y: number };
}

const MULTIPLIER_TIERS = {
  freeSpin: {
    threshold: 0,
    color: '#FF6B6B',
    shadowColor: '#FF8E53',
    icon: '🎡',
    label: 'FREE SPIN WIN!',
    scale: 1.4,
  },
  smallWin: {
    threshold: 0,
    color: '#4ECDC4',
    shadowColor: '#45B7AA',
    icon: '🎁',
    label: 'SMALL WIN!',
    scale: 1.0,
  },
  legendary: {
    threshold: 10,
    color: '#FFD700',
    shadowColor: '#FF8C00',
    icon: '🔥',
    label: 'MEGA WIN!',
    scale: 1.8,
  },
  epic: {
    threshold: 5,
    color: '#C77DFF',
    shadowColor: '#9D4EDD',
    icon: '⚡',
    label: 'BIG WIN!',
    scale: 1.5,
  },
  rare: {
    threshold: 3,
    color: '#06FFA5',
    shadowColor: '#4ECDC4',
    icon: '💎',
    label: 'GREAT WIN!',
    scale: 1.3,
  },
  common: {
    threshold: 2,
    color: '#FFE66D',
    shadowColor: '#FFB74D',
    icon: '✨',
    label: 'NICE WIN!',
    scale: 1.1,
  },
  basic: {
    threshold: 1,
    color: '#88D8A3',
    shadowColor: '#7FCDCD',
    icon: '🎯',
    label: 'WIN!',
    scale: 1.0,
  },
} as const;

const ANIMATIONS = {
  duration: 4,
  stagger: 0.3,
  maxEffects: 3,
  spawnInterval: 3500,
} as const;

const WinMultiplierEffect: React.FC<WinMultiplierEffectProps> = ({
  multiplier,
  winAmount,
  isVisible,
  winningPatterns,
  isFreeSpin = false,
}) => {
  const [activeEffects, setActiveEffects] = useState<WinEffect[]>([]);

  const getMultiplierTier = useCallback(
    (multiplier: number, isFreeSpin: boolean) => {
      // Handle free spin wins
      if (isFreeSpin) {
        return MULTIPLIER_TIERS.freeSpin;
      }

      // Handle small wins (less than 1x multiplier)
      if (multiplier < 1) {
        return MULTIPLIER_TIERS.smallWin;
      }

      // Handle regular wins
      return (
        Object.values(MULTIPLIER_TIERS)
          .filter(
            (tier) =>
              tier !== MULTIPLIER_TIERS.freeSpin &&
              tier !== MULTIPLIER_TIERS.smallWin
          )
          .find((tier) => multiplier >= tier.threshold) ||
        MULTIPLIER_TIERS.basic
      );
    },
    []
  );

  const calculatePosition = useCallback((pattern: number[]) => {
    const positions = pattern.map((index) => ({
      row: Math.floor(index / 3),
      col: index % 3,
    }));

    const centerPos = positions[Math.floor(positions.length / 2)];
    return {
      x: 50 + (centerPos.col - 1) * 15 + (Math.random() - 0.5) * 20,
      y: 50 + centerPos.row * 15 + (Math.random() - 0.5) * 15,
    };
  }, []);

  const createWinEffect = useCallback(
    (pattern: number[], delay: number = 0): WinEffect => {
      return {
        id: `win-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pattern,
        delay,
        position: calculatePosition(pattern),
      };
    },
    [calculatePosition]
  );

  useEffect(() => {
    if (!isVisible || winningPatterns.length === 0) {
      setActiveEffects([]);
      return;
    }

    const initialEffects = winningPatterns
      .slice(0, ANIMATIONS.maxEffects)
      .map((pattern, index) =>
        createWinEffect(pattern, index * ANIMATIONS.stagger)
      );

    setActiveEffects(initialEffects);

    const spawnTimer = setInterval(() => {
      const randomPattern =
        winningPatterns[Math.floor(Math.random() * winningPatterns.length)];

      setActiveEffects((prev) => {
        const newEffects = [...prev];
        if (newEffects.length >= ANIMATIONS.maxEffects) {
          newEffects.shift();
        }
        return [...newEffects, createWinEffect(randomPattern)];
      });
    }, ANIMATIONS.spawnInterval);

    return () => {
      clearInterval(spawnTimer);
      setActiveEffects([]);
    };
  }, [isVisible, winningPatterns, createWinEffect]);

  const tier = getMultiplierTier(multiplier, isFreeSpin);
  const winAmountPerPattern = winAmount / winningPatterns.length;

  return (
    <AnimatePresence mode="popLayout">
      {isVisible &&
        activeEffects.map((effect) => (
          <FloatingWinText
            key={effect.id}
            effect={effect}
            multiplier={multiplier}
            winAmount={winAmountPerPattern}
            tier={tier}
            isFreeSpin={isFreeSpin}
            onComplete={() => {
              setActiveEffects((prev) =>
                prev.filter((e) => e.id !== effect.id)
              );
            }}
          />
        ))}
    </AnimatePresence>
  );
};

interface FloatingWinTextProps {
  effect: WinEffect;
  multiplier: number;
  winAmount: number;
  tier: (typeof MULTIPLIER_TIERS)[keyof typeof MULTIPLIER_TIERS];
  isFreeSpin: boolean;
  onComplete: () => void;
}

const FloatingWinText: React.FC<FloatingWinTextProps> = ({
  effect,
  multiplier,
  winAmount,
  tier,
  isFreeSpin,
  onComplete,
}) => {
  const formatNumber = (num: number) => {
    const rounded = Math.round(num * 1000) / 1000;
    return rounded.toString().replace(/\.?0+$/, '');
  };

  const formatSolAmount = (amount: number) => {
    return amount.toFixed(4); // Show more decimals for small amounts
  };

  const getMultiplierDisplay = () => {
    if (isFreeSpin) {
      return '';
    }
    if (multiplier < 1) {
      return `${formatNumber(multiplier)}×`;
    }
    return `${formatNumber(multiplier)}×`;
  };

  const getWinAmountDisplay = () => {
    if (isFreeSpin) {
      return `+${formatSolAmount(winAmount)} SOL`;
    }
    if (multiplier < 1) {
      return `+${formatSolAmount(winAmount)} SOL`;
    }
    return `+${formatSolAmount(winAmount)} SOL`;
  };

  return (
    <motion.div
      className="absolute z-50 pointer-events-none select-none"
      style={{
        left: `${effect.position.x}%`,
        top: `${effect.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{
        opacity: 0,
        scale: 0.3,
        y: 20,
        rotateZ: -10,
      }}
      animate={{
        opacity: [0, 1, 1, 1, 0.8, 0],
        scale: [
          0.3,
          tier.scale * 1.2,
          tier.scale,
          tier.scale * 0.9,
          tier.scale * 0.7,
          0.5,
        ],
        y: [20, 0, -10, -30, -60, -100],
        rotateZ: [-10, 0, 2, -1, 1, 0],
      }}
      exit={{
        opacity: 0,
        scale: 0.2,
        y: -120,
      }}
      transition={{
        duration: ANIMATIONS.duration,
        delay: effect.delay,
        times: [0, 0.15, 0.3, 0.6, 0.8, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onAnimationComplete={onComplete}
    >
      {/* Main text container */}
      <div className="relative text-center">
        {/* Win label */}
        <motion.div
          className="text-xl font-black tracking-wider mb-1"
          style={{
            color: tier.color,
            textShadow: `
              0 0 20px ${tier.shadowColor}80,
              0 2px 4px rgba(0, 0, 0, 0.8),
              2px 2px 0px rgba(0, 0, 0, 0.5),
              -2px -2px 0px rgba(0, 0, 0, 0.5)
            `,
            WebkitTextStroke: `1px rgba(0, 0, 0, 0.3)`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [1, 1.1, 1],
          }}
          transition={{
            delay: effect.delay,
            duration: 0.6,
            scale: { delay: effect.delay + 0.2, duration: 0.4 },
          }}
        >
          {tier.icon} {tier.label}
        </motion.div>

        {/* Multiplier */}
        {multiplier >= 1 && (
          <motion.div
            className="text-6xl font-black leading-none mb-2"
            style={{
              color: '#FFFFFF',
              textShadow: `
              0 0 30px ${tier.color}FF,
              0 0 60px ${tier.shadowColor}80,
              0 4px 8px rgba(0, 0, 0, 0.9),
              3px 3px 0px ${tier.shadowColor}60,
              -3px -3px 0px ${tier.shadowColor}60
            `,
              WebkitTextStroke: `2px ${tier.color}80`,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 90,
            }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.3, 1],
              rotateX: [90, 0],
            }}
            transition={{
              delay: effect.delay + 0.1,
              duration: 0.8,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
          >
            {getMultiplierDisplay()}
          </motion.div>
        )}

        {/* Win amount */}
        <motion.div
          className="text-lg font-bold"
          style={{
            color: tier.color,
            textShadow: `
              0 0 15px ${tier.shadowColor}60,
              0 2px 4px rgba(0, 0, 0, 0.8),
              1px 1px 0px rgba(0, 0, 0, 0.5)
            `,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: effect.delay + 0.3, duration: 0.5 }}
        >
          {getWinAmountDisplay()}
        </motion.div>

        {/* Glow effect behind text */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full blur-xl"
          style={{
            background: `radial-gradient(circle, ${tier.color}40 0%, ${tier.shadowColor}20 50%, transparent 70%)`,
          }}
          animate={{
            scale: [0.8, 1.5, 1.2],
            opacity: [0.6, 1, 0.8],
          }}
          transition={{
            duration: 2,
            delay: effect.delay + 0.2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Floating particles */}
      <ParticleField tier={tier} multiplier={multiplier} delay={effect.delay} />
    </motion.div>
  );
};

interface ParticleFieldProps {
  tier: (typeof MULTIPLIER_TIERS)[keyof typeof MULTIPLIER_TIERS];
  multiplier: number;
  delay: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  tier,
  multiplier,
  delay,
}) => {
  const particleCount = Math.min(12, 6 + Math.floor(Math.abs(multiplier) / 2));

  return (
    <>
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / particleCount;
        const radius = 80 + Math.random() * 60;
        const size = 3 + Math.random() * 4;
        const particleDelay = delay + Math.random() * 1.5;

        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: tier.color,
              boxShadow: `0 0 ${size * 3}px ${tier.shadowColor}`,
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
              y: Math.sin(angle) * radius + (Math.random() - 0.5) * 40 - 30,
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.5, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              delay: particleDelay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </>
  );
};

export default memo(WinMultiplierEffect);
