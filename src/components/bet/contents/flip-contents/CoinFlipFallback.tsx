import { SignInModal } from '@/components/auth/SignInModal';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useState } from 'react';

export const CoinFlipFallback: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full h-full flex flex-col relative">
        {/* Mock background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#78ff00]/10 to-black/90" />

        {/* Mock info bar */}
        <div className="bg-[#002E09]/40 backdrop-blur-sm px-3 py-2 flex items-center gap-3 border-b border-[#6c924a]/30 relative z-10">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 bg-white/20 rounded-full" />
            <div className="text-white/50 text-sm">---.-- SOL NET PROFIT</div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mock game panel */}
            <div className="w-full border border-[#FFFFFF99]/20 rounded-xl p-4 backdrop-blur-sm bg-black/30 relative">
              {/* Content with overlay */}
              <div className="opacity-30">
                <div className="w-full flex justify-between items-center mb-4">
                  <div className="text-white/50 text-sm">BALANCE</div>
                  <div className="text-xl font-bold text-white/50">
                    ---.--- SOL
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-4" />

                <div className="mb-4">
                  <h3 className="text-white/50 text-center mb-2 text-sm uppercase">
                    I Choose
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-r from-white/20 to-gray-100/20 border border-black/20 rounded px-4 py-3 flex items-center justify-center gap-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full" />
                      <span className="text-white/50 font-bold">HEADS</span>
                    </div>
                    <div className="bg-gradient-to-r from-white/20 to-gray-100/20 border border-black/20 rounded px-4 py-3 flex items-center justify-center gap-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full" />
                      <span className="text-white/50 font-bold">TAILS</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-white/50 text-center mb-2 text-sm uppercase">
                    Bet Amount
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.05, 0.1, 0.25, 0.5, 1, 2].map((amount) => (
                      <div
                        key={amount}
                        className="bg-gradient-to-r from-white/20 to-gray-100/20 border border-black/20 rounded py-2 text-center text-white/50"
                      >
                        {amount}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connect wallet overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="bg-[#181818]/90 border border-white/20 rounded-xl p-6 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-[#78ff00] to-[#6C924A] rounded-full flex items-center justify-center mx-auto mb-3"
                    animate={{
                      rotateY: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Wallet size={24} className="text-black" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    Connect to Flip
                  </h3>
                  <p className="text-white/70 mb-4 text-sm">
                    Connect your wallet to start flipping coins!
                  </p>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#78ff00] hover:bg-[#6C924A] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Connect Wallet
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CoinFlipFallback;
