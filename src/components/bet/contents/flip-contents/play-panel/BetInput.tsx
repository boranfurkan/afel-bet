import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import ArrowUpIcon from '@/assets/icons/ArrowUpIcon';
import { useState } from 'react';

const BetInput = () => {
  const [betAmount, setBetAmount] = useState<number>(0.1);
  const minBet = 0.1;
  const maxBet = 2;

  const isError = betAmount < minBet || betAmount > maxBet;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBetAmount(value);
  };

  const handleIncrement = () => {
    setBetAmount((prev) => Math.min(prev + 0.1, maxBet));
  };

  const handleDecrement = () => {
    setBetAmount((prev) => Math.max(prev - 0.1, minBet));
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between mb-1 px-1">
        <span className="text-[#979797] font-normal text-[11px] leading-[14px] tracking-[0%]">
          Min: {minBet} SOL
        </span>
        <span className="text-[#979797] font-normal text-[11px] leading-[14px] tracking-[0%]">
          Max: {maxBet} SOL
        </span>
      </div>
      {isError && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[#FF0018] font-normal text-[19.46px] leading-[20.26px] tracking-[0%] text-center">
          {betAmount < minBet
            ? `MIN BET ${minBet} SOL`
            : `MAX BET ${maxBet} SOL`}
        </div>
      )}
      <input
        className="w-full bg-[#171717] text-white px-4 py-2.5 rounded-[5.47px] border border-[#979797] font-normal text-[13.18px] leading-[22.14px] tracking-[0%] pr-12"
        type="number"
        step={0.1}
        min={minBet}
        max={maxBet}
        value={betAmount}
        onChange={handleInputChange}
      />
      <div className="flex flex-col absolute top-0 right-5 h-full justify-center gap-4">
        <div className={`cursor-pointer`} onClick={handleIncrement}>
          <ArrowUpIcon width={19.39} height={9.7} />
        </div>
        <div className={`cursor-pointer`} onClick={handleDecrement}>
          <ArrowDownIcon width={19.39} height={9.7} />
        </div>
      </div>
    </div>
  );
};

export default BetInput;
