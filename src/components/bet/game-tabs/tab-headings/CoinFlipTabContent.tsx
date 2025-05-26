import GoldIcon from '@/assets/icons/GoldIcon';
import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface CoinFlipTabContentProps {
  isActive?: boolean;
  isMobile?: boolean;
}

const CoinFlipTabContent: React.FC<CoinFlipTabContentProps> = ({
  isActive = false,
  isMobile = false,
}) => {
  const controls = useAnimationControls();
  const iconControls = useAnimationControls();

  useEffect(() => {
    if (isActive) {
      controls.start('animate');
      iconControls.start('flip');
    } else {
      controls.start('initial');
      iconControls.start('initial');
    }
  }, [isActive, controls, iconControls]);

  // Dynamic text size based on screen size
  const textSize = isMobile ? 'text-2xl' : 'text-[40.97px]';

  return (
    <div className="font-supply flex items-center gap-2 md:gap-3 text-white">
      <motion.span
        className={`font-normal ${textSize} leading-[0%] tracking-[-3.5%] align-middle uppercase`}
        initial={{ opacity: 1 }}
        animate={controls}
        variants={{
          initial: { opacity: 1, x: 0 },
          animate: {
            opacity: [1, 0.8, 1],
            x: [-3, 3, -3, 0],
            transition: {
              duration: 0.5,
              times: [0, 0.33, 0.66, 1],
            },
          },
        }}
      >
        Coin
      </motion.span>
      <motion.div
        className="relative"
        initial={{ rotateY: 0 }}
        animate={iconControls}
        variants={{
          initial: { rotateY: 0 },
          flip: {
            rotateY: 360,
            transition: {
              duration: 0.6,
              ease: 'easeInOut',
            },
          },
        }}
      >
        <GoldIcon
          className="max-md:hidden block"
          width={isMobile ? 16 : 40}
          height={isMobile ? 16 : 40}
        />
      </motion.div>
      <motion.span
        className={`font-normal ${textSize} leading-[0%] tracking-[-3.5%] align-middle uppercase`}
        initial={{ opacity: 1 }}
        animate={controls}
        variants={{
          initial: { opacity: 1, x: 0 },
          animate: {
            opacity: [1, 0.8, 1],
            x: [3, -3, 3, 0],
            transition: {
              duration: 0.5,
              times: [0, 0.33, 0.66, 1],
            },
          },
        }}
      >
        Flip
      </motion.span>
    </div>
  );
};

export default CoinFlipTabContent;
