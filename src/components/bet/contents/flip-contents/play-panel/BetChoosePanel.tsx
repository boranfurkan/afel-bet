import React from 'react';
import { motion } from 'framer-motion';
import FlipContentButton from '../FlipContentButton';
import { useFlipMachine } from '@/contexts/FlipContext';

const BetChoosePanel = () => {
  const { userBalance, setBetAmount, betAmount, gameState } = useFlipMachine();
  const isDisabled = gameState !== 'IDLE';

  const handleBetClick = (amount: number) => {
    if (isDisabled) return;
    setBetAmount(amount);
  };

  const betOptions = [
    { amount: 0.05, label: '0.05 SOL' },
    { amount: 0.1, label: '0.1 SOL' },
    { amount: 0.25, label: '0.25 SOL' },
    { amount: 0.5, label: '0.5 SOL' },
    { amount: 1, label: '1 SOL' },
    { amount: 2, label: '2 SOL' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-2 gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SOL Betting Options */}
      {betOptions.map((option, index) => (
        <motion.div key={option.amount} variants={itemVariants}>
          <FlipContentButton
            className={`w-full !px-3 !py-1 h-16 flex items-center justify-center transition-all duration-300 ${
              !isDisabled && userBalance >= option.amount
                ? 'hover:scale-105'
                : ''
            }`}
            disabled={userBalance < option.amount || isDisabled}
            selected={betAmount === option.amount}
            onClick={() => {
              if (!isDisabled && userBalance >= option.amount) {
                handleBetClick(option.amount);
              }
            }}
          >
            <motion.span
              className="text-xl font-bold"
              animate={
                betAmount === option.amount
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: betAmount === option.amount ? Infinity : 0,
                repeatDelay: 1,
              }}
            >
              {option.label}
            </motion.span>
          </FlipContentButton>
        </motion.div>
      ))}

      {/* Current Balance Display */}
      <motion.div
        className="col-span-2 mt-4 text-center"
        variants={itemVariants}
      >
        <div className="text-white/70 text-sm mb-1">AVAILABLE BALANCE</div>
        <motion.div
          className="text-green-400 text-lg font-bold"
          animate={{
            textShadow: [
              '0 0 0px rgba(34, 197, 94, 0.8)',
              '0 0 8px rgba(34, 197, 94, 0.8)',
              '0 0 0px rgba(34, 197, 94, 0.8)',
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

      {/* Selected Bet Display */}
      {betAmount > 0 && (
        <motion.div
          className="col-span-2 mt-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-yellow-400 text-sm font-medium"
            animate={{
              textShadow: [
                '0 0 0px rgba(250, 204, 21, 0.8)',
                '0 0 8px rgba(250, 204, 21, 0.8)',
                '0 0 0px rgba(250, 204, 21, 0.8)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✓ BET: {betAmount} SOL SELECTED
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BetChoosePanel;
