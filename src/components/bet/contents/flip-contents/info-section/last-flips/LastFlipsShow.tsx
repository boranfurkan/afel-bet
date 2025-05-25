import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/UI/separator";
import LastFlipItem from "./LastFlipItem";
import { useGame } from "@/hooks/bet/useGame";
import { PlayCoinFlipDtoChoice } from "@/api";

const LastFlipsShow = () => {
  const { coinFlip } = useGame("coinflip");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (!coinFlip.history || coinFlip.history.items.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center gap-3 flex-1 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-2" variants={itemVariants}>
        <motion.h4
          className="font-normal text-base leading-[27.2px] tracking-[0%] text-white text-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          LAST FLIPS
        </motion.h4>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <LastFlipItem
            side={coinFlip.history.items[0].result as PlayCoinFlipDtoChoice}
          />
        </motion.div>
      </motion.div>

      {coinFlip.history.items.length > 1 && (
        <>
          {" "}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Separator
              className="bg-white/30 w-[1px] h-5 min-h-5"
              orientation="vertical"
            />
          </motion.div>
          <motion.div
            className="flex items-center gap-2 flex-1 overflow-x-scroll no-scrollbar"
            variants={containerVariants}
          >
            {coinFlip.history.items.slice(1).map((flip, index) => (
              <motion.div
                key={flip.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <LastFlipItem side={flip.result as PlayCoinFlipDtoChoice} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default LastFlipsShow;
