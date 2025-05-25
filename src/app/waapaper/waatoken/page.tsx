"use client";
import { motion } from "framer-motion";

export default function WaaTokenPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1000px] mx-auto relative flex flex-col gap-4 px-4 md:px-8 pt-6 md:pt-8 rounded-md bg-[#181818]/80 border border-white/30 font-sans backdrop-blur-lg pb-4"
    >
      <p className="text-2xl md:text-[32px] font-black text-white">$WAA</p>

      <div className="text-lg md:text-xl text-white flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex">
            <p>
              $WAA is fair-launched as a memecoin, giving everyone, including
              us, an equal chance. We locked the dev wallet holding 3.5% for 365
              days (until November 16, 2025).
            </p>
          </div>
          <div className="flex">
            <p>
              Currently, 100% of the supply is in circulation and in
              people&apos;s hands.
            </p>
          </div>
          <div className="flex">
            <p>
              As AFEL, we&apos;ll use revenue from our apps to buy back $WAA and
              reintegrate it into the market, because we know the community
              always comes first
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
