import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Lock, GamepadIcon } from 'lucide-react';
import { SignInModal } from '@/components/auth/SignInModal';

// Fallback for Slot Machine
export const SlotMachineFallback: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {/* Mock header */}
        <div className="slot-gradient-to-right px-5 py-4 w-full flex items-center justify-center gap-4 relative overflow-hidden opacity-50">
          <div className="bg-[#171717]/30 backdrop-blur-sm rounded-[8px] w-1/4 min-h-[100px] flex items-center justify-center">
            <Lock size={32} className="text-white/50" />
          </div>
          <div className="w-3/4 flex items-center justify-center gap-16">
            <div className="text-white/50 text-2xl">SLOT FRENZY</div>
          </div>
        </div>

        {/* Main game area with overlay */}
        <div className="flex-1 flex relative">
          {/* Mock game area */}
          <div className="flex-1 relative overflow-hidden border-l-2 border-[#8db170]/30">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Mock slot machine */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-black/30 rounded-lg w-full max-w-md h-96 flex items-center justify-center border-2 border-[#6c924a]/30">
                <div className="grid grid-cols-3 gap-2 h-full w-full p-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded border border-[#6c924a]/20 flex items-center justify-center"
                    >
                      <GamepadIcon size={24} className="text-white/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connect wallet overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="bg-[#181818]/90 border border-white/20 rounded-xl p-8 text-center max-w-sm mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#6C924A] to-[#a0c380] rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Wallet size={32} className="text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Connect to Play
                </h3>
                <p className="text-white/70 mb-4 text-sm">
                  Connect your Solana wallet to start spinning!
                </p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#6C924A] hover:bg-[#5A7B3E] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Connect Wallet
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mock control panel */}
          <div className="w-[280px] bg-[#22560F]/50 p-3 border-l border-white/10">
            <div className="slot-gradient-to-bottom border-2 border-black/30 rounded-lg h-full flex flex-col p-3 gap-2 opacity-50">
              <div className="bg-[#171717]/30 rounded-md p-2 text-white/50">
                <div className="text-xs mb-1">CREDIT</div>
                <div className="text-xl">---.--</div>
              </div>
              <div className="bg-[#D2D2D2]/20 h-px"></div>
              <div className="grid grid-cols-2 gap-2">
                {[0.05, 0.1, 0.25, 0.5, 1, 2].map((amount) => (
                  <div
                    key={amount}
                    className="bg-[#a0c380]/20 border border-black/20 rounded px-3 py-2 text-center text-black/50 text-sm"
                  >
                    {amount} SOL
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default SlotMachineFallback;
