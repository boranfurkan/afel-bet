import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import useSound from "use-sound";
import {
  WINNING_PATTERNS,
  ICON_MULTIPLIERS,
  isFullMatch,
  checkSpecialCombination,
  generateSlotResult,
} from "@/lib/win-patterns";
import { SlotIconType } from "@/types/bet";
import { useGame } from "@/hooks/bet/useGame";
import { symbolsToNumbers } from "@/utils/gameUtils";
import { useSlotMachine as useSlotMachineHook } from "@/hooks/bet/useSlotMachine";
import { useFreeSpin } from "@/hooks/bet/useFreeSpin";
import { frameSteps } from "framer-motion";
import { SlotMachineResultDto } from "@/api";

export interface WinningResult {
  isWin: boolean;
  multiplier: number;
  winningPatterns: number[][];
  winAmount: number;
  timestamp: number;
}

export type GameMode = "normal" | "demo" | "free";

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
  const [demoBalance, setDemoBalance] = useState(100); // Demo starts with 100 SOL
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(0.1);
  const [winResult, setWinResult] = useState<WinningResult | null>(null);
  const [spinCompleted, setSpinCompleted] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode>("normal");

  const slotRefs = useRef<any[]>([]);

  const { solBalance } = useGame();
  const slotMachine = useSlotMachineHook();
  const {
    amount: freeSpinsRemaining,
    status: freeSpinStatus,
    history: freeSpinHistory,
    refreshFreeSpin,
  } = useFreeSpin();

  // Sound hooks
  const [playReelsBegin] = useSound("/sounds/reels-begin.mp3");

  const resetWinResult = useCallback(() => {
    setWinResult(null);
  }, []);

  useEffect(() => {
    if (solBalance) {
      setUserBalance(parseFloat(solBalance.availableBalance));
    }
  }, [solBalance]);

  const getCurrentBalance = useCallback(() => {
    return gameMode === "demo" ? demoBalance : userBalance;
  }, [gameMode, demoBalance, userBalance]);

  const updateBalance = useCallback(
    (newBalance: number) => {
      if (gameMode === "demo") {
        setDemoBalance(newBalance);
      } else {
        setUserBalance(newBalance);
      }
    },
    [gameMode]
  );

  const calculateWinnings = useCallback(
    (slots: SlotIconType[]): WinningResult => {
      let totalMultiplier = 0;
      const winningPatterns: number[][] = [];

      for (const pattern of WINNING_PATTERNS) {
        const patternValues = [
          slots[pattern[0]],
          slots[pattern[1]],
          slots[pattern[2]],
        ];

        if (isFullMatch(patternValues)) {
          totalMultiplier += ICON_MULTIPLIERS[patternValues[0]];
          winningPatterns.push(pattern);
          continue;
        }

        const specialMultiplier = checkSpecialCombination(patternValues);
        if (specialMultiplier !== null) {
          totalMultiplier += specialMultiplier;
          winningPatterns.push(pattern);
        }
      }

      const isWin = totalMultiplier > 0;
      const winAmount = isWin ? betAmount * totalMultiplier : 0;

      return {
        isWin,
        multiplier: totalMultiplier,
        winningPatterns,
        winAmount,
        timestamp: Date.now(),
      };
    },
    [betAmount]
  );

  const markSpinCompleted = useCallback(() => {
    setSpinCompleted(true);
  }, []);

  const canUseFreeSpins = useMemo(() => {
    return freeSpinsRemaining > 0 && gameMode !== "demo";
  }, [freeSpinsRemaining, gameMode]);

  const spinSlots = useCallback(async () => {
    const currentBalance = getCurrentBalance();

    if (isSpinning || !spinCompleted || betAmount > currentBalance) {
      console.log({
        isSpinning,
        spinCompleted,
        betAmount,
        currentBalance,
        gameMode,
      });
      return;
    }

    playReelsBegin();
    resetWinResult();
    setIsSpinning(true);
    setSpinCompleted(false);

    // Deduct bet amount
    updateBalance(currentBalance - betAmount);

    let newSlotValues: SlotIconType[];
    let playResult: SlotMachineResultDto;

    if (gameMode === "demo") {
      // Demo mode - use realistic simulation with drop chances
      // newSlotValues = generateSlotResult();
      playResult = await slotMachine.play(betAmount, false, true);
      newSlotValues = symbolsToNumbers([...playResult.symbols]);
    } else {
      // Normal mode - use real API
      playResult = await slotMachine.play(betAmount, false, false);
      newSlotValues = symbolsToNumbers([...playResult.symbols]);
    }

    setTimeout(() => {
      setSlotValues(newSlotValues);
      const result: WinningResult = {
        isWin: playResult.won,
        multiplier: playResult.multiplier,
        winningPatterns: calculateWinnings(newSlotValues).winningPatterns,
        winAmount: playResult.won ? playResult.winAmount : 0,
        timestamp: Date.now(),
      };

      setIsSpinning(false);

      if (result.isWin) {
        const newBalance = getCurrentBalance() + result.winAmount;
        updateBalance(newBalance);
      }

      setWinResult(result);
    }, 3000);
  }, [
    isSpinning,
    spinCompleted,
    betAmount,
    getCurrentBalance,
    updateBalance,
    playReelsBegin,
    resetWinResult,
    slotMachine,
    calculateWinnings,
    gameMode,
  ]);

  const utiliseFreeSpinSlots = useCallback(async () => {
    if (!canUseFreeSpins || isSpinning || !spinCompleted) {
      console.log({
        canUseFreeSpins,
        isSpinning,
        spinCompleted,
      });
      return;
    }

    playReelsBegin();
    resetWinResult();
    setIsSpinning(true);
    setSpinCompleted(false);

    // TODO: Replace with actual free spin API call when available
    // For now, use realistic simulation
    try {
      const playResult = await slotMachine.play(freeSpinsRemaining, true);
      refreshFreeSpin();

      const newSlotValues = symbolsToNumbers([...playResult.symbols]);

      setTimeout(() => {
        setSlotValues(newSlotValues);
        const result: WinningResult = {
          isWin: playResult.won,
          multiplier: playResult.multiplier,
          winningPatterns: calculateWinnings(newSlotValues).winningPatterns,
          winAmount: playResult.won ? playResult.winAmount : 0,
          timestamp: Date.now(),
        };

        if (result.isWin) {
          // Free spins always add to real balance, not demo balance
          setUserBalance((prev) => prev + result.winAmount);
        }

        setWinResult(result);
      }, 3000);
    } catch (error) {
      console.error("Error using free spins:", error);
    } finally {
      setTimeout(() => {
        setIsSpinning(false);
      }, 1500);
    }
  }, [
    canUseFreeSpins,
    isSpinning,
    spinCompleted,
    playReelsBegin,
    resetWinResult,
    refreshFreeSpin,
    slotMachine,
    freeSpinsRemaining,
    calculateWinnings,
  ]);

  // Reset demo balance when switching to demo mode
  useEffect(() => {
    if (gameMode === "demo") {
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
    throw new Error("useSlotMachine must be used within a SlotMachineProvider");
  }
  return context;
};
