import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import useSound from 'use-sound';
import { SlotIconType } from '@/types/bet';

import { useSlotMachine as useSlotMachineHook } from '@/hooks/bet/useSlotMachine';
import { useFreeSpin } from '@/hooks/bet/useFreeSpin';
import { useSlotMachineOdds } from '@/hooks/bet/useSlotMachineOdds';
import { symbolsToNumbers } from '@/utils/gameUtils';
import { SlotMachineResultDto } from '@/api';
import { useGame } from '@/hooks/bet/useGame';

export interface WinningResult {
  isWin: boolean;
  multiplier: number;
  winningPatterns: number[][];
  winAmount: number;
  timestamp: number;
  usedFreeSpin: boolean;
}

export type GameMode = 'normal' | 'demo' | 'free';

interface SlotMachineContextType {
  slotValues: SlotIconType[];
  isSpinning: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  spinSlots: () => void;
  winResult: WinningResult | null;
  userBalance: number;
  demoBalance: number;
  slotRefs: React.RefObject<any[]>;
  spinCompleted: boolean;
  markSpinCompleted: () => void;
  resetWinResult: () => void;
  reelsCompleted: number;
  markReelCompleted: () => void;

  // New features
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  freeSpinsRemaining: number;
  utiliseFreeSpinSlots: () => void;
  canUseFreeSpins: boolean;
}

const SlotMachineContext = createContext<SlotMachineContextType | undefined>(
  undefined
);

export const SlotMachineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [slotValues, setSlotValues] = useState<SlotIconType[]>(
    Array(9).fill(SlotIconType.AFEL)
  );
  const [userBalance, setUserBalance] = useState(0);
  const [demoBalance, setDemoBalance] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(0.01);
  const [winResult, setWinResult] = useState<WinningResult | null>(null);
  const [spinCompleted, setSpinCompleted] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [reelsCompleted, setReelsCompleted] = useState(0);

  const slotRefs = useRef<any[]>([]);

  const { solBalance } = useGame();
  const slotMachine = useSlotMachineHook();
  const {
    amount: freeSpinsRemaining,
    status: freeSpinStatus,
    history: freeSpinHistory,
    spinAmount: freeSpinBetAmount,
    refreshFreeSpin,
  } = useFreeSpin();

  const { isLoading: isOddsLoading } = useSlotMachineOdds();

  const [playReelsBegin] = useSound('/sounds/reels-begin.mp3');

  const resetWinResult = useCallback(() => {
    setWinResult(null);
  }, []);

  useEffect(() => {
    if (solBalance) {
      setUserBalance(parseFloat(solBalance.availableBalance));
    }
  }, [solBalance]);

  const getCurrentBalance = useCallback(() => {
    return gameMode === 'demo' ? demoBalance : userBalance;
  }, [gameMode, demoBalance, userBalance]);

  const updateBalance = useCallback(
    (newBalance: number) => {
      if (gameMode === 'demo') {
        setDemoBalance(newBalance);
      } else {
        setUserBalance(newBalance);
      }
    },
    [gameMode]
  );

  // Convert backend winningLines to frontend winning patterns
  const convertWinningLinesToPatterns = useCallback(
    (winningLines: readonly any[]): number[][] => {
      if (!winningLines || winningLines.length === 0) return [];

      return winningLines.map((line) => line.positions || []);
    },
    []
  );

  const markSpinCompleted = useCallback(() => {
    setSpinCompleted(true);
  }, []);

  const markReelCompleted = useCallback(() => {
    setReelsCompleted((prev) => prev + 1);
  }, []);

  // Reset reel completion when starting a new spin
  useEffect(() => {
    if (isSpinning) {
      setReelsCompleted(0);
    }
  }, [isSpinning]);

  // Check if all reels are completed and trigger win result evaluation
  useEffect(() => {
    if (reelsCompleted === 3 && !isSpinning && !spinCompleted) {
      // All reels have finished, now we can show win results
      setTimeout(() => {
        setSpinCompleted(true);
      }, 200); // Small delay to ensure everything is settled
    }
  }, [reelsCompleted, isSpinning, spinCompleted]);

  const canUseFreeSpins = useMemo(() => {
    return freeSpinsRemaining > 0 && gameMode !== 'demo';
  }, [freeSpinsRemaining, gameMode]);

  const spinSlots = useCallback(async () => {
    const currentBalance = getCurrentBalance();

    if (
      isSpinning ||
      !spinCompleted ||
      betAmount > currentBalance ||
      isOddsLoading
    ) {
      return;
    }

    playReelsBegin();
    resetWinResult();
    setIsSpinning(true);
    setSpinCompleted(false);
    setReelsCompleted(0);

    // No frontend balance deduction needed - backend handles it
    // Demo mode handles balance manually since backend doesn't process it
    if (gameMode === 'demo') {
      // Demo mode: deduct bet immediately since backend won't do it
      updateBalance(currentBalance - betAmount);
    }
    // Normal mode: let backend handle balance changes via API

    let newSlotValues: SlotIconType[];
    let playResult: SlotMachineResultDto;

    try {
      if (gameMode === 'demo') {
        // Demo mode - use realistic simulation with drop chances
        playResult = await slotMachine.play(betAmount, false, true);
        newSlotValues = symbolsToNumbers([...playResult.symbols]);
      } else {
        // Normal mode - use real API
        playResult = await slotMachine.play(betAmount, false, false);
        newSlotValues = symbolsToNumbers([...playResult.symbols]);
      }

      setTimeout(() => {
        // Update slot values first
        setSlotValues(newSlotValues);

        // Use ONLY backend data - no frontend calculations
        const result: WinningResult = {
          isWin: playResult.won,
          multiplier: playResult.multiplier,
          winningPatterns: convertWinningLinesToPatterns(
            playResult.winningLines
          ),
          winAmount: playResult.winAmount || 0,
          timestamp: Date.now(),
          usedFreeSpin: playResult.usedFreeSpin,
        };

        // Set win result
        setWinResult(result);

        // Stop spinning - reels will handle their own completion
        setIsSpinning(false);

        // Handle winnings after win effects are shown
        if (result.isWin) {
          setTimeout(() => {
            if (gameMode === 'demo') {
              // Demo mode: add win amount (bet was already deducted)
              const newBalance = getCurrentBalance() + result.winAmount;
              updateBalance(newBalance);
            } else {
              // Normal mode: backend already handled balance changes via API
              // Just let the useGame hook update balance from API response
              // No manual balance manipulation needed
            }
          }, 6000);
        }
        // Always ensure spinCompleted is set to true after animations
        setTimeout(() => {
          setSpinCompleted(true);
        }, 6000);
      }, 3000);
    } catch (error) {
      console.error('Error during spin:', error);
      setIsSpinning(false);
      setSpinCompleted(true);
      setReelsCompleted(0);
    }
  }, [
    isSpinning,
    spinCompleted,
    betAmount,
    getCurrentBalance,
    updateBalance,
    playReelsBegin,
    resetWinResult,
    slotMachine,
    gameMode,
    isOddsLoading,
    convertWinningLinesToPatterns,
  ]);

  const utiliseFreeSpinSlots = useCallback(async () => {
    if (!canUseFreeSpins || isSpinning || !spinCompleted || isOddsLoading) {
      return;
    }

    playReelsBegin();
    resetWinResult();
    setIsSpinning(true);
    setSpinCompleted(false);
    setReelsCompleted(0);

    // Timeout protection - force recovery after 15 seconds
    const timeoutId = setTimeout(() => {
      console.warn('FreeSpin timeout - forcing recovery');
      setIsSpinning(false);
      setSpinCompleted(true);
      setReelsCompleted(0);
    }, 15000);

    try {
      // Use the correct bet amount for free spins
      const playResult = await slotMachine.play(freeSpinBetAmount, true);

      // Multiple refresh attempts to ensure backend transaction is fully committed
      const refreshFreSpinWithRetry = () => {
        // First refresh after 2 seconds
        setTimeout(() => {
          refreshFreeSpin();
        }, 2000);

        // Second refresh after 4 seconds (backup)
        setTimeout(() => {
          refreshFreeSpin();
        }, 4000);

        // Third refresh after 8 seconds (final backup)
        setTimeout(() => {
          refreshFreeSpin();
        }, 8000);
      };

      refreshFreSpinWithRetry();

      const newSlotValues = symbolsToNumbers([...playResult.symbols]);

      setTimeout(() => {
        setSlotValues(newSlotValues);

        // Use ONLY backend data - no frontend calculations
        const result: WinningResult = {
          isWin: playResult.won,
          multiplier: playResult.multiplier,
          winningPatterns: convertWinningLinesToPatterns(
            playResult.winningLines
          ),
          winAmount: playResult.winAmount || 0,
          timestamp: Date.now(),
          usedFreeSpin: playResult.usedFreeSpin,
        };

        setWinResult(result);
        setIsSpinning(false);

        if (result.isWin) {
          setTimeout(() => {
            // Add only the win amount (no bet deduction for free spins)
            const newBalance = getCurrentBalance() + result.winAmount;
            updateBalance(newBalance);
          }, 6000);
        }
        // Always ensure spinCompleted is set to true after animations
        setTimeout(() => {
          setSpinCompleted(true);
          clearTimeout(timeoutId); // Clear timeout if successful
        }, 6000);
      }, 3000);
    } catch (error) {
      console.error('Error using free spins:', error);
      setIsSpinning(false);
      setSpinCompleted(true);
      setReelsCompleted(0);
      clearTimeout(timeoutId); // Clear timeout on error
    }
  }, [
    canUseFreeSpins,
    isSpinning,
    spinCompleted,
    playReelsBegin,
    resetWinResult,
    refreshFreeSpin,
    slotMachine,
    freeSpinBetAmount,
    getCurrentBalance,
    updateBalance,
    isOddsLoading,
    convertWinningLinesToPatterns,
  ]);

  useEffect(() => {
    if (gameMode === 'demo') {
      setDemoBalance(100);
    }
  }, [gameMode]);

  const value = {
    slotValues,
    isSpinning,
    betAmount,
    setBetAmount,
    spinSlots,
    winResult,
    userBalance,
    demoBalance,
    slotRefs,
    spinCompleted,
    markSpinCompleted,
    resetWinResult,
    reelsCompleted,
    markReelCompleted,

    // New features
    gameMode,
    setGameMode,
    freeSpinsRemaining,
    utiliseFreeSpinSlots,
    canUseFreeSpins,
  };

  return (
    <SlotMachineContext.Provider value={value}>
      {children}
    </SlotMachineContext.Provider>
  );
};

export const useSlotMachine = () => {
  const context = useContext(SlotMachineContext);
  if (context === undefined) {
    throw new Error('useSlotMachine must be used within a SlotMachineProvider');
  }
  return context;
};
