import { useCallback, useEffect } from 'react';
import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import ArrowUpIcon from '@/assets/icons/ArrowUpIcon';
import { useSlotMachine } from '@/contexts/SlotMachineContext';

interface BetInputProps {
  isMobile?: boolean;
}

const BetInput: React.FC<BetInputProps> = ({ isMobile = false }) => {
  const { userBalance, betAmount, setBetAmount, isSpinning } = useSlotMachine();
  const minBet = 0.1;
  const maxBet = 2;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSpinning) return;

      if (e.target.value === '') {
        setBetAmount(0);
        return;
      }

      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setBetAmount(value);
      }
    },
    [isSpinning, setBetAmount]
  );

  const increaseValue = useCallback(() => {
    if (isSpinning) return;

    const newValue = betAmount + 0.1;
    const roundedValue = Math.round(newValue * 10) / 10;
    if (roundedValue <= userBalance && roundedValue <= maxBet) {
      setBetAmount(roundedValue);
    }
  }, [isSpinning, betAmount, userBalance, maxBet, setBetAmount]);

  const decreaseValue = useCallback(() => {
    if (isSpinning) return;

    const newValue = Math.max(minBet, betAmount - 0.1);
    const roundedValue = Math.round(newValue * 10) / 10;
    setBetAmount(roundedValue);
  }, [isSpinning, betAmount, minBet, setBetAmount]);

  return (
    <div className="relative w-full">
      <div className="flex justify-between mb-1 px-1">
        <span className="text-[#979797] font-normal text-[8px] md:text-[11px] leading-[14px] tracking-[0%]">
          Min: {minBet} SOL
        </span>
        <span className="text-[#979797] font-normal text-[8px] md:text-[11px] leading-[14px] tracking-[0%]">
          Max: {maxBet} SOL
        </span>
      </div>
      <input
        className={`w-full bg-[#171717] text-white px-2 md:px-4 py-1.5 md:py-2.5 rounded-[5.47px] border border-[#979797] font-normal ${
          isMobile ? 'text-lg' : 'text-[26.99px]'
        } leading-[45.33px] tracking-[0%] pr-10 md:pr-12`}
        type="number"
        step="0.1"
        min={minBet}
        max={maxBet}
        value={betAmount}
        onChange={handleChange}
        disabled={isSpinning}
      />
      <div
        className={`flex flex-col absolute ${
          isMobile ? 'top-1.5 right-3' : 'top-2.5 right-5'
        } h-full justify-center gap-2 md:gap-4`}
      >
        <div
          className={`cursor-pointer ${
            isSpinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={increaseValue}
        >
          <ArrowUpIcon
            width={isMobile ? 14 : 19.39}
            height={isMobile ? 7 : 9.7}
          />
        </div>
        <div
          className={`cursor-pointer ${
            isSpinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={decreaseValue}
        >
          <ArrowDownIcon
            width={isMobile ? 14 : 19.39}
            height={isMobile ? 7 : 9.7}
          />
        </div>
      </div>
    </div>
  );
};

export default BetInput;
