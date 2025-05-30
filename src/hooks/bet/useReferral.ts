import {
  referralControllerUseReferralCode,
  useReferralControllerGetReferralCode,
  useReferralControllerGetReferralHistory,
  useReferralControllerGetReferralStats,
  useReferralControllerUseReferralCode,
} from "@/api";
import { useGameAuthentication } from "./useGameAuthentication";
import { getQueryOptions } from "./useGame";
import { useCallback } from "react";

export const useReferral = () => {
  const { walletAddress, isAuthed } = useGameAuthentication();

  const { data: referralCode, isLoading: isReferralCodeLoading } =
    useReferralControllerGetReferralCode(
      getQueryOptions(walletAddress || "", isAuthed, "referralCode")
    );

  const {
    data: referralStats,
    isLoading: isReferralStatsLoading,
    refetch: refreshReferralStats,
  } = useReferralControllerGetReferralStats(
    getQueryOptions(walletAddress || "", isAuthed, "referralStats")
  );

  const {
    data: referralHistory,
    isLoading: isReferralHistoryLoading,
    refetch: refreshReferralHistory,
  } = useReferralControllerGetReferralHistory(
    {
      page: 1,
      limit: 10,
    },
    getQueryOptions(walletAddress || "", isAuthed, "referralHistory")
  );

  const applyReferralCode = useCallback(
    async (referralCode: string) => {
      if (!isAuthed) {
        throw new Error("User is not authenticated");
      }

      const referralApplicationResult = await referralControllerUseReferralCode(
        {
          referralCode,
        }
      );

      return referralApplicationResult;
    },
    [isAuthed]
  );

  return {
    referralCode,
    isLoading: isReferralCodeLoading,
    referralStats,
    isReferralStatsLoading,
    refreshReferralStats,
    referralHistory,
    isReferralHistoryLoading,
    refreshReferralHistory,
    applyReferralCode,
  };
};
