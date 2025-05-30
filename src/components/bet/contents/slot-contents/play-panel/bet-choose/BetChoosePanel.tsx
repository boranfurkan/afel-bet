// src/components/bet/contents/slot-contents/play-panel/bet-choose/BetChoosePanel.tsx
import SlotButton from '@/components/UI/SlotButton';
import React from 'react';
import { useSlotMachine } from '@/contexts/SlotMachineContext';

interface BetChoosePanelProps {
  isMobile?: boolean;
}

const BetChoosePanel: React.FC<BetChoosePanelProps> = ({
  isMobile = false,
}) => {
  const { userBalance, demoBalance, gameMode, setBetAmount, isSpinning } =
    useSlotMachine();

  const currentBalance = gameMode === 'demo' ? demoBalance : userBalance;

  const handleBetClick = (amount: number) => {
    if (isSpinning) return;
    setBetAmount(amount);
  };

  // Updated bet options with new values
  const betOptions = isMobile
    ? [
        { amount: 0.01, label: '0.01' },
        { amount: 0.025, label: '0.025' },
        { amount: 0.05, label: '0.05' },
        { amount: 0.1, label: '0.1' },
        { amount: 0.5, label: '0.5' },
        { amount: 1, label: '1' },
      ]
    : [
        { amount: 0.01, label: '0.01 SOL' },
        { amount: 0.025, label: '0.025 SOL' },
        { amount: 0.05, label: '0.05 SOL' },
        { amount: 0.1, label: '0.1 SOL' },
        { amount: 0.5, label: '0.5 SOL' },
        { amount: 1, label: '1 SOL' },
      ];

  return (
    <div className="grid grid-cols-2 gap-1 md:gap-2">
      {betOptions.map((option) => (
        <SlotButton
          key={option.amount}
          className={`w-full !px-1 md:!px-3 !py-1 h-10 md:h-16 flex items-center justify-center text-xs md:text-base`}
          size={isMobile ? 'small' : 'large'}
          disabled={currentBalance < option.amount || isSpinning}
          onClick={() => handleBetClick(option.amount)}
        >
          {option.label}
        </SlotButton>
      ))}
    </div>
  );
};

export default BetChoosePanel;
