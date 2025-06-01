// src/components/bet/contents/slot-contents/play-panel/start-button/StartButton.tsx
import React, { memo } from 'react';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import BetLoadingSpinner from '@/components/bet/BetLoadingSpinner';
import { Gamepad2, Zap, Play } from 'lucide-react';
import { showErrorToast, showSuccessToast, showInfoToast } from '@/utils/toast';

interface StartButtonProps {
  isMobile?: boolean;
  onClosePortal?: () => void;
  className?: string;
}

const StartButton: React.FC<StartButtonProps> = ({
  isMobile = false,
  onClosePortal,
  className = '',
}) => {
  const {
    spinSlots,
    isSpinning,
    betAmount,
    userBalance,
    demoBalance,
    spinCompleted,
    gameMode,
  } = useSlotMachine();

  const currentBalance = gameMode === 'demo' ? demoBalance : userBalance;
  const canSpin =
    !isSpinning &&
    spinCompleted &&
    currentBalance >= betAmount &&
    betAmount >= 0.01;

  // Text size based on screen size
  const textSize = isMobile ? 'text-2xl' : 'text-[77.25px]';
  const iconSize = isMobile ? 16 : 24;

  const handleSpin = () => {
    if (!canSpin) {
      if (currentBalance < betAmount) {
        showErrorToast(
          'Insufficient Balance',
          "You don't have enough SOL for this bet"
        );
      } else if (betAmount < 0.01) {
        showErrorToast('Invalid Bet Amount', 'Minimum bet amount is 0.01 SOL');
      } else if (!spinCompleted) {
        showInfoToast('Please Wait', 'Current spin is still in progress');
      }
      return;
    }

    if (spinSlots) {
      spinSlots();
      if (onClosePortal) onClosePortal();
    }
  };

  const getButtonContent = () => {
    if (!spinCompleted) {
      return (
        <div className="flex items-center justify-center h-full">
          <BetLoadingSpinner size={isMobile ? 20 : 30} />
        </div>
      );
    }

    const icon =
      gameMode === 'demo' ? (
        <Gamepad2 size={iconSize * 2} height={iconSize * 2} color="white" />
      ) : (
        <ArrowRightIcon width={iconSize} height={iconSize * 2} />
      );

    const text = gameMode === 'demo' ? 'DEMO' : 'START';

    return (
      <>
        <motion.div
          transition={{
            duration: 2,
            repeat: gameMode === 'demo' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {icon}
        </motion.div>
        <span
          className={`font-normal ${textSize} leading-[100%] tracking-[0%] text-right align-middle text-white`}
        >
          {text}
        </span>
      </>
    );
  };

  const getButtonColor = () => {
    if (!canSpin) return 'opacity-50 cursor-not-allowed';

    return 'bg-[#6c924a] border-r-4 border-b-4 border-l-4 border-[#A0C380]';
  };

  return (
    <motion.div
      className={`relative cursor-pointer flex items-center h-full gap-2 md:gap-4 justify-center hover:opacity-90 transition-all duration-300 ${
        isMobile ? 'min-h-[50px]' : 'min-h-[80px]'
      } select-none ${getButtonColor()} ${className}`}
      onClick={handleSpin}
      whileTap={canSpin ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
      animate={
        gameMode === 'demo' && canSpin
          ? {
              boxShadow: [
                '0 0 0px rgba(160, 195, 128, 0.5)',
                '0 0 20px rgba(160, 195, 128, 0.8)',
                '0 0 0px rgba(160, 195, 128, 0.5)',
              ],
            }
          : {}
      }
    >
      {getButtonContent()}

      {/* Demo mode indicator */}
      {gameMode === 'demo' && canSpin && (
        <motion.div
          className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-[8px] px-2 py-1 rounded-full font-bold"
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          DEMO
        </motion.div>
      )}

      {/* Insufficient balance indicator */}
      {!canSpin && spinCompleted && currentBalance < betAmount && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FF6B6B] text-white text-[8px] px-2 py-1 rounded-full font-bold"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          INSUFFICIENT BALANCE
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(StartButton);
