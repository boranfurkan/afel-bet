import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import SlotReel from './SlotReel';
import WinMultiplierEffect from './WinMultiplierEffect';
import WinningLine from './WinningLine';
import { getWinPatternType } from '@/lib/win-patterns';
import { SlotIconType } from '@/types/bet';
import { motion } from 'framer-motion';
import RowIndicator from './RowIndicator';

interface SlotPanelProps {
  onReelStop: (columnIndex: number) => void;
  completedReels: number;
  isReady: boolean;
}

const SlotPanel: React.FC<SlotPanelProps> = ({
  onReelStop,
  completedReels,
  isReady,
}) => {
  const { slotValues, isSpinning, winResult } = useSlotMachine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size when it changes or when component mounts
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    // Initial size measurement
    updateSize();

    // Set up resize listener
    window.addEventListener('resize', updateSize);

    // Measure again after a short delay to ensure all elements have rendered
    const timer = setTimeout(updateSize, 300);

    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, []);

  const getColumnValues = useCallback(
    (columnIndex: number): SlotIconType[] => {
      return [
        slotValues[columnIndex],
        slotValues[columnIndex + 3],
        slotValues[columnIndex + 6],
      ];
    },
    [slotValues]
  );

  const getWinningRowsForColumn = useCallback(
    (columnIndex: number): number[] => {
      if (!winResult || !winResult.isWin) return [];

      return winResult.winningPatterns.flatMap((pattern) =>
        pattern
          .filter((index) => index % 3 === columnIndex)
          .map((index) => Math.floor(index / 3))
      );
    },
    [winResult]
  );

  // Check if we should show winning lines
  const showWinningLines =
    winResult?.isWin && !isSpinning && completedReels === 3;

  return (
    <div className="w-full h-full flex items-center justify-center relative border-l-2 border-[#8db170] overflow-visible px-3 py-4">
      <Image
        src="/images/bet/slot-background.png"
        fill
        alt="slot background"
        className="object-center object-cover pointer-events-none opacity-60 select-none"
        priority
      />

      <motion.div
        ref={containerRef}
        className="slot-machine-container w-full min-h-[462px] h-full max-h-[462px] bg-black/30 rounded-lg backdrop-blur-sm relative overflow-visible z-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Slot reels */}
        <div className="grid grid-cols-3 gap-2 h-full w-full p-3">
          {[0, 1, 2].map((columnIndex) => (
            <SlotReel
              key={`reel-${columnIndex}`}
              columnIndex={columnIndex}
              finalValues={getColumnValues(columnIndex)}
              isSpinning={isSpinning}
              winningRows={getWinningRowsForColumn(columnIndex)}
              onReelStop={() => onReelStop(columnIndex)}
            />
          ))}
        </div>

        {/* Row indicators */}
        <RowIndicator side="left" containerHeight="420" />
        <RowIndicator side="right" containerHeight="420" />

        {/* Winning lines */}
        {showWinningLines &&
          winResult.winningPatterns.map((pattern, index) => (
            <WinningLine
              key={`win-line-${index}`}
              pattern={pattern}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
              patternType={getWinPatternType(pattern)}
            />
          ))}
      </motion.div>
    </div>
  );
};

export default memo(SlotPanel);
