import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinMultiplierEffectProps {
  multiplier: number;
  winAmount: number;
  isVisible: boolean;
  winningPatterns: number[][];
}

interface WinEffect {
  id: string;
  pattern: number[];
  delay: number;
  position: { x: number; y: number };
}

const MULTIPLIER_THEMES = {
  legendary: {
    threshold: 10,
    colors: { primary: '#FFD700', secondary: '#FF6B35', glow: '#FFD700' },
  },
  epic: {
    threshold: 5,
    colors: { primary: '#9D4EDD', secondary: '#E0AAFF', glow: '#9D4EDD' },
  },
  rare: {
    threshold: 3,
    colors: { primary: '#06FFA5', secondary: '#4ECDC4', glow: '#06FFA5' },
  },
  common: {
    threshold: 2,
    colors: { primary: '#FFE66D', secondary: '#FF6B6B', glow: '#FFE66D' },
  },
  basic: {
    threshold: 0,
    colors: { primary: '#A8E6CF', secondary: '#88D8A3', glow: '#A8E6CF' },
  },
} as const;

// Animation configurations
const ANIMATIONS = {
  duration: 4,
  stagger: 0.3,
  maxEffects: 6,
  spawnInterval: 2500,
} as const;

const WinMultiplierEffect: React.FC<WinMultiplierEffectProps> = ({
  multiplier,
  winAmount,
  isVisible,
  winningPatterns,
}) => {
  const [activeEffects, setActiveEffects] = useState<WinEffect[]>([]);

  // Get theme based on multiplier value
  const getMultiplierTheme = useCallback((multiplier: number) => {
    return (
      Object.values(MULTIPLIER_THEMES).find(
        (theme) => multiplier >= theme.threshold
      ) || MULTIPLIER_THEMES.basic
    );
  }, []);

  // Calculate position from pattern
  const calculatePosition = useCallback((pattern: number[]) => {
    const positions = pattern.map((index) => ({
      row: Math.floor(index / 3),
      col: index % 3,
    }));

    const centerPos = positions[Math.floor(positions.length / 2)];
    return {
      x: 50 + (centerPos.col - 1) * 25, // Center around 50%
      y: 40 + centerPos.row * 20,
    };
  }, []);

  // Create new effect
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

  // Format SOL amount for display
  const formatAmount = useCallback((amount: number) => {
    const solAmount = amount / 1_000_000_000;
    return solAmount < 0.01 ? '< 0.01' : solAmount.toFixed(2);
  }, []);

  // Effect management
  useEffect(() => {
    if (!isVisible || winningPatterns.length === 0) {
      setActiveEffects([]);
      return;
    }

    // Create initial effects
    const initialEffects = winningPatterns
      .slice(0, ANIMATIONS.maxEffects)
      .map((pattern, index) =>
        createWinEffect(pattern, index * ANIMATIONS.stagger)
      );

    setActiveEffects(initialEffects);

    // Spawn additional effects periodically
    const spawnTimer = setInterval(() => {
      const randomPattern =
        winningPatterns[Math.floor(Math.random() * winningPatterns.length)];

      setActiveEffects((prev) => {
        const newEffects = [...prev];
        if (newEffects.length >= ANIMATIONS.maxEffects) {
          newEffects.shift(); // Remove oldest effect
        }
        return [...newEffects, createWinEffect(randomPattern)];
      });
    }, ANIMATIONS.spawnInterval);

    return () => {
      clearInterval(spawnTimer);
      setActiveEffects([]);
    };
  }, [isVisible, winningPatterns, createWinEffect]);

  const theme = getMultiplierTheme(multiplier);
  const winAmountPerPattern = winAmount / winningPatterns.length;

  return (
    <AnimatePresence mode="popLayout">
      {isVisible &&
        activeEffects.map((effect) => (
          <WinEffectDisplay
            key={effect.id}
            effect={effect}
            multiplier={multiplier}
            winAmount={winAmountPerPattern}
            theme={theme}
            formatAmount={formatAmount}
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

// Separate component for individual effect display
interface WinEffectDisplayProps {
  effect: WinEffect;
  multiplier: number;
  winAmount: number;
  theme: (typeof MULTIPLIER_THEMES)[keyof typeof MULTIPLIER_THEMES];
  formatAmount: (amount: number) => string;
  onComplete: () => void;
}

const WinEffectDisplay: React.FC<WinEffectDisplayProps> = ({
  effect,
  multiplier,
  winAmount,
  theme,
  formatAmount,
  onComplete,
}) => {
  const fontSize = Math.min(48, 24 + multiplier * 2);

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
        scale: 0.5,
        y: 20,
        filter: 'blur(8px)',
      }}
      animate={{
        opacity: [0, 1, 0.9, 0.7, 0],
        scale: [0.5, 1.2, 1, 0.9, 0.6],
        y: [20, -10, -30, -50, -80],
        filter: [
          'blur(8px)',
          'blur(0px)',
          'blur(0px)',
          'blur(2px)',
          'blur(6px)',
        ],
      }}
      exit={{
        opacity: 0,
        scale: 0.3,
        y: -100,
        filter: 'blur(10px)',
      }}
      transition={{
        duration: ANIMATIONS.duration,
        delay: effect.delay,
        times: [0, 0.15, 0.4, 0.7, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onAnimationComplete={onComplete}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.colors.glow}40 0%, ${theme.colors.glow}20 50%, transparent 70%)`,
          width: '300%',
          height: '300%',
          left: '-100%',
          top: '-100%',
        }}
        animate={{
          scale: [0.8, 1.5, 1.2, 0.9],
          opacity: [0.3, 0.8, 0.6, 0.2],
        }}
        transition={{
          duration: ANIMATIONS.duration * 0.8,
          ease: 'easeOut',
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 text-center">
        {/* Multiplier text with enhanced readability */}
        <div className="relative mb-1">
          {/* Text shadow/outline for readability */}
          <div
            className="absolute inset-0 font-bold font-mono"
            style={{
              fontSize: `${fontSize}px`,
              color: '#000000',
              textShadow: `
                -2px -2px 0 #000,
                2px -2px 0 #000,
                -2px 2px 0 #000,
                2px 2px 0 #000,
                0 0 8px rgba(0,0,0,0.8)
              `,
              transform: 'translate(1px, 1px)',
            }}
          >
            +{multiplier}×
          </div>

          {/* Main text */}
          <motion.div
            className="relative font-bold font-mono"
            style={{
              fontSize: `${fontSize}px`,
              color: theme.colors.primary,
              textShadow: `
                0 0 10px ${theme.colors.glow},
                0 0 20px ${theme.colors.glow}50,
                0 0 30px ${theme.colors.glow}30
              `,
            }}
            animate={{
              textShadow: [
                `0 0 10px ${theme.colors.glow}, 0 0 20px ${theme.colors.glow}50`,
                `0 0 15px ${theme.colors.glow}, 0 0 30px ${theme.colors.glow}80`,
                `0 0 10px ${theme.colors.glow}, 0 0 20px ${theme.colors.glow}50`,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              repeatType: 'reverse',
            }}
          >
            +{multiplier}×
          </motion.div>
        </div>

        {/* SOL amount with better readability */}
        <motion.div
          className="text-xl font-semibold"
          style={{
            color: theme.colors.secondary,
            textShadow: `
              -1px -1px 0 #000,
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000,
              0 0 6px rgba(0,0,0,0.7)
            `,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: effect.delay + 0.2 }}
        >
          +{formatAmount(winAmount)} SOL
        </motion.div>
      </div>

      {/* Celebration particles */}
      <ParticleEffect theme={theme} multiplier={multiplier} />
    </motion.div>
  );
};

// Particle effect component
interface ParticleEffectProps {
  theme: (typeof MULTIPLIER_THEMES)[keyof typeof MULTIPLIER_THEMES];
  multiplier: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  theme,
  multiplier,
}) => {
  const particleCount = Math.min(16, 8 + multiplier * 2);

  return (
    <>
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 40 + Math.random() * 60;
        const size = 3 + Math.random() * 6;
        const delay = Math.random() * 0.8;

        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              backgroundColor: theme.colors.primary,
              boxShadow: `0 0 ${size * 2}px ${theme.colors.glow}`,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0.8],
            }}
            transition={{
              duration: 2.5 + Math.random(),
              delay: delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </>
  );
};

export default memo(WinMultiplierEffect);
