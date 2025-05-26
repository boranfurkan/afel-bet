import SlotButton from '@/components/UI/SlotButton';
import React from 'react';
import { useSlotMachine } from '@/contexts/SlotMachineContext';

interface BetChoosePanelProps {
  isMobile?: boolean;
}

const BetChoosePanel: React.FC<BetChoosePanelProps> = ({
  isMobile = false,
}) => {
  const { userBalance, setBetAmount, isSpinning } = useSlotMachine();

  const userBalanceInSol = userBalance;

  const handleBetClick = (amount: number) => {
    if (isSpinning) return;
    setBetAmount(amount);
  };

  // Adjust bet options for mobile
  const betOptions = isMobile
    ? [
        { amount: 0.05, label: '0.05' },
        { amount: 0.1, label: '0.1' },
        { amount: 0.25, label: '0.25' },
        { amount: 0.5, label: '0.5' },
        { amount: 1, label: '1' },
        { amount: 2, label: '2' },
      ]
    : [
        { amount: 0.05, label: '0.05 SOL' },
        { amount: 0.1, label: '0.1 SOL' },
        { amount: 0.25, label: '0.25 SOL' },
        { amount: 0.5, label: '0.5 SOL' },
        { amount: 1, label: '1 SOL' },
        { amount: 2, label: '2 SOL' },
      ];

  return (
    <div className="grid grid-cols-2 gap-1 md:gap-2">
      {betOptions.map((option) => (
        <SlotButton
          key={option.amount}
          className={`w-full !px-1 md:!px-3 !py-1 h-10 md:h-16 flex items-center justify-center text-xs md:text-base`}
          size={isMobile ? 'small' : 'large'}
          disabled={userBalanceInSol < option.amount || isSpinning}
          onClick={() => handleBetClick(option.amount)}
        >
          {option.label}
        </SlotButton>
      ))}
    </div>
  );
};

export default BetChoosePanel;
