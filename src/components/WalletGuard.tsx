"use client";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { Wallet, AlertCircle } from "lucide-react";
import { SignInModal } from "./auth/SignInModal";
import { useGameAuthentication } from "@/hooks/bet/useGameAuthentication";

interface WalletGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const WalletGuard: React.FC<WalletGuardProps> = ({ children, fallback }) => {
  const { connected } = useWallet();
  const { isAuthed, authenticate } = useGameAuthentication();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (connected && !isAuthed && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [connected, isAuthed, isModalOpen]);

  if (isAuthed && connected) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div className="w-full h-full flex items-center justify-center p-8">
        <motion.div
          className="max-w-md w-full bg-[#181818]/80 border border-white/20 rounded-xl p-8 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#6C924A] to-[#a0c380] rounded-full flex items-center justify-center">
              <Wallet size={32} className="text-white" />
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Wallet Required
          </motion.h2>

          <motion.p
            className="text-white/70 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You need to connect your Solana wallet to access the gaming
            features.
          </motion.p>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {
              <button
                onClick={() => {
                  !connected ? setIsModalOpen(true) : authenticate();
                }}
                className="w-full bg-[#6C924A] hover:bg-[#5A7B3E] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Wallet size={20} />
                {!connected ? "Connect Wallet" : "Sign Message"}
              </button>
            }

            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle size={16} />
              <span>Secure connection required to play</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WalletGuard;
