"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { getRaffleData } from "@/utils/raffleService";
import { Spinner } from "@/components/Spinner";

interface TicketData {
  totalTickets: number;
  userTickets: number;
}

export default function MagicEdenTicketHeader() {
  const { connected, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData>({
    totalTickets: 0,
    userTickets: 0,
  });

  useEffect(() => {
    async function fetchTicketData() {
      if (connected && publicKey) {
        setIsLoading(true);
        try {
          const data = await getRaffleData(publicKey.toString());
          setTicketData({
            totalTickets: data.systemTotalTicketCount,
            userTickets: data.userTotalTicketCount,
          });
        } catch (error) {
          console.error("Error fetching ticket data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchTicketData();
  }, [connected, publicKey]);

  return (
    <div className="flex flex-col font-sans w-full gap-6">
      <div className="flex justify-center items-center w-4/5 md:w-2/5 gap-6 bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md mx-auto rounded-xl mt-20 md:mt-0">
        <p className="text-2xl md:text-4xl font-black text-center text-white p-1 mt-2">
          TICKET CHECKER
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-4">
        <div className="flex flex-row gap-4 bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md p-2 rounded-xl">
          <p className="text-base md:text-lg font-black text-center text-white px-2">
            Total Tickets:
          </p>
          {isLoading ? (
            <div className="flex items-center px-2">
              <Spinner />
            </div>
          ) : (
            <p className="text-base md:text-lg font-black text-center text-white px-2">
              {ticketData.totalTickets}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-4 bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md p-2 rounded-xl">
          <p className="text-base md:text-lg font-black text-center text-white px-2">
            Your Tickets:
          </p>
          {isLoading ? (
            <div className="flex items-center px-2">
              <Spinner />
            </div>
          ) : (
            <p className="text-base md:text-lg font-black text-center text-white px-2">
              {ticketData.userTickets}
            </p>
          )}
        </div>
        <div className="wallet-adapter-button-wrapper">
          <WalletMultiButton
            className="!h-9 wallet-adapter-button custom-wallet-button transition-all duration-200 hover:border-slate-900"
            style={{
              background: "rgba(24, 24, 24, 0.64)",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: "900",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              backdropFilter: "blur(4px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
