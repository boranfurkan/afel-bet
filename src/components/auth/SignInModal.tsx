import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { FC, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DiscordLogo, TelegramLogo, XLogo } from "@phosphor-icons/react";
import waaLogo from "/public/images/waaLogo.png";
import { WalletMultiButtonDynamic } from "../WalletMultiButtonDynamic";
import { toast } from "react-hot-toast";
import {
  getOAuthSession,
  initiateDiscordAuth,
  initiateMatricaAuth,
  initiateXAuth,
} from "@/utils/authService";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { publicKey, disconnect } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingX, setIsLoadingX] = useState(false);
  const [isLoadingMatrica, setIsLoadingMatrica] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const handleDiscordAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get OAuth session
      const sessionData = await getOAuthSession();

      if (!sessionData.sessionId) {
        throw new Error("No session ID received");
      }

      // Redirect to Discord OAuth
      initiateDiscordAuth(sessionData.sessionId);
    } catch (error) {
      console.error("Authentication error:", error);
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
      setIsLoading(false);
    }
  };

  const handleMatricaAuth = async () => {
    try {
      setIsLoadingMatrica(true);
      setError(null);

      // Get OAuth session
      const sessionData = await getOAuthSession();

      if (!sessionData.sessionId) {
        throw new Error("No session ID received");
      }

      // Redirect to Discord OAuth
      initiateMatricaAuth(sessionData.sessionId);
    } catch (error) {
      console.error("Authentication error:", error);
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
      setIsLoadingMatrica(false);
    }
  };

  const handleXAuth = async () => {
    try {
      setIsLoadingX(true);
      setError(null);

      // Get OAuth session
      const sessionData = await getOAuthSession();

      if (!sessionData.sessionId) {
        throw new Error("No session ID received");
      }

      // Redirect to Discord OAuth
      initiateXAuth(sessionData.sessionId);
    } catch (error) {
      console.error("Authentication error:", error);
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
      setIsLoadingX(false);
    }
  };

  const handleCopyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString());
        toast.success("Address copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy address");
      }
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#1C1C1C] rounded-[24px] p-8 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={waaLogo} alt="WAA Logo" width={50} />
        </div>

        {/* Title */}
        <h2 className="text-white text-center text-xl mb-6">
          SIGN IN WITH [ID]
        </h2>

        {/* Wallet Connection */}
        <div className="rounded-lg py-4">
          {publicKey ? (
            <div className="flex items-center justify-between ">
              <div className="border border-[#989898] text-center w-full mr-2 p-2 rounded-[8px]">
                <span
                  onClick={handleCopyAddress}
                  className="text-sm hover:text-md text-white cursor-pointer transition-colors"
                >
                  {publicKey.toString().slice(0, 6)}...
                  {publicKey.toString().slice(-4)}
                </span>
              </div>
              <div>
                <button
                  onClick={() => disconnect()}
                  className="hover:opacity-70 text-white border border-[#EBEBE6] p-2 rounded-full text-sm"
                >
                  DISCONNECT
                </button>
              </div>
            </div>
          ) : (
            <WalletMultiButtonDynamic
              className="w-full !bg-[#6C924A] hover:!bg-[#5A7B3E] !text-white !py-3 !rounded-full !transition-colors"
              style={{
                justifyContent: "center",
                border: "none",
              }}
            />
          )}
        </div>

        {/* Connect Options */}
        <div className="space-y-4">
          <div className="text-center text-white/60 !my-6">or</div>
          <button
            onClick={handleXAuth}
            className="w-full bg-black hover:bg-black/50 text-white py-3 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {isLoadingX ? (
              "Loading..."
            ) : (
              <>
                CONTINUE WITH
                <XLogo size={20} weight="fill" />
              </>
            )}
          </button>
          <button
            onClick={handleDiscordAuth}
            className="w-full bg-[#885EFA] hover:bg-[#7140FA] text-white py-3  rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                CONTINUE WITH
                <DiscordLogo size={20} weight="fill" />
              </>
            )}
          </button>
          <button
            onClick={handleMatricaAuth}
            className="w-full bg-[#3D474A] hover:bg-[#2D3739] text-white py-3 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {isLoadingMatrica ? "Loading..." : <>CONTINUE WITH MATRICA </>}
          </button>
        </div>

        {/* First time text */}
      </div>
    </div>
  );
};
