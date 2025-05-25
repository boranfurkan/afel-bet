"use client";
import { motion } from "framer-motion";

export default function FelBenefitsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1000px] mx-auto relative flex flex-col gap-4 px-4 md:px-8 pt-6 md:pt-8 rounded-md bg-[#181818]/80 border border-white/30 font-sans backdrop-blur-lg pb-4"
    >
      <p className="text-2xl md:text-[32px] font-black text-white">
        FEL BENEFITS
      </p>

      <div className="text-lg md:text-xl text-white flex flex-col gap-6">
        <p>
          At AFEL, we believe in building together. Here&apos;s what FEL holders
          can count on:
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <span>⁃</span>
            <p>
              <span className="font-bold">We Are the Ecosystem:</span> Together,
              we&apos;re not just participants—we&apos;re the driving force
              behind AFEL. Our community comes first in everything we do.
            </p>
          </div>

          <div className="flex gap-2">
            <span>⁃</span>
            <p>
              <span className="font-bold">Token Buybacks & Airdrops:</span>{" "}
              Instead of distributing $SOL or other tokens, we invest in $WAA.
              We buy it back and airdrop it directly to FEL holders, ensuring
              you&apos;re always at the center of our growth.
            </p>
          </div>

          <div className="flex gap-2">
            <span>⁃</span>
            <p>
              <span className="font-bold">Continuous Innovation:</span> We build
              with purpose, guided by what excites the space and what our
              community truly needs. Your voice drives us forward.
            </p>
          </div>

          <div className="flex gap-2">
            <span>⁃</span>
            <p>
              <span className="font-bold">Exclusive Experiences:</span> FELs
              gain access to unforgettable IRL events, bringing the AFEL vision
              to life and strengthening the bonds that make us stronger.
            </p>
          </div>
        </div>

        <p>
          With AFEL, you&apos;re not just holding an Token or NFT—you&apos;re
          helping shape an ever-evolving, thriving ecosystem.
        </p>
      </div>
    </motion.div>
  );
}
