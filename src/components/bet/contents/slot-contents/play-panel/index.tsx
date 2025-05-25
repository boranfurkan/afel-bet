import React from 'react';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import BetChoosePanel from './bet-choose/BetChoosePanel';
import BetInput from './bet-input/BetInput';
import StartButton from './start-button/StartButton';

const ImprovedPlayPanel = () => {
  const { winResult, isSpinning, userBalance } = useSlotMachine();

  // Show animated payout when there's a win
  const showWinAnimation = winResult?.isWin && !isSpinning;

  return (
    <div className="h-full bg-[#22560F] p-3 flex flex-col">
      <div className="slot-gradient-to-bottom border-2 border-black rounded-lg flex-1 flex flex-col p-3 gap-2">
        {/* Credit Display */}
        <div className="bg-[#171717]/50 rounded-md p-2 text-white">
          <div className="uppercase text-xs mb-1">CREDIT</div>
          <motion.div
            className="text-xl"
            animate={
              showWinAnimation
                ? {
                    color: ['#ffffff', '#a0c380', '#ffffff'],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: showWinAnimation ? 3 : 0,
              repeatType: 'reverse',
            }}
          >
            {userBalance.toFixed(1)}
          </motion.div>
        </div>

        <div className="bg-[#D2D2D2] h-px my-1"></div>

        {/* Bet Selection Buttons */}
        <BetChoosePanel />

        {/* Bet Input */}
        <BetInput />

        <StartButton />
      </div>
    </div>
  );
};

export default ImprovedPlayPanel;
