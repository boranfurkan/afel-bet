import React from 'react';
import { motion } from 'framer-motion';
import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';
import LoseIndicator from '@/components/UI/LoseIndicator';

interface LoseAnimationProps {
  isMobile?: boolean;
}

const LoseAnimation: React.FC<LoseAnimationProps> = ({ isMobile = false }) => {
  return (
    <div className="slot-gradient-to-right px-3 py-2 md:px-5 md:py-4 w-full flex items-center justify-center gap-2 md:gap-4 relative overflow-hidden">
      <div
        className={`bg-[#171717]/30 backdrop-blur-sm rounded-[8px] ${
          isMobile ? 'w-1/3 min-h-[80px]' : 'w-1/4 min-h-[100px]'
        } flex items-center justify-center relative`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateZ: [0, 1, -1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: 4,
            repeatType: 'loop',
            repeatDelay: 0.5,
          }}
        >
          <motion.div
            animate={{
              x: [0, -2, 2, -2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: 4,
              repeatType: 'loop',
              repeatDelay: 0.5,
              ease: 'easeInOut',
            }}
          >
            <LoseIndicator isMobile={isMobile} />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-[8px] z-0 bg-[#FF0018]/5"
          animate={{
            boxShadow: [
              'inset 0 0 10px rgba(255, 0, 24, 0.1)',
              'inset 0 0 20px rgba(255, 0, 24, 0.3)',
              'inset 0 0 10px rgba(255, 0, 24, 0.1)',
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: 4,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      </div>

      <div
        className={`${
          isMobile ? 'w-2/3' : 'w-3/4'
        } flex items-center justify-center gap-4 md:gap-16 relative z-10`}
      >
        <AfelLogo isMobile={isMobile} />
        <PlusIcon height={isMobile ? 12 : 19} width={isMobile ? 12 : 19} />
        <SlotFrenzyText isMobile={isMobile} />
      </div>
    </div>
  );
};

export default LoseAnimation;
