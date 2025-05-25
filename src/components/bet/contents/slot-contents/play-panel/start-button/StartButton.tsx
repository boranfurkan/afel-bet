import React, { memo } from 'react';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import BetLoadingSpinner from '@/components/bet/BetLoadingSpinner';

const StartButton = () => {
  const { spinSlots, isSpinning, betAmount, userBalance, spinCompleted } =
    useSlotMachine();

  const canSpin = !isSpinning && spinCompleted && userBalance >= betAmount;

  return (
    <motion.div
      className={`cursor-pointer flex items-center h-full gap-4 justify-center min-h-[80px] select-none ${
        !canSpin ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={() => canSpin && spinSlots()}
      whileHover={canSpin ? { scale: 1.05 } : {}}
      whileTap={canSpin ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {spinCompleted ? (
        <>
          <ArrowRightIcon width={24} height={47} />
          <span className="font-normal text-[77.25px] leading-[100%] tracking-[0%] text-right align-middle text-white">
            START
          </span>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <BetLoadingSpinner size={30} />
        </div>
      )}
    </motion.div>
  );
};

export default memo(StartButton);
