import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchWalletStats } from "../services/api";

export const useWalletStats = () => {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<{
    totalPoints: number;
    stakedNFTCount: number;
    totalNFTCount: number;
    frozenPercentage: number;
  }>({
    totalPoints: 0,
    stakedNFTCount: 0,
    totalNFTCount: 0,
    frozenPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const walletStats = await fetchWalletStats(publicKey.toString());
      setStats({
        totalPoints: walletStats.totalPoints,
        stakedNFTCount: walletStats.stakedNFTCount,
        totalNFTCount: walletStats.totalNFTCount,
        frozenPercentage: walletStats.frozenPercentage,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch wallet stats"
      );
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    // Initial load
    loadStats();

    // Set up interval for periodic updates
    const intervalId = setInterval(() => {
      loadStats();
    }, 30000); // 30 seconds in milliseconds

    // Cleanup interval on component unmount or when publicKey changes
    return () => {
      clearInterval(intervalId);
    };
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats,
  };
};
