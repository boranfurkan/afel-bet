import { SlotIconType } from '@/types/bet';
import React from 'react';
import WinningPatternItem from './WinningPatternItem';
import useWindowSize from '@/hooks/useWindowSize';

const WinningPatternsDisplay = () => {
  const { isMobile } = useWindowSize();
  const ALL_WINNING_MULTIPLIERS = [
    {
      rowOne: {
        elements: [SlotIconType.MEAT, SlotIconType.MEAT, SlotIconType.MEAT],
        multiplier: 1.2,
      },
      rowTwo: {
        elements: [
          SlotIconType.CROCODILE,
          SlotIconType.CROCODILE,
          SlotIconType.CROCODILE,
        ],
        multiplier: 1.2,
      },
    },
    {
      rowOne: {
        elements: [SlotIconType.HEAD, SlotIconType.HEAD, SlotIconType.HEAD],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.TRUMP, SlotIconType.TRUMP, SlotIconType.TRUMP],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.SOLANA,
          SlotIconType.SOLANA,
          SlotIconType.SOLANA,
        ],
        multiplier: 5,
      },
      rowTwo: {
        elements: [SlotIconType.AFEL, SlotIconType.AFEL, SlotIconType.AFEL],
        multiplier: 10,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.CROCODILE,
        ],
        multiplier: 1.6,
      },
      rowTwo: {
        elements: [SlotIconType.HEAD, SlotIconType.TRUMP, SlotIconType.HEAD],
        multiplier: 2.5,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.CROCODILE,
          SlotIconType.SOLANA,
          SlotIconType.AFEL,
        ],
        multiplier: 3.5,
      },
      rowTwo: {
        elements: [SlotIconType.TRUMP, SlotIconType.AFEL, SlotIconType.SOLANA],
        multiplier: 4.5,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
        ],
        multiplier: 1.4,
      },
      rowTwo: {
        elements: [SlotIconType.TRUMP, SlotIconType.SOLANA, SlotIconType.AFEL],
        multiplier: 10,
      },
    },
    {
      rowOne: {
        elements: [SlotIconType.HEAD, SlotIconType.SOLANA, SlotIconType.AFEL],
        multiplier: 6,
      },
      rowTwo: {
        elements: [SlotIconType.MEAT, SlotIconType.MEAT, SlotIconType.MEAT],
        multiplier: 1.2,
      },
    },
  ];

  const sortedPatterns = ALL_WINNING_MULTIPLIERS.sort((a, b) => {
    return b.rowOne.multiplier - a.rowOne.multiplier;
  });
  return (
    <div className="bg-[#A0C380] p-1 pt-0 w-full">
      <div className="slot-gradient-to-bottom p-1 md:p-2 border-[1.5px] md:border-[2.5px] border-black w-full">
        <div className="rounded-[10px] w-full flex items-center justify-start p-1 md:p-2 gap-2 md:gap-3 overflow-x-auto no-scrollbar">
          {sortedPatterns.map((item, index) => (
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
