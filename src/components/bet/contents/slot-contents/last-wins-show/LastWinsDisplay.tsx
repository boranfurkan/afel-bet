import React, { useMemo } from 'react';
import LastWinItem from './LastWinItem';
import LastWinItemSkeleton from './LastWinItemSkeleton';
import { SlotIconType } from '@/types/bet';
import { useGame } from '@/hooks/bet/useGame';
import { symbolsToNumbers } from '@/utils/gameUtils';

const LastWinsDisplay = () => {
  const { slotMachine } = useGame('slotmachine');

  const lastWins = useMemo(() => {
    if (!slotMachine?.history) return [];

    return slotMachine.history.items.map((game) => {
      const rowOne = {
        elements: symbolsToNumbers(game.symbols.slice(0, 3)),
        multiplier: game.multiplier,
      };
      const rowTwo = {
        elements: symbolsToNumbers(game.symbols.slice(3, 6)),
        multiplier: game.multiplier,
      };
      return { rowOne, rowTwo };
    });
  }, [slotMachine?.history]);

  return (
    <div className="bg-[#A0C380] p-1 pt-0 w-full">
      <div className="slot-gradient-to-bottom p-2 border-[2.5px] border-black w-full">
        <div className="rounded-[10px] w-full flex items-center justify-start p-2 gap-3 overflow-x-auto no-scrollbar">
          {slotMachine.isLoading || !slotMachine?.history
            ? [...Array(10)].map((_, index) => (
                <LastWinItemSkeleton key={`skeleton-${index}`} />
              ))
            : lastWins.map((item, index) => (
                <LastWinItem
                  rowOne={item.rowOne}
                  rowTwo={item.rowTwo}
                  key={`last-win-item-${index}`}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default LastWinsDisplay;
