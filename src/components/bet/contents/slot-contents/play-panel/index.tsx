import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import BetChoosePanel from './bet-choose/BetChoosePanel';
import BetInput from './bet-input/BetInput';
import StartButton from './start-button/StartButton';
import useWindowSize from '@/hooks/useWindowSize';
import { Gift, ToggleLeft, ToggleRight, Zap, AlertCircle } from 'lucide-react';

interface PlayPanelProps {
  onClosePortal?: () => void;
}

const PlayPanel = ({ onClosePortal }: PlayPanelProps) => {
  const {
    winResult,
    isSpinning,
    userBalance,
    demoBalance,
    gameMode,
    setGameMode,
    freeSpinsRemaining,
    utiliseFreeSpinSlots,
    canUseFreeSpins,
    spinCompleted,
  } = useSlotMachine();
  const { isMobile, isTablet } = useWindowSize();
  const [displayBalance, setDisplayBalance] = useState(0);

  const showWinAnimation = winResult?.isWin && !isSpinning;
  const isSmallScreen = isMobile || isTablet;

  // Update the display balance when animations finish
  useEffect(() => {
    const currentBalance = gameMode === 'demo' ? demoBalance : userBalance;

    // Both demo and normal mode: respect animation timing for consistent UX
    if (isSpinning) {
      // Don't update display during spinning to avoid spoiler effect
      return;
    }

    if (spinCompleted) {
      // Update display balance after animations complete
      setDisplayBalance(currentBalance);
    }
  }, [isSpinning, spinCompleted, userBalance, demoBalance, gameMode]);

  // Set initial balance
  useEffect(() => {
    const currentBalance = gameMode === 'demo' ? demoBalance : userBalance;
    
    // Only set initial balance if not currently spinning to maintain consistency
    if (!isSpinning) {
      setDisplayBalance(currentBalance);
    }
  }, [gameMode, userBalance, demoBalance, isSpinning]);

  const handleGameModeToggle = () => {
    setGameMode(gameMode === 'demo' ? 'normal' : 'demo');
  };

  const handleFreeSpinClick = () => {
    if (canUseFreeSpins) {
      utiliseFreeSpinSlots();
      if (onClosePortal) onClosePortal();
    }
  };

  return (
    <div className="h-full bg-[#22560F] p-1 sm:p-2 md:p-3 flex flex-col">
      <div className="slot-gradient-to-bottom border-2 border-black rounded-lg flex-1 flex flex-col p-1 sm:p-2 md:p-3 gap-1 sm:gap-1.5 md:gap-2">
        {/* Game Mode Toggle */}
        <motion.div
          className="bg-[#171717]/50 rounded-md p-2 sm:p-3 text-white border-l-2 sm:border-l-4 border-[#a0c380]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm sm:text-base uppercase font-semibold leading-tight">
                  {gameMode === 'demo'
                    ? 'Switch To Real Play'
                    : 'Switch To Demo Mode'}
                </span>
              </div>
            </div>
            <motion.button
              onClick={handleGameModeToggle}
              className="flex items-center gap-1 text-[#a0c380] hover:text-white transition-colors touch-manipulation p-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {gameMode === 'demo' ? (
                <ToggleRight size={isSmallScreen ? 24 : 28} />
              ) : (
                <ToggleLeft size={isSmallScreen ? 24 : 28} />
              )}
            </motion.button>
          </div>
        </motion.div>
        {/* Credit Display */}
        <div className="bg-[#171717]/50 rounded-md p-1.5 sm:p-2 text-white">
          <div className="flex items-center justify-between">
            <div className="uppercase text-[10px] sm:text-xs mb-1 leading-tight">
              {gameMode === 'demo' ? 'Demo Credit' : 'Credit'}
            </div>
            {gameMode === 'demo' && (
              <div className="text-[7px] sm:text-[8px] text-[#a0c380] uppercase">
                Free Play
              </div>
            )}
          </div>
          <motion.div
            className={`text-base sm:text-lg md:text-xl font-bold ${
              gameMode === 'demo' ? 'text-[#a0c380]' : 'text-white'
            }`}
            animate={
              showWinAnimation
                ? {
                    color: ['#ffffff', '#a0c380', '#ffffff'],
                  }
                : gameMode === 'demo'
                ? {
                    color: ['#a0c380', '#78ff00', '#a0c380'],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: showWinAnimation ? 3 : gameMode === 'demo' ? Infinity : 0,
              repeatType: 'reverse',
            }}
          >
            {displayBalance.toLocaleString(undefined, {
              maximumFractionDigits: 3,
              minimumFractionDigits: 0,
            })}{' '}
            SOL
          </motion.div>
        </div>
        <div className="bg-[#D2D2D2] h-px my-0.5 sm:my-1"></div>

        {canUseFreeSpins ? (
          <motion.div
            className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/50 rounded-md p-1.5 sm:p-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <Gift
                    size={isSmallScreen ? 14 : 16}
                    className="text-[#FFD700]"
                  />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="text-[#FFD700] text-[10px] sm:text-xs font-bold uppercase leading-tight">
                    Free Spin Available
                  </div>
                  <div className="text-white/70 text-[8px] sm:text-[9px] leading-tight">
                    {freeSpinsRemaining} remaining
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleFreeSpinClick}
                className="bg-[#FFD700] text-black px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold hover:bg-[#FFA500] transition-colors flex items-center gap-1 flex-shrink-0 touch-manipulation"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!canUseFreeSpins || isSpinning}
              >
                <Zap size={isSmallScreen ? 10 : 12} />
                {isSmallScreen ? 'FREE' : 'SPIN FREE'}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-gradient-to-r from-gray-700/20 to-gray-600/20 border border-gray-600/50 rounded-md p-1.5 sm:p-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  <Gift
                    size={isSmallScreen ? 14 : 16}
                    className="text-gray-500"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase leading-tight">
                    No Free Spins Available
                  </div>
                  <div className="text-white/70 text-[8px] sm:text-[9px] leading-tight">
                    {freeSpinsRemaining} remaining
                  </div>
                </div>
              </div>
              <div className="bg-gray-600 text-gray-300 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold flex items-center gap-1 flex-shrink-0 opacity-60">
                <Zap size={isSmallScreen ? 10 : 12} />
                {isSmallScreen ? 'PLAY' : 'KEEP PLAYING'}
              </div>
            </div>
          </motion.div>
        )}
        {/* Mode-specific Information */}
        {gameMode === 'demo' && (
          <motion.div
            className="bg-[#a0c380]/10 border border-[#a0c380]/30 rounded-md p-2 sm:p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-[#a0c380] text-[13px] sm:text-[15px] uppercase font-semibold mb-1 leading-tight">
              Demo Mode Info
            </div>
            <div className="text-white/70 text-[11px] sm:text-[13px] leading-relaxed space-y-1">
              <div>• Practice with virtual SOL</div>
              <div>• No real money involved</div>
              <div>• Perfect for testing</div>
            </div>
          </motion.div>
        )}
        {/* Bet Selection Buttons */}
        <div className="space-y-1 sm:space-y-1.5">
          <BetChoosePanel isMobile={isSmallScreen} />
        </div>
        {/* Bet Input */}
        <div className="space-y-1 sm:space-y-1.5">
          <BetInput isMobile={isSmallScreen} />
        </div>
        {/* Start Button */}
        <div className="mt-2 sm:mt-4">
          <StartButton isMobile={isSmallScreen} onClosePortal={onClosePortal} />
        </div>
        {/* Balance Warning for Demo Mode */}
        {gameMode === 'demo' && displayBalance < 1 && (
          <motion.div
            className="bg-[#FF6B6B]/20 border border-[#FF6B6B]/50 rounded-md p-1.5 sm:p-2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <AlertCircle
                size={isSmallScreen ? 12 : 14}
                className="text-[#FF6B6B]"
              />
              <div className="text-[#FF6B6B] text-[8px] sm:text-[9px] uppercase font-semibold">
                Low Demo Balance
              </div>
            </div>
            <button
              onClick={() => setGameMode('demo')} // This will reset demo balance to 100
              className="bg-[#a0c380] text-black px-2 sm:px-3 py-1 rounded text-[8px] sm:text-[9px] font-semibold hover:bg-[#8db170] transition-colors touch-manipulation"
            >
              Reset Demo Balance
            </button>
          </motion.div>
        )}
        {/* Mobile-specific spacing */}
        {isSmallScreen && <div className="flex-1 min-h-2" />}
      </div>
    </div>
  );
};

export default PlayPanel;
