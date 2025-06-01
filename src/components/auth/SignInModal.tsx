import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { FC } from 'react';
import waaLogo from '/public/images/waaLogo.png';
import { WalletMultiButtonDynamic } from '../WalletMultiButtonDynamic';
import { toast } from 'react-hot-toast';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { publicKey, disconnect } = useWallet();

  const handleCopyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString());
        toast.success('Address copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy address');
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
          CONNECT YOUR WALLET
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
                justifyContent: 'center',
                border: 'none',
              }}
            />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white/70 text-sm">
          <p>Connect your Solana wallet to start playing</p>
        </div>

        {/* Close button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
