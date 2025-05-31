import React from 'react';
import SlotIcon from '../slot-panel/SlotIcon';
import { SlotIconType } from '@/types/bet';

interface LastWinItemProps {
  rowOne: {
    elements: SlotIconType[];
    multiplier: number;
  };
  rowTwo: {
    elements: SlotIconType[];
    multiplier: number;
  } | null;
  isMobile?: boolean;
}

const WinningPatternItem = ({
  rowOne,
  rowTwo,
  isMobile = false,
}: LastWinItemProps) => {
  const iconSize = isMobile ? 20 : 30;
  const textSize = isMobile ? 'text-2xl' : 'text-[48.28px]';

  return (
    <div className="bg-[#DFFFD1] px-2 py-1 md:px-3 md:py-1.5 flex flex-col w-max rounded-[15px] h-full justify-between">
      <div className="flex items-center gap-1 md:gap-2">
        <div className="flex items-center gap-1 md:gap-1.5">
          {rowOne.elements.map((icon, index) => {
            return (
              <SlotIcon
                type={icon}
                size={iconSize}
                key={`row1-icon-${index}`}
              />
            );
          })}
        </div>
        <p
          className={`font-normal ${textSize} leading-[100%] tracking-[0%] text-right align-middle text-black`}
        >
          x
          {rowOne.multiplier !== 10
            ? rowOne.multiplier.toFixed(1)
            : rowOne.multiplier}
        </p>
      </div>

      {rowTwo ? (
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex items-center gap-1 md:gap-1.5">
            {rowTwo.elements.map((icon, index) => {
              return (
                <SlotIcon
                  type={icon}
                  size={iconSize}
                  key={`row2-icon-${index}`}
                />
              );
            })}
          </div>
          <p
            className={`font-normal ${textSize} leading-[100%] tracking-[0%] text-right align-middle text-black`}
          >
            x
            {rowTwo.multiplier !== 10
              ? rowTwo.multiplier.toFixed(1)
              : rowTwo.multiplier}
          </p>
        </div>
      ) : (
        <div
          className="invisible flex items-center"
          style={{ height: isMobile ? '24px' : '48.28px' }}
        ></div>
      )}
    </div>
  );
};

export default WinningPatternItem;
