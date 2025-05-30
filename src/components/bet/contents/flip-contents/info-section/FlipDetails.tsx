import React from "react";
import { motion } from "framer-motion";
import UserIcon from "@/assets/icons/UserIcon";
import LastFlipsShow from "./last-flips/LastFlipsShow";
import { useGame } from "@/hooks/bet/useGame";
import { useCoinFlip } from "@/hooks/bet/useCoinFlip";

const FlipDetails = () => {
  const coinFlip = useCoinFlip();

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="bg-[#002E09]/80 backdrop-blur-sm px-3 py-2 flex items-center gap-3 border-b border-[#6c924a]/50 overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={statsVariants} className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <UserIcon />
        </motion.div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.span
              className="font-normal text-sm text-white text-nowrap"
              animate={{
                color: ["#ffffff", "#a0c380", "#ffffff"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {coinFlip?.stats?.netProfit || 0} SOL
            </motion.span>
            <span className="font-normal text-[9px] ml-1 text-white/60 text-nowrap">
              NET PROFIT
            </span>
          </div>
        </div>
      </motion.div>

      <div className="h-6 w-px bg-white/20 mx-1" />

      <motion.div variants={statsVariants} className="flex-1">
        <LastFlipsShow />
      </motion.div>
    </motion.div>
  );
};

export default FlipDetails;
