import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useFlipMachine } from '@/contexts/FlipContext';

const CoinFlipAnimation = () => {
  const { selectedSide } = useFlipMachine();
  const coinRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (!coinRef.current || !checkboxRef.current) return;

    const coinElement = coinRef.current;
    const checkbox = checkboxRef.current;

    // Handle animation events
    const handleAnimationStart = () => {
      setIsFlipping(true);
    };

    const handleAnimationEnd = () => {
      setIsFlipping(false);
    };

    // Add event listeners
    coinElement.addEventListener('animationstart', handleAnimationStart);
    coinElement.addEventListener('animationend', handleAnimationEnd);

    // Start the flip animation
    checkbox.checked = true;

    return () => {
      coinElement.removeEventListener('animationstart', handleAnimationStart);
      coinElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

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

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Status Text */}
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
        <div className="text-xl font-bold text-white text-center">
          {isFlipping ? 'FLIPPING...' : 'LANDING...'}
        </div>
      </motion.div>

      {/* Coin Container */}
      <div
        className="coin-flip-container relative"
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
                <Image
                  src="/images/bet/flip/tails-icon.png"
                  alt="Tails"
                  width={100}
                  height={100}
                  className="w-25 h-25 object-contain"
                />
              </div>
            </div>

            {/* Coin Edge Elements */}
            <div className="coin-flip-edge-front"></div>
            <div className="coin-flip-center"></div>
            <div className="coin-flip-edge-back"></div>

            {/* Front Side (Heads) */}
            <div className="coin-flip-front">
              <div className="w-36 h-36 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner border-2 border-gray-300">
                <Image
                  src="/images/bet/flip/heads-icon.png"
                  alt="Heads"
                  width={100}
                  height={100}
                  className="w-25 h-25 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Side Indicator */}
      <motion.div
        className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-white/80 text-xs">YOU CHOSE</div>
        <div className="text-yellow-400 text-lg font-bold">{selectedSide}</div>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            left: `${40 + Math.random() * 20}%`,
            top: `${30 + Math.random() * 40}%`,
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random(),
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

export default CoinFlipAnimation;
