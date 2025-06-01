import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useFlipMachine } from '@/contexts/FlipContext';

const CoinFlipAnimation = () => {
  const { selectedSide, setIsAnimating } = useFlipMachine();
  const coinRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [flipState, setFlipState] = useState<'flipping' | 'landing'>(
    'flipping'
  );
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; color: string; delay: number }[]
  >([]);

  const animationCompletedRef = useRef(false);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map(() => ({
      x: 40 + Math.random() * 20,
      y: 30 + Math.random() * 40,
      size: 2 + Math.random() * 4,
      color: ['#FFD700', '#FFA500', '#FFFF00', '#FFFFFF'][
        Math.floor(Math.random() * 4)
      ],
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!coinRef.current || !checkboxRef.current) return;

    setIsAnimating(true);
    animationCompletedRef.current = false;

    const coinElement = coinRef.current;
    const checkbox = checkboxRef.current;

    const handleAnimationStart = () => {
      setFlipState('flipping');
    };

    const handleAnimationEnd = () => {
      setFlipState('landing');

      setTimeout(() => {
        if (!animationCompletedRef.current) {
          animationCompletedRef.current = true;

          setIsAnimating(false);
        }
      }, 800);
    };

    coinElement.addEventListener('animationstart', handleAnimationStart);
    coinElement.addEventListener('animationend', handleAnimationEnd);

    checkbox.checked = true;

    return () => {
      coinElement.removeEventListener('animationstart', handleAnimationStart);
      coinElement.removeEventListener('animationend', handleAnimationEnd);

      if (!animationCompletedRef.current) {
        animationCompletedRef.current = true;
        setIsAnimating(false);
      }
    };
  }, [setIsAnimating]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Enhanced light effect behind the coin
  const lightEffectVariants = {
    initial: {
      opacity: 0.3,
      scale: 0.8,
    },
    animate: {
      opacity: [0.3, 0.7, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Status Text with pulsing animation */}
      <motion.div
        className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10"
        animate={{
          y: [0, -5, 0],
          boxShadow: [
            '0 0 0px rgba(255,255,255,0.3)',
            '0 0 15px rgba(255,255,255,0.4)',
            '0 0 0px rgba(255,255,255,0.3)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="text-xl font-bold text-white text-center"
          animate={{
            textShadow: [
              '0 0 0px rgba(255,255,255,0.5)',
              '0 0 10px rgba(255,255,255,0.8)',
              '0 0 0px rgba(255,255,255,0.5)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {flipState === 'flipping' ? 'FLIPPING...' : 'LANDING...'}
        </motion.div>
      </motion.div>

      {/* Light effect behind coin */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-r from-yellow-500/30 via-yellow-300/40 to-yellow-500/30 blur-xl"
        style={{ width: 200, height: 200, zIndex: 0 }}
        variants={lightEffectVariants}
        initial="initial"
        animate="animate"
      />

      {/* Coin Container with enhanced styling */}
      <div
        className="coin-flip-container relative z-10"
        style={{ transform: 'scale(0.8)' }}
      >
        <div className="coin-flip-bounds">
          <input
            ref={checkboxRef}
            type="checkbox"
            className="coin-flip-trigger"
          />
          <div
            ref={coinRef}
            className="coin-flip"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Back Side (Tails) */}
            <div className="coin-flip-back">
              <div className="w-36 h-36 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner border-2 border-gray-300">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [0.95, 1, 0.95],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Image
                    src="/images/bet/flip/tails-icon.png"
                    alt="Tails"
                    width={100}
                    height={100}
                    className="w-25 h-25 object-contain"
                  />
                </motion.div>
              </div>
            </div>

            {/* Coin Edge Elements with enhanced styling */}
            <div className="coin-flip-edge-front"></div>
            <div className="coin-flip-center"></div>
            <div className="coin-flip-edge-back"></div>

            {/* Front Side (Heads) */}
            <div className="coin-flip-front">
              <div className="w-36 h-36 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner border-2 border-gray-300">
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, 0],
                    scale: [0.95, 1, 0.95],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Image
                    src="/images/bet/flip/heads-icon.png"
                    alt="Heads"
                    width={100}
                    height={100}
                    className="w-25 h-25 object-contain"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Side Indicator with enhanced animation */}
      <motion.div
        className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-white/80 text-xs">YOU CHOSE</div>
        <motion.div
          className="text-yellow-400 text-lg font-bold flex items-center justify-center gap-2"
          animate={{
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 0px rgba(255, 215, 0, 0.5)',
              '0 0 10px rgba(255, 215, 0, 0.8)',
              '0 0 0px rgba(255, 215, 0, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {selectedSide && (
            <>
              <Image
                src={`/images/bet/flip/${selectedSide.toLowerCase()}-icon.png`}
                alt={selectedSide}
                width={24}
                height={24}
                className="w-5 h-5"
              />
              <span>{selectedSide}</span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Enhanced Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            boxShadow: [
              `0 0 ${p.size}px ${p.color}`,
              `0 0 ${p.size * 4}px ${p.color}`,
              `0 0 ${p.size}px ${p.color}`,
            ],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

export default CoinFlipAnimation;
