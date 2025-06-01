import LoseIcon from '@/assets/icons/LoseIcon';
import React from 'react';

interface LoseIndicatorProps {
  isMobile?: boolean;
}

const LoseIndicator: React.FC<LoseIndicatorProps> = ({ isMobile = false }) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 text-white">
      <span
        className={`font-normal ${
          isMobile ? 'text-3xl' : 'text-[50px]'
        } leading-none tracking-[0%] text-right align-middle`}
      >
        Lose
      </span>
      <LoseIcon height={isMobile ? 32 : 40} width={isMobile ? 40 : 40} />
    </div>
  );
};

export default LoseIndicator;
