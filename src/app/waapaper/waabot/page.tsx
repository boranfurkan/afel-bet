"use client";
import { motion } from "framer-motion";

export default function WaaBotPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1000px] mx-auto relative flex flex-col gap-4 px-4 md:px-8 pt-6 md:pt-8 rounded-md bg-[#181818]/80 border border-white/30 font-sans backdrop-blur-lg pb-4"
    >
      <p className="text-2xl md:text-[32px] font-black text-white">WAABOT</p>

      <div className="text-lg md:text-2xl text-white flex flex-col gap-6">
        <p>
          WAABOT is your ultimate tool for automated, lightning-fast trading.
          Accessible via Telegram or web, it leverages Hellomoon RPCs to deliver
          real-time tracking and execution.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <span>⁃</span>
            <p>
              <span className="font-bold">Instant Tracking:</span> WAABOT
              monitors top-performing wallets in real time, keeping you in the
              loop.
            </p>
          </div>

          <div className="flex gap-2">
            <span>⁃</span>
            <p>
              <span className="font-bold">Automated Copy Trading:</span> It
              mirrors every trade, executing the same moves instantly. If a
              tracked wallet sells 50%, so do you.
            </p>
          </div>
        </div>

        <p>
          FEL holders gain exclusive access to high-performing wallets, curated
          by elite alphacallers. With WAABOT, trade smarter, faster, and stay
          ahead in the market.
        </p>
      </div>
    </motion.div>
  );
}
