import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import SlotReel from './SlotReel';
import WinMultiplierEffect from './WinMultiplierEffect';
import WinningLine from './WinningLine';
import { getWinPatternType } from '@/lib/win-patterns';
import { SlotIconType } from '@/types/bet';
import { motion, AnimatePresence } from 'framer-motion';
import RowIndicator from './RowIndicator';
import { useSlotMachineOdds } from '@/hooks/bet/useSlotMachineOdds';

interface SlotPanelProps {
  onReelStop: (columnIndex: number) => void;
  completedReels: number;
  isMobile?: boolean;
}

const SlotPanelLoader: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  return (
    <motion.div
      className="slot-machine-container w-full bg-black/30 rounded-lg backdrop-blur-sm relative overflow-visible z-20"
      style={{
        minHeight: isMobile ? '320px' : '462px',
        height: isMobile ? '320px' : '462px',
        maxHeight: isMobile ? '350px' : '462px',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Loading reels */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 h-full w-full p-2 md:p-3">
        {[0, 1, 2].map((columnIndex) => (
          <div
            key={`loading-reel-${columnIndex}`}
            className="relative h-full overflow-hidden border-2 border-[#6c924a]/50 rounded-md bg-gradient-to-b from-white/30 to-white/5"
            style={{ minHeight: isMobile ? '300px' : '450px' }}
          >
            {/* Loading shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />

            {/* Loading slots */}
            {[0, 1, 2].map((rowIndex) => (
              <motion.div
                key={`loading-slot-${columnIndex}-${rowIndex}`}
                className="absolute w-full flex items-center justify-center bg-white/5 border-b border-white/10"
                style={{
                  height: `${isMobile ? 100 : 150}px`,
                  top: `${rowIndex * (isMobile ? 100 : 150)}px`,
                }}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: columnIndex * 0.2 + rowIndex * 0.1,
                }}
              >
                {/* Loading icon placeholder */}
                <div
                  className="rounded-full bg-gradient-to-br from-[#8db170]/40 to-[#6c924a]/40 animate-pulse"
                  style={{
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80,
                  }}
                />
              </motion.div>
            ))}

            {/* Gradient overlays */}
            <div className="absolute inset-x-0 top-0 h-[10px] pointer-events-none bg-gradient-to-b from-white/10 to-transparent z-10"></div>
            <div className="absolute inset-x-0 bottom-0 h-[10px] pointer-events-none bg-gradient-to-t from-white/10 to-transparent z-10"></div>
          </div>
        ))}
      </div>

      {/* Row indicators - Hide on mobile */}
      {!isMobile && (
        <>
          <RowIndicator side="left" containerHeight="420" />
          <RowIndicator side="right" containerHeight="420" />
        </>
      )}

      {/* Loading text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#8db170]/30">
          <motion.p
            className="text-[#8db170] text-sm font-medium"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing Slot Machine...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SlotPanel: React.FC<SlotPanelProps> = ({
  onReelStop,
  completedReels,
  isMobile = false,
}) => {
  const {
    slotValues,
    isSpinning,
    winResult,
    spinCompleted,
    reelsCompleted,
    markReelCompleted,
  } = useSlotMachine();
  const { isLoading: isOddsLoading } = useSlotMachineOdds();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [showLoader, setShowLoader] = useState(true);
  const [shouldShowWinningLines, setShouldShowWinningLines] = useState(false);
  const [winResultReady, setWinResultReady] = useState(false);

  // Handle loader visibility
  useEffect(() => {
    if (!isOddsLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOddsLoading]);

  // Update container size when it changes or when component mounts
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    if (!showLoader) {
      updateSize();
      window.addEventListener('resize', updateSize);
      const timer = setTimeout(updateSize, 100);

      return () => {
        window.removeEventListener('resize', updateSize);
        clearTimeout(timer);
      };
    }
  }, [showLoader]);

  // Track when win result is properly set and ready
  useEffect(() => {
    if (
      winResult &&
      winResult.isWin &&
      winResult.winningPatterns &&
      winResult.winningPatterns.length > 0
    ) {
      setWinResultReady(true);
    } else {
      setWinResultReady(false);
    }
  }, [winResult]);

  // Reset states when spinning starts
  useEffect(() => {
    if (isSpinning) {
      setShouldShowWinningLines(false);
      setWinResultReady(false);
    }
  }, [isSpinning]);

  // Enhanced logic for showing winning lines - now waits for all reels to complete
  useEffect(() => {
    const allReelsCompleted = reelsCompleted === 3;
    const canShowWinningLines =
      winResultReady &&
      !isSpinning &&
      spinCompleted &&
      allReelsCompleted &&
      containerSize.width > 0 &&
      containerSize.height > 0;

    if (canShowWinningLines) {
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        setShouldShowWinningLines(true);
      }, 300); // Increased delay for better synchronization
      return () => clearTimeout(timer);
    } else {
      setShouldShowWinningLines(false);
    }
  }, [
    winResultReady,
    isSpinning,
    spinCompleted,
    reelsCompleted,
    containerSize.width,
    containerSize.height,
  ]);

  // Force container size update when the slot machine container is ready
  useEffect(() => {
    if (!showLoader && containerRef.current) {
      const timer = setTimeout(() => {
        const rect = containerRef.current!.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  // Handle reel completion
  const handleReelStop = useCallback(
    (columnIndex: number) => {
      onReelStop(columnIndex);
      markReelCompleted();
    },
    [onReelStop, markReelCompleted]
  );

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
      if (!winResult || !winResult.isWin || !winResult.winningPatterns)
        return [];

      return winResult.winningPatterns.flatMap((pattern) =>
        pattern
          .filter((index) => index % 3 === columnIndex)
          .map((index) => Math.floor(index / 3))
      );
    },
    [winResult]
  );

  // Debug logging (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Winning Lines Debug:', {
        shouldShowWinningLines,
        winResultReady,
        isWin: winResult?.isWin,
        isSpinning,
        spinCompleted,
        reelsCompleted,
        allReelsCompleted: reelsCompleted === 3,
        winningPatterns: winResult?.winningPatterns,
        containerSize,
        winResult,
      });
    }
  }, [
    shouldShowWinningLines,
    winResultReady,
    winResult,
    isSpinning,
    spinCompleted,
    reelsCompleted,
    containerSize,
  ]);

  return (
    <div
      className="w-full h-full flex items-center justify-center relative border-l-2 border-[#8db170] overflow-visible px-2 py-2 md:px-3 md:py-4"
      style={{ minHeight: isMobile ? '300px' : '462px' }}
    >
      <Image
        src="/images/bet/slot-background.png"
        fill
        alt="slot background"
        className="object-center object-cover pointer-events-none opacity-60 select-none"
        priority
      />

      <AnimatePresence mode="wait">
        {showLoader ? (
          <SlotPanelLoader key="loader" isMobile={isMobile} />
        ) : (
          <motion.div
            key="slot-machine"
            ref={containerRef}
            className="slot-machine-container w-full bg-black/30 rounded-lg backdrop-blur-sm relative overflow-visible z-20"
            style={{
              minHeight: isMobile ? '320px' : '462px',
              height: isMobile ? '320px' : '462px',
              maxHeight: isMobile ? '350px' : '462px',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onAnimationComplete={() => {
              // Force size update after animation
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
              }
            }}
          >
            {/* Slot reels */}
            <div className="grid grid-cols-3 gap-1 md:gap-2 h-full w-full p-2 md:p-3">
              {[0, 1, 2].map((columnIndex) => (
                <SlotReel
                  key={`reel-${columnIndex}`}
                  columnIndex={columnIndex}
                  finalValues={getColumnValues(columnIndex)}
                  isSpinning={isSpinning}
                  winningRows={getWinningRowsForColumn(columnIndex)}
                  onReelStop={() => handleReelStop(columnIndex)}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {/* Row indicators - Hide on mobile */}
            {!isMobile && (
              <>
                <RowIndicator side="left" containerHeight="420" />
                <RowIndicator side="right" containerHeight="420" />
              </>
            )}

            {/* Winning lines - using backend data */}
            <AnimatePresence>
              {shouldShowWinningLines &&
                winResult &&
                winResult.winningPatterns &&
                winResult.winningPatterns.map((pattern, index) => (
                  <motion.div
                    key={`win-line-wrapper-${index}-${winResult.timestamp}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <WinningLine
                      pattern={pattern}
                      containerWidth={containerSize.width}
                      containerHeight={containerSize.height}
                      patternType={getWinPatternType(pattern)}
                      lineWidth={isMobile ? 4 : 6}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>

            {/* Win multiplier effect - using backend data */}
            <AnimatePresence>
              {shouldShowWinningLines && winResult && (
                <motion.div
                  key={`win-effect-${winResult.timestamp}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <WinMultiplierEffect
                    multiplier={winResult.multiplier}
                    winAmount={winResult.winAmount}
                    isVisible={true}
                    winningPatterns={winResult.winningPatterns}
                    isFreeSpin={winResult.usedFreeSpin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(SlotPanel);
