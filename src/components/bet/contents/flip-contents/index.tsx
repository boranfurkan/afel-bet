import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import backgroundImage from '../../../../../public/images/bet/flip-background.png';
import FlipDetails from './info-section/FlipDetails';
import PlayPanel from './play-panel';
import { useFlipMachine } from '@/contexts/FlipContext';
import { FlipGameState } from '@/contexts/FlipContext';
import CoinFlipAnimation from './CoinFlipAnimation';
import FlipResult from './FlipResult';

const FlipContents = () => {
  const { gameState, isAnimating } = useFlipMachine();

  const renderGameState = () => {
    switch (gameState) {
      case FlipGameState.FLIPPING:
        return <CoinFlipAnimation key="flipping" />;
      case FlipGameState.RESULT:
        return <FlipResult key="result" />;
      default:
        return <PlayPanel key="idle" />;
    }
  };

  // Animation variants for smoother transitions
  const gameStateVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Background Image with lower opacity */}
      <div className="absolute inset-0 z-0 m-[1.5px]">
        <Image
          src={backgroundImage}
          alt="Flip Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative w-full flex flex-col z-10 h-full">
        <FlipDetails />

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-4 h-full">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${gameState}-${isAnimating ? 'animating' : 'static'}`}
                variants={gameStateVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                {renderGameState()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipContents;
