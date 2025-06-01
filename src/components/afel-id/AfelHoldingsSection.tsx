"use client";

import { useEffect, useState } from "react";
import { getWallets, getHoldings } from "@/utils/holdingsService";
import { Spinner } from "../Spinner";
import Link from "next/link";

interface AfelHoldingsSectionProps {
  jwt: string;
}

export default function AfelHoldingsSection({ jwt }: AfelHoldingsSectionProps) {
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHoldings() {
      try {
        setIsLoading(true);
        setError(null);

        // First get all wallets
        const wallets = await getWallets(jwt);
        const walletAddresses = wallets.map((wallet) => wallet.walletAddress);

        if (walletAddresses.length === 0) {
          setTotalBalance("0");
          return;
        }

        // Then get holdings for these wallets
        const holdings = await getHoldings(walletAddresses, jwt);
        setTotalBalance(holdings.totalUiBalance);
      } catch (err) {
        console.error("Error fetching holdings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch holdings"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchHoldings();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchHoldings, 30000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, [jwt]);

  return (
    <div className="bg-[#1C1C1C] rounded-[24px] border border-white/10 h-full flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center my-8">
        <div className="flex flex-col gap-8 items-center">
          <div className="flex justify-center items-center gap-4">
            <div className="text-6xl font-mono text-white w-10 ">
              {isLoading ? (
                <Spinner className="border-t-white" />
              ) : (
                totalBalance.split(".")[0]
              )}
            </div>
            <div className="text-6xl font-mono text-white">$WAA</div>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full h-[2px] bg-white/10" />
        <div className="flex items-center justify-between p-4 px-6">
          <div className="flex items-center gap-2">
            <div className="text-[#EBEBE6]">BALANCE:</div>
            <span className="text-[#EBEBE6] font-200 w-3 ">
              {isLoading ? (
                <Spinner className="border-t-white w-3 h-3" />
              ) : (
                totalBalance.split(".")[0]
              )}
            </span>
            <span className="text-white w-5">$WAA</span>
          </div>
          <Link
            href={"https://magiceden.io/marketplace/afel"}
            target={"_blank"}
            className="w-[110px] text-[16px] text-white text-center p-2 border border-white rounded-full hover:bg-black/90"
          >
            BUY MORE
          </Link>
        </div>
      </div>
    </div>
  );
}
