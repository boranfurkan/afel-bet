import HeadIcon from "@/assets/icons/HeadIcon";
import TailIcon from "@/assets/icons/TailIcon";
import React from "react";
import { motion } from "framer-motion";
import { CoinFlipResultDtoChoice } from "@/api";

interface LastFlipItemProps {
  side: CoinFlipResultDtoChoice;
}

const LastFlipItem = ({ side }: LastFlipItemProps) => {
  const FlipData = {
    TAILS: {
      background: "#6C924A",
      icon: TailIcon,
    },
    HEADS: {
      background: "#FFF",
      icon: HeadIcon,
    },
  };

  const IconComponent = FlipData[side].icon;

  return (
    <motion.div
      className="rounded-full border border-black"
      style={{
        background: FlipData[side].background,
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      whileHover={{
        scale: 1.2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      }}
    >
      <IconComponent width={16} height={16} className="he" />
    </motion.div>
  );
};

export default LastFlipItem;
