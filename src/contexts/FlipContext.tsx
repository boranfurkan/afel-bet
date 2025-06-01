import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import useSound from 'use-sound';
import { useGame } from '@/hooks/bet/useGame';
import { CoinFlipResultDtoChoice } from '@/api';
import { useCoinFlip } from '@/hooks/bet/useCoinFlip';

export enum FlipGameState {
  IDLE = 'IDLE',
  FLIPPING = 'FLIPPING',
  RESULT = 'RESULT',
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
  // Game state management
  const [gameState, setGameState] = useState(FlipGameState.IDLE);
  const [betAmount, setBetAmount] = useState(0.1);
  const [selectedSide, setSelectedSide] =
    useState<CoinFlipResultDtoChoice | null>(null);
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sound effects
  const [playCoinFlip] = useSound('/sounds/coin-flip.mp3');
  const [playWin] = useSound('/sounds/winner.mp3');
  const [playLose] = useSound('/sounds/lose.mp3');

  // API hooks
  const { solBalance } = useGame();
  const coinFlip = useCoinFlip();

  // Refs to prevent race conditions
  const animationInProgressRef = useRef(false);
  const pendingResultRef = useRef<FlipResult | null>(null);

  // Determine if player can start a flip
  const canStartFlip =
    gameState === FlipGameState.IDLE &&
    selectedSide !== null &&
    betAmount > 0 &&
    betAmount <= userBalance &&
    !isAnimating;

  // Update balance from API
  useEffect(() => {
    if (solBalance) {
      setUserBalance(parseFloat(solBalance.availableBalance));
    }
  }, [solBalance]);

  // Handle coin flip API call
  const performFlip = useCallback(async () => {
    if (selectedSide === null) throw new Error('You must select a side');

    try {
      // Mark animation as in progress to prevent state conflicts
      animationInProgressRef.current = true;

      const flipApiResult = await coinFlip.play(betAmount, selectedSide);
      const winAmount = flipApiResult.won ? betAmount * 2 : 0;

      // Store the result in ref first to prevent race conditions
      pendingResultRef.current = {
        result: flipApiResult.result,
        isWin: flipApiResult.won,
        winAmount,
        timestamp: Date.now(),
      };

      // Don't update the state yet - wait for animation to complete
      // This happens in the effect below when isAnimating changes to false
    } catch (error) {
      console.error('Error during flip:', error);
      // Immediately reset on error
      animationInProgressRef.current = false;
      setGameState(FlipGameState.IDLE);
    }
  }, [selectedSide, coinFlip, betAmount]);

  // Monitor animation state and apply result when animation completes
  useEffect(() => {
    // When animation ends AND we have a pending result to show
    if (
      !isAnimating &&
      animationInProgressRef.current &&
      pendingResultRef.current
    ) {
      // Apply the result
      setFlipResult(pendingResultRef.current);

      // Play appropriate sound
      if (pendingResultRef.current.isWin) {
        playWin();
      } else {
        playLose();
      }

      // Transition to result state
      setGameState(FlipGameState.RESULT);

      // Reset flags
      animationInProgressRef.current = false;
      pendingResultRef.current = null;
    }
  }, [isAnimating, playWin, playLose]);

  // Begin the flip process
  const startFlip = useCallback(() => {
    if (!canStartFlip) return;

    // Deduct bet amount immediately
    setUserBalance((prev) => prev - betAmount);

    // Go directly to flipping state
    setGameState(FlipGameState.FLIPPING);

    // Play sound
    playCoinFlip();

    // Start flip API call
    performFlip();

    // Animation state is managed by the CoinFlipAnimation component
    // using the setIsAnimating function
  }, [canStartFlip, betAmount, playCoinFlip, performFlip]);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    setGameState(FlipGameState.IDLE);
    setFlipResult(null);
    setIsAnimating(false);
    // Keep selectedSide and betAmount for user convenience

    // Also reset any pending animations or results
    animationInProgressRef.current = false;
    pendingResultRef.current = null;
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
    throw new Error('useFlipMachine must be used within a FlipProvider');
  }
  return context;
};
