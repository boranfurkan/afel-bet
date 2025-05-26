import React, { memo } from 'react';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import BetLoadingSpinner from '@/components/bet/BetLoadingSpinner';

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
  const { spinSlots, isSpinning, betAmount, userBalance, spinCompleted } =
    useSlotMachine();

  const canSpin = !isSpinning && spinCompleted && userBalance >= betAmount;

  // Text size based on screen size
  const textSize = isMobile ? 'text-4xl' : 'text-[77.25px]';
  const iconSize = isMobile ? 16 : 24;

  return (
    <motion.div
      className={`cursor-pointer flex items-center h-full gap-2 md:gap-4 justify-center ${
        isMobile ? 'min-h-[50px]' : 'min-h-[80px]'
      } select-none ${
        !canSpin ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      onClick={() => {
        if (canSpin && spinSlots) {
          spinSlots();
          if (onClosePortal) onClosePortal();
        }
      }}
      whileHover={canSpin ? { scale: 1.05 } : {}}
      whileTap={canSpin ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {spinCompleted ? (
        <>
          <ArrowRightIcon width={iconSize} height={iconSize * 2} />
          <span
            className={`font-normal ${textSize} leading-[100%] tracking-[0%] text-right align-middle text-white`}
          >
            START
          </span>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <BetLoadingSpinner size={isMobile ? 20 : 30} />
        </div>
      )}
    </motion.div>
  );
};

export default memo(StartButton);
