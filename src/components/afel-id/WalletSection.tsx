"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect, useCallback } from "react";
import {
  getWalletMessage,
  connectWallet,
  revokeWallet,
  getConnectedWallets,
  type ConnectedWallet,
} from "@/utils/walletService";

interface WalletSectionProps {
  jwt: string;
}

export default function WalletSection({ jwt }: WalletSectionProps) {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>(
    [],
  );
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [isRevokingWallet, setIsRevokingWallet] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const fetchConnectedWallets = useCallback(async () => {
    try {
      setIsFetching(true);
      setError(null);
      const wallets = await getConnectedWallets(jwt);
      setConnectedWallets(wallets);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setError("Failed to fetch connected wallets");
    } finally {
      setIsFetching(false);
    }
  }, [jwt]);

  const handleAddWallet = async () => {
    if (!publicKey || !signMessage) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setIsAddingWallet(true);
      setError(null);

      const message = await getWalletMessage(jwt);
      const encodedMessage = new TextEncoder().encode(message);
      const signatureArray = await signMessage(encodedMessage);
      const base64Signature = Buffer.from(signatureArray).toString("base64");

      await connectWallet(jwt, {
        walletAddress: publicKey.toBase58(),
        encryptedMessage: message,
        signedMessage: base64Signature,
        walletType: "DEFAULT",
      });

      await fetchConnectedWallets();

      // Disconnect the wallet after successful addition
      disconnect();
    } catch (err) {
      console.error("Error adding wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to add wallet");
    } finally {
      setIsAddingWallet(false);
    }
  };

  const handleRevokeWallet = async (walletAddress: string) => {
    try {
      setIsRevokingWallet(true);
      setError(null);

      await revokeWallet(jwt, walletAddress);
      await fetchConnectedWallets();
    } catch (err) {
      console.error("Error revoking wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to revoke wallet");
    } finally {
      setIsRevokingWallet(false);
    }
  };

  // Effect to handle automatic wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      const isWalletAlreadyConnected = connectedWallets.some(
        (wallet) => wallet.walletAddress === publicKey.toBase58(),
      );

      if (!isWalletAlreadyConnected && !isAddingWallet) {
        handleAddWallet();
      }
    }
  }, [connected, publicKey, connectedWallets, isAddingWallet]);

  // Initial fetch of connected wallets
  useEffect(() => {
    fetchConnectedWallets();
  }, [fetchConnectedWallets]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center w-3/4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center w-3/4 relative gap-[15px] overflow-y-auto pb-2 max-h-60">
      <p className="self-stretch w-full text-xl md:text-3xl font-black text-center text-white">
        CONNECTED WALLETS
      </p>
      <div className="flex items-center gap-2 w-full">
        {" "}
        {/* Modified this div */}
        <span className="text-sm md:text-base font-medium text-white whitespace-nowrap">
          add wallet:
        </span>
        <WalletMultiButton
          style={{
            height: "50px",
            borderRadius: "10px",
            backgroundColor: "#75308e",
            transition: "background-color 0.2s",
          }}
        />
      </div>
      <div className="flex flex-col justify-start items-start self-stretch gap-2.5">
        {connectedWallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex flex-col justify-center items-start self-stretch h-[50px] gap-2.5 rounded-[10px] bg-[#3c454e]"
          >
            <div className="flex justify-between items-center self-stretch h-9 relative overflow-hidden px-5 py-[3px] rounded-[20px]">
              <p className="text-sm md:text-base font-medium text-center text-white">
                {wallet.walletAddress.slice(0, 6)}...
                {wallet.walletAddress.slice(-4)}
              </p>
              <button
                onClick={() => handleRevokeWallet(wallet.walletAddress)}
                disabled={isRevokingWallet}
                className="flex justify-center items-center w-20 relative overflow-hidden gap-2.5 px-2 py-0.5 rounded-[5px] border border-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="flex-grow w-16 text-sm md:text-base text-center text-white">
                  {isRevokingWallet ? "..." : "revoke"}
                </p>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
}
