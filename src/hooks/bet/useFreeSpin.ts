import { useCallback, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGameAuthentication } from "./useGameAuthentication";
import { getQueryOptions, useGame } from "./useGame";
import {
  useFreeSpinControllerGetFreeSpinAmount,
  useFreeSpinControllerGetFreeSpinHistory,
  useFreeSpinControllerGetFreeSpinStatus,
} from "@/api";

export const useFreeSpin = () => {
  const { publicKey: connectedPublicKey } = useWallet();
  const { isAuthed } = useGameAuthentication();

  // Fetch freespin data
  const {
    data: freeSpinStatus,
    isLoading: isFreeSpinStatusLoading,
    refetch: refreshFreeSpinStatus,
    error: freeSpinStatusError,
  } = useFreeSpinControllerGetFreeSpinStatus(
    getQueryOptions(connectedPublicKey?.toString(), isAuthed, "freespin-stats")
  );

  const {
    data: freeSpinHistory,
    isLoading: isFreeSpinHistoryLoading,
    refetch: refreshFreeSpinHistory,
    error: freeSpinHistoryError,
  } = useFreeSpinControllerGetFreeSpinHistory(
    {
      page: 1,
      limit: 10,
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      isAuthed,
      "freespin-history"
    )
  );

  const {
    data: freeSpinAmount,
    isLoading: isFreeSpinAmountLoading,
    refetch: refreshFreeSpinAmount,
    error: freeSpinAmountError,
  } = useFreeSpinControllerGetFreeSpinAmount(
    getQueryOptions(connectedPublicKey?.toString(), isAuthed, "freespin-amount")
  );

  const refreshFreeSpin = useCallback(() => {
    refreshFreeSpinStatus();
    refreshFreeSpinHistory();
    refreshFreeSpinAmount();
  }, [refreshFreeSpinStatus, refreshFreeSpinHistory, refreshFreeSpinAmount]);

  return useMemo(
    () => ({
      amount: freeSpinAmount?.amount || 0,
      status: freeSpinStatus,
      history: freeSpinHistory,
      refreshFreeSpin,
      isLoading:
        isFreeSpinStatusLoading ||
        isFreeSpinHistoryLoading ||
        isFreeSpinAmountLoading,
      statusError: freeSpinStatusError,
      historyError: freeSpinHistoryError,
      amountError: freeSpinAmountError,
    }),
    [
      freeSpinAmount?.amount,
      freeSpinAmountError,
      freeSpinHistory,
      freeSpinHistoryError,
      freeSpinStatus,
      freeSpinStatusError,
      isFreeSpinAmountLoading,
      isFreeSpinHistoryLoading,
      isFreeSpinStatusLoading,
      refreshFreeSpin,
    ]
  );
};
