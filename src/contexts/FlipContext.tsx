import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import useSound from "use-sound";
import { useGame } from "@/hooks/bet/useGame";
import { CoinFlipResultDtoChoice } from "@/api";
import { useCoinFlip } from "@/hooks/bet/useCoinFlip";

export enum FlipGameState {
  IDLE = "IDLE",
  FLIPPING = "FLIPPING",
  RESULT = "RESULT",
}

export interface FlipResult {
  result: CoinFlipResultDtoChoice;
  isWin: boolean;
  winAmount: number;
  timestamp: number;
}

interface FlipContextType {
  gameState: FlipGameState;
  betAmount: number;
  selectedSide: CoinFlipResultDtoChoice | null;
  flipResult: FlipResult | null;
  userBalance: number;
  isAnimating: boolean;

  setBetAmount: (amount: number) => void;
  setSelectedSide: (side: CoinFlipResultDtoChoice) => void;
  startFlip: () => void;
  resetGame: () => void;
  setIsAnimating: (isAnimating: boolean) => void;

  canStartFlip: boolean;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export const FlipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState(FlipGameState.IDLE);
  const [betAmount, setBetAmount] = useState(0.1);
  const [selectedSide, setSelectedSide] =
    useState<CoinFlipResultDtoChoice | null>(null);
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [playCoinFlip] = useSound("/sounds/coin-flip.mp3");
  const [playWin] = useSound("/sounds/winner.mp3");
  const [playLose] = useSound("/sounds/lose.mp3");

  const { solBalance } = useGame();
  const coinFlip = useCoinFlip();

  const canStartFlip =
    gameState === FlipGameState.IDLE &&
    selectedSide !== null &&
    betAmount > 0 &&
    betAmount <= userBalance &&
    !isAnimating;

  useEffect(() => {
    if (solBalance) {
      setUserBalance(parseFloat(solBalance.availableBalance));
    }
  }, [solBalance]);

  const performFlip = useCallback(async () => {
    if (selectedSide === null) throw new Error("You must select a side");

    try {
      const flipApiResult = await coinFlip.play(betAmount, selectedSide);

      const winAmount = flipApiResult.won ? betAmount * 2 : 0;

      const newResult: FlipResult = {
        result: flipApiResult.result,
        isWin: flipApiResult.won,
        winAmount,
        timestamp: Date.now(),
      };

      setFlipResult(newResult);

      // Auto-add winnings to balance if won
      if (flipApiResult.won) {
        setTimeout(() => {
          playWin();
        }, 500);
      } else {
        setTimeout(() => {
          playLose();
        }, 500);
      }

      setGameState(FlipGameState.RESULT);

      // Auto-reset after showing result if lost
      if (!flipApiResult.won) {
        setTimeout(() => {
          resetGame();
        }, 5000);
      }
    } catch (error) {
      console.error("Error during flip:", error);
      resetGame();
    }
  }, [selectedSide, coinFlip, betAmount, playWin, playLose]);

  const startFlip = useCallback(() => {
    if (!canStartFlip) return;

    // Deduct bet amount immediately
    setUserBalance((prev) => prev - betAmount);

    // Go directly to flipping state
    setGameState(FlipGameState.FLIPPING);
    setIsAnimating(true);
    playCoinFlip();

    // Start flip animation and wait for completion
    setTimeout(() => {
      performFlip();
      setIsAnimating(false);
    }, 3000); // 3 seconds for coin flip animation
  }, [canStartFlip, betAmount, playCoinFlip, performFlip]);

  const resetGame = useCallback(() => {
    setGameState(FlipGameState.IDLE);
    setFlipResult(null);
    setIsAnimating(false);
    // Keep selectedSide and betAmount for user convenience
  }, []);

  const value = {
    gameState,
    betAmount,
    selectedSide,
    flipResult,
    userBalance,
    isAnimating,
    setBetAmount,
    setSelectedSide,
    startFlip,
    resetGame,
    setIsAnimating,
    canStartFlip,
  };

  return <FlipContext.Provider value={value}>{children}</FlipContext.Provider>;
};

export const useFlipMachine = () => {
  const context = useContext(FlipContext);
  if (context === undefined) {
    throw new Error("useFlipMachine must be used within a FlipProvider");
  }
  return context;
};
