import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import useSound from "use-sound";
import { useGame } from "@/hooks/bet/useGame";
import { PlayCoinFlipDtoChoice } from "@/api";

export enum FlipGameState {
  IDLE = "IDLE",
  WAITING_FOR_DEPOSIT = "WAITING_FOR_DEPOSIT",
  FLIPPING = "FLIPPING",
  RESULT = "RESULT",
}

export interface FlipResult {
  result: PlayCoinFlipDtoChoice;
  isWin: boolean;
  winAmount: number;
  timestamp: number;
}

interface FlipContextType {
  gameState: FlipGameState;
  betAmount: number;
  selectedSide: PlayCoinFlipDtoChoice | null;
  flipResult: FlipResult | null;
  userBalance: number;
  isAnimating: boolean;

  setBetAmount: (amount: number) => void;
  setSelectedSide: (side: PlayCoinFlipDtoChoice) => void;
  startFlip: () => void;
  resetGame: () => void;
  claimReward: () => void;
  setIsAnimating: (isAnimating: boolean) => void;

  canStartFlip: boolean;
  canClaimReward: boolean;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export const FlipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState(FlipGameState.IDLE);
  const [betAmount, setBetAmount] = useState(0.1);
  const [selectedSide, setSelectedSide] =
    useState<PlayCoinFlipDtoChoice | null>(null);
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [playCoinFlip] = useSound("/sounds/coin-flip.mp3");
  const [playWin] = useSound("/sounds/winner.mp3");
  const [playLose] = useSound("/sounds/lose.mp3");

  const { coinFlip, solBalance } = useGame("coinflip");

  const canStartFlip =
    gameState === FlipGameState.IDLE &&
    selectedSide !== null &&
    betAmount > 0 &&
    betAmount <= userBalance &&
    !isAnimating;

  const canClaimReward =
    gameState === FlipGameState.RESULT &&
    flipResult !== null &&
    flipResult.isWin === true &&
    !isAnimating;

  useEffect(() => {
    if (solBalance) {
      setUserBalance(parseFloat(solBalance.availableBalance));
    }
  }, [solBalance]);

  const performFlip = useCallback(async () => {
    if (selectedSide === null) throw new Error("You must select a side");

    const flipApiResult = await coinFlip.play(betAmount, selectedSide);
    const winAmount = flipApiResult.won ? betAmount * 2 : 0;

    const newResult: FlipResult = {
      result: flipApiResult.result,
      isWin: flipApiResult.won,
      winAmount,
      timestamp: Date.now(),
    };

    setFlipResult(newResult);

    setTimeout(() => {
      if (flipApiResult.won) {
        playWin();
      } else {
        playLose();
      }
    }, 500);

    setGameState(FlipGameState.RESULT);
  }, [selectedSide, coinFlip, betAmount, playWin, playLose]);

  const startFlip = useCallback(() => {
    if (!canStartFlip) return;

    // Deduct bet amount immediately
    setUserBalance((prev) => prev - betAmount);
    setGameState(FlipGameState.WAITING_FOR_DEPOSIT);

    // Wait for deposit simulation
    setTimeout(() => {
      setGameState(FlipGameState.FLIPPING);
      setIsAnimating(true);
      playCoinFlip();

      // Start flip animation and wait for completion
      setTimeout(() => {
        performFlip();
        setIsAnimating(false);
      }, 4000); // 4 seconds for coin flip animation
    }, 2500); // 2.5 seconds waiting for deposit
  }, [canStartFlip, betAmount, playCoinFlip, performFlip]);

  const claimReward = useCallback(() => {
    if (!canClaimReward) return;

    // Add winnings to balance (this was already added in performFlip, but we'll show animation)
    setIsAnimating(true);

    setTimeout(() => {
      resetGame();
      setIsAnimating(false);
    }, 1500); // Animation duration for claiming
  }, [canClaimReward]);

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
    claimReward,
    setIsAnimating,
    canStartFlip,
    canClaimReward,
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
