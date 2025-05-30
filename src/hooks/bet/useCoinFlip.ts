import { useCallback, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  coinFlipControllerPlay,
  CoinFlipResultDtoChoice,
  useCoinFlipControllerGetHistory,
  useCoinFlipControllerGetStats,
} from "@/api";
import { getReferenceId } from "@/lib/utils";
import { useGameAuthentication } from "./useGameAuthentication";
import { DEFAULT_TOKEN_TYPE, getQueryOptions, useGame } from "./useGame";

export const useCoinFlip = () => {
  const { publicKey: connectedPublicKey } = useWallet();
  const { isAuthed } = useGameAuthentication();
  const { checkBalance, refreshBalance, checkAuthenticated } = useGame();

  // Fetch coinflip data
  const {
    data: coinFlipStats,
    isLoading: isCoinFlipStatsLoading,
    refetch: refreshCoinFlipStats,
    error: coinFlipStatsError,
  } = useCoinFlipControllerGetStats(
    {
      tokenType: DEFAULT_TOKEN_TYPE,
    },
    getQueryOptions(connectedPublicKey?.toString(), isAuthed, "coinflip-stats")
  );

  const {
    data: coinFlipHistory,
    isLoading: isCoinFlipHistoryLoading,
    refetch: refreshCoinFlipHistory,
    error: coinFlipHistoryError,
  } = useCoinFlipControllerGetHistory(
    {
      page: 1,
      limit: 10,
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      isAuthed,
      "coinflip-history"
    )
  );

  // Play coin flip
  const playCoinFlip = useCallback(
    async (
      amount: number,
      choice: CoinFlipResultDtoChoice,
      isDemo: boolean = false
    ) => {
      checkAuthenticated();
      if (!isDemo) checkBalance(amount);

      const referenceId = getReferenceId();

      try {
        const coinFlipResult = await coinFlipControllerPlay({
          betAmount: amount,
          tokenType: "SOL",
          referenceId,
          choice,
          demoMode: isDemo,
        });

        // Refetch balance, stats, and history
        refreshBalance();
        refreshCoinFlipStats();
        refreshCoinFlipHistory();

        return coinFlipResult;
      } catch (error) {
        throw new Error(
          `Coin flip play failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [
      checkAuthenticated,
      checkBalance,
      refreshBalance,
      refreshCoinFlipStats,
      refreshCoinFlipHistory,
    ]
  );

  return useMemo(
    () => ({
      play: playCoinFlip,
      stats: coinFlipStats,
      history: coinFlipHistory,
      isLoading: isCoinFlipStatsLoading || isCoinFlipHistoryLoading,
      statsError: coinFlipStatsError,
      historyError: coinFlipHistoryError,
    }),
    [
      coinFlipHistory,
      coinFlipHistoryError,
      coinFlipStats,
      coinFlipStatsError,
      isCoinFlipHistoryLoading,
      isCoinFlipStatsLoading,
      playCoinFlip,
    ]
  );
};
