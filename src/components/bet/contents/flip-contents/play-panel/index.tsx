import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useFlipMachine } from '@/contexts/FlipContext';
import FlipContentButton from '../FlipContentButton';

const PlayPanel = () => {
  const {
    startFlip,
    canStartFlip,
    selectedSide,
    setSelectedSide,
    betAmount,
    setBetAmount,
    userBalance,
    gameState,
  } = useFlipMachine();

  const isDisabled = gameState !== 'IDLE';

  const handleSideSelect = (side: 'HEADS' | 'TAILS') => {
    if (isDisabled) return;
    setSelectedSide(side);
  };

  const handleBetClick = (amount: number) => {
    if (isDisabled) return;
    setBetAmount(amount);
  };

  const handleStartFlip = () => {
    if (canStartFlip) {
      startFlip();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const betOptions = [
    { amount: 0.05, label: '0.05' },
    { amount: 0.1, label: '0.1' },
    { amount: 0.25, label: '0.25' },
    { amount: 0.5, label: '0.5' },
    { amount: 1, label: '1' },
    { amount: 2, label: '2' },
  ];

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Panel */}
      <motion.div
        className="w-full border border-[#FFFFFF99]/30 rounded-xl p-4 backdrop-blur-sm bg-black/20 flex flex-col gap-4"
        variants={itemVariants}
      >
        {/* Balance Display */}
        <motion.div
          className="w-full flex justify-between items-center"
          variants={itemVariants}
        >
          <div className="text-white/80 text-sm">BALANCE</div>
          <motion.div
            className="text-xl font-bold text-green-400"
            animate={{
              textShadow: [
                '0 0 0px rgba(34, 197, 94, 0.5)',
                '0 0 10px rgba(34, 197, 94, 0.8)',
                '0 0 0px rgba(34, 197, 94, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {userBalance.toFixed(3)} SOL
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px w-full bg-white/20" />

        {/* Choose Side Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-white text-center mb-2 text-sm uppercase">
            I Choose
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <FlipContentButton
              className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              selected={selectedSide === 'HEADS'}
              onClick={() => handleSideSelect('HEADS')}
              disabled={isDisabled}
            >
              <motion.div
                animate={
                  selectedSide === 'HEADS'
                    ? {
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  repeat: selectedSide === 'HEADS' ? Infinity : 0,
                  repeatDelay: 2,
                }}
              >
                <Image
                  src="/images/bet/flip/heads-icon.png"
                  alt="Heads"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </motion.div>
              <span className="text-base font-bold">HEADS</span>
            </FlipContentButton>

            <FlipContentButton
              className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              selected={selectedSide === 'TAILS'}
              onClick={() => handleSideSelect('TAILS')}
              disabled={isDisabled}
            >
              <motion.div
                animate={
                  selectedSide === 'TAILS'
                    ? {
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  repeat: selectedSide === 'TAILS' ? Infinity : 0,
                  repeatDelay: 2,
                }}
              >
                <Image
                  src="/images/bet/flip/tails-icon.png"
                  alt="Tails"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </motion.div>
              <span className="text-base font-bold">TAILS</span>
            </FlipContentButton>
          </div>
        </motion.div>

        {/* Bet Amount Selection */}
        <motion.div variants={itemVariants}>
          <h3 className="text-white text-center mb-2 text-sm uppercase">
            Bet Amount (SOL)
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {betOptions.map((option) => (
              <FlipContentButton
                key={option.amount}
                className={`py-2 text-base transition-all duration-300 ${
                  !isDisabled && userBalance >= option.amount
                    ? 'hover:scale-105'
                    : ''
                }`}
                disabled={userBalance < option.amount || isDisabled}
                selected={betAmount === option.amount}
                onClick={() => handleBetClick(option.amount)}
              >
                {option.label}
              </FlipContentButton>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={itemVariants} className="mt-2">
          <FlipContentButton
            onClick={handleStartFlip}
            disabled={!canStartFlip}
            className={`w-full py-4 text-xl font-bold transition-all duration-300 ${
              canStartFlip ? 'hover:shadow-lg' : ''
            }`}
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={
                canStartFlip
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: canStartFlip ? Infinity : 0,
                ease: 'easeInOut',
              }}
            >
              <span>
                {selectedSide ? `FLIP ${betAmount} SOL` : 'SELECT SIDE'}
              </span>
              {selectedSide && (
                <Image
                  src={`/images/bet/flip/${selectedSide.toLowerCase()}-icon.png`}
                  alt={selectedSide}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              )}
            </motion.div>
          </FlipContentButton>
        </motion.div>

        {/* Status Text */}
        {!selectedSide && (
          <motion.div
            className="text-center text-xs text-yellow-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            variants={itemVariants}
          >
            ⚡ Choose HEADS or TAILS to continue
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PlayPanel;
