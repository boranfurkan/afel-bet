import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  text?: string;
}

const BetLoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#a0c380',
  thickness = 4,
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          border: `${thickness}px solid rgba(160, 195, 128, 0.2)`,
          borderTop: `${thickness}px solid ${color}`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <motion.div
          className="text-sm text-white font-medium"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};

export default BetLoadingSpinner;
