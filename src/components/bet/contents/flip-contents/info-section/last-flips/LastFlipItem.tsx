import HeadIcon from '@/assets/icons/HeadIcon';
import TailIcon from '@/assets/icons/TailIcon';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCoinFlipDtoChoice } from '@/api';

interface LastFlipItemProps {
  side: PlayCoinFlipDtoChoice;
}

const LastFlipItem = ({ side }: LastFlipItemProps) => {
  const FlipData = {
    TAILS: {
      background: '#6C924A',
      icon: TailIcon,
    },
    HEADS: {
      background: '#FFF',
      icon: HeadIcon,
    },
  };

  const IconComponent = FlipData[side].icon;

  return (
    <motion.div
      className="rounded-[31px] border border-black p-1 cursor-pointer"
      style={{
        background: FlipData[side].background,
      }}
      whileHover={{
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        },
      }}
    >
      <motion.div
        animate={{
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <IconComponent />
      </motion.div>
    </motion.div>
  );
};

export default LastFlipItem;
