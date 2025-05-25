import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundImage from '../../../../../public/images/bet/flip-background.png';
import FlipDetails from './info-section/FlipDetails';
import PlayPanel from './play-panel';

import { useFlipMachine } from '@/contexts/FlipContext';
import { FlipGameState } from '@/contexts/FlipContext';
import WaitingForDeposit from './WaitingForDeposit';
import CoinFlipAnimation from './CoinFlipAnimation';
import FlipResult from './FlipResult';
import BetLoadingSpinner from '../../BetLoadingSpinner';

const ImprovedFlipContents = () => {
  const { gameState, isAnimating } = useFlipMachine();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const renderGameState = () => {
    if (isLoading) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <BetLoadingSpinner text="Loading game..." />
        </div>
      );
    }

    switch (gameState) {
      case FlipGameState.WAITING_FOR_DEPOSIT:
        return <WaitingForDeposit key="waiting" />;
      case FlipGameState.FLIPPING:
        return <CoinFlipAnimation key="flipping" />;
      case FlipGameState.RESULT:
        return <FlipResult key="result" />;
      default:
        return <PlayPanel key="idle" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

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
    <motion.div
      className="w-full h-full flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Image with lower opacity */}
      <div className="absolute inset-0 z-0 m-[1.5px] ">
        <Image
          src={backgroundImage}
          alt="Flip Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-black/40 " />
      </div>

      {/* Content */}
      <div className="relative w-full flex flex-col z-10 h-full">
        {/* Top Info Bar */}
        <FlipDetails />

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${gameState}-${isLoading}`}
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
    </motion.div>
  );
};

export default ImprovedFlipContents;
