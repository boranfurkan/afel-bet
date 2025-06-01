import { useCallback, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  slotMachineControllerPlay,
  useSlotMachineControllerGetHistory,
  useSlotMachineControllerGetStats,
} from "@/api";
import { getReferenceId } from "@/lib/utils";
import { useGameAuthentication } from "./useGameAuthentication";
import { DEFAULT_TOKEN_TYPE, getQueryOptions, useGame } from "./useGame";

export const useSlotMachine = () => {
  const { publicKey: connectedPublicKey } = useWallet();
  const { isAuthed } = useGameAuthentication();
  const { checkBalance, refreshBalance, checkAuthenticated } = useGame();

  // Fetch slot machine data
  const {
    data: slotMachineStats,
    isLoading: isSlotMachineStatsLoading,
    refetch: refreshSlotMachineStats,
    error: slotMachineStatsError,
  } = useSlotMachineControllerGetStats(
    {
      tokenType: DEFAULT_TOKEN_TYPE,
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      isAuthed,
      "slotmachine-stats"
    )
  );

  const {
    data: slotMachineHistory,
    isLoading: isSlotMachineHistoryLoading,
    refetch: refreshSlotMachineHistory,
    error: slotMachineHistoryError,
  } = useSlotMachineControllerGetHistory(
    {
      page: 1,
      limit: 10,
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      isAuthed,
      "slotmachine-history"
    )
  );

  const playSlotMachine = useCallback(
    async (
      amount: number,
      useFreeSpins: boolean = false,
      isDemo: boolean = false
    ) => {
      checkAuthenticated();
      if (!isDemo && !useFreeSpins) checkBalance(amount);

      const referenceId = getReferenceId();

      try {
        const slotMachineResult = await slotMachineControllerPlay({
          betAmount: amount,
          tokenType: "SOL",
          referenceId,
          useFreeSpins,
          demoMode: isDemo,
        });

        // Delay balance refresh to sync with animation timing
        // This prevents spoiler effect from backend balance updates
        setTimeout(() => {
          refreshBalance();
          refreshSlotMachineStats();
          refreshSlotMachineHistory();
        }, isDemo ? 0 : 6000); // Demo: immediate, Normal: after animation

        return slotMachineResult;
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
      refreshSlotMachineStats,
      refreshSlotMachineHistory,
    ]
  );

  return useMemo(
    () => ({
      play: playSlotMachine,
      stats: slotMachineStats,
      history: slotMachineHistory,
      isLoading: isSlotMachineStatsLoading || isSlotMachineHistoryLoading,
      statsError: slotMachineStatsError,
      historyError: slotMachineHistoryError,
    }),
    [
      slotMachineHistory,
      slotMachineHistoryError,
      slotMachineStats,
      slotMachineStatsError,
      isSlotMachineHistoryLoading,
      isSlotMachineStatsLoading,
      playSlotMachine,
    ]
  );
};
