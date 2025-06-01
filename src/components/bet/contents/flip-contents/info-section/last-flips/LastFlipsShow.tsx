import React from "react";
import { motion } from "framer-motion";
import LastFlipItem from "./LastFlipItem";
import { useGame } from "@/hooks/bet/useGame";
import { CoinFlipResultDtoChoice } from "@/api";
import { useCoinFlip } from "@/hooks/bet/useCoinFlip";

const LastFlipsShow = () => {
  const coinFlip = useCoinFlip();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (!coinFlip || coinFlip.history?.items.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center gap-2 w-full overflow-x-auto no-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h4
        className="font-normal text-xs text-white/80 whitespace-nowrap"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        LAST:
      </motion.h4>

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
        {coinFlip.history?.items.slice(0, 8).map((flip, index) => (
          <motion.div
            key={flip.id || index}
            variants={itemVariants}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <LastFlipItem side={flip.result as CoinFlipResultDtoChoice} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LastFlipsShow;
