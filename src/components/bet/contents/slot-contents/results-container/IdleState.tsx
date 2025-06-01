import React from 'react';
import { motion } from 'framer-motion';
import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';

interface IdleStateProps {
  isSpinning: boolean;
  isMobile?: boolean;
}

// Component shown when no win/lose state is active
const IdleState: React.FC<IdleStateProps> = ({
  isSpinning,
  isMobile = false,
}) => {
  return (
    <div className="slot-gradient-to-right px-3 py-2 md:px-5 md:py-4 w-full flex items-center justify-center gap-2 md:gap-4 relative overflow-hidden">
      {/* Result box - empty */}
      <div
        className={`bg-[#171717]/30 backdrop-blur-sm rounded-[8px] ${
          isMobile ? 'w-1/3 min-h-[80px]' : 'w-1/4 min-h-[100px]'
        } flex items-center justify-center relative`}
      >
        <div className={`${isMobile ? 'h-[50px]' : 'h-[62px]'}`} />{' '}
        {/* Empty placeholder with same height */}
      </div>

      {/* Logo section */}
      <div
        className={`${
          isMobile ? 'w-2/3' : 'w-3/4'
        } flex items-center justify-center gap-4 md:gap-16 relative z-10`}
      >
        <AfelLogo isMobile={isMobile} />

        <motion.div
          animate={
            isSpinning
              ? {
                  rotate: [0, 180, 360],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: isSpinning ? Infinity : 0,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <PlusIcon height={isMobile ? 12 : 19} width={isMobile ? 12 : 19} />
        </motion.div>

        <SlotFrenzyText isMobile={isMobile} />
      </div>
    </div>
  );
};

export default IdleState;
