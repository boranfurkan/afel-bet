import { SlotIconType } from '@/types/bet';
import React, { useMemo } from 'react';
import WinningPatternItem from './WinningPatternItem';
import useWindowSize from '@/hooks/useWindowSize';
import { useSlotMachineOdds } from '@/hooks/bet/useSlotMachineOdds';
import BetLoadingSpinner from '@/components/bet/BetLoadingSpinner';

const WinningPatternsDisplay = () => {
  const { isMobile } = useWindowSize();

  // Use the new hook to get odds from backend
  const { iconMultipliers, specialCombinations, isLoading } =
    useSlotMachineOdds();

  // Generate patterns to display
  const winningPatterns = useMemo(() => {
    if (isLoading || !iconMultipliers || !specialCombinations) {
      return [];
    }

    // Create three of a kind patterns
    const threeOfAKindPatterns = Object.entries(iconMultipliers).map(
      ([iconType, multiplier]) => {
        const iconTypeNum = parseInt(iconType) as SlotIconType;
        return {
          elements: [iconTypeNum, iconTypeNum, iconTypeNum],
          multiplier: multiplier,
        };
      }
    );

    // Create special combination patterns
    const specialPatterns = specialCombinations.map((combo) => ({
      elements: combo.combo,
      multiplier: combo.multiplier,
    }));

    // Combine all patterns
    const allPatterns = [...threeOfAKindPatterns, ...specialPatterns];

    // Group patterns in pairs for display
    const pairedPatterns = [];
    for (let i = 0; i < allPatterns.length; i += 2) {
      if (i + 1 < allPatterns.length) {
        pairedPatterns.push({
          rowOne: allPatterns[i],
          rowTwo: allPatterns[i + 1],
        });
      } else {
        pairedPatterns.push({
          rowOne: allPatterns[i],
          rowTwo: null,
        });
      }
    }

    // Sort by highest multiplier first
    return pairedPatterns.sort((a, b) => {
      return b.rowOne.multiplier - a.rowOne.multiplier;
    });
  }, [iconMultipliers, specialCombinations, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-[#A0C380] p-1 pt-0 w-full">
        <div className="slot-gradient-to-bottom p-1 md:p-2 border-[1.5px] md:border-[2.5px] border-black w-full">
          <div className="rounded-[10px] w-full flex items-center justify-center p-1 md:p-2 h-20">
            <BetLoadingSpinner text="Loading winning patterns..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#A0C380] p-1 pt-0 w-full">
      <div className="slot-gradient-to-bottom p-1 md:p-2 border-[1.5px] md:border-[2.5px] border-black w-full">
        <div className="rounded-[10px] w-full flex items-center justify-start p-1 md:p-2 gap-2 md:gap-3 overflow-x-auto no-scrollbar">
          {winningPatterns.map((item, index) => (
            <WinningPatternItem
              rowOne={item.rowOne}
              rowTwo={item.rowTwo}
              key={`winning-pattern-item-${index}`}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinningPatternsDisplay;
