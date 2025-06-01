import WinIcon from '@/assets/icons/WinIcon';
import React from 'react';

interface WinIndicatorProps {
  isMobile?: boolean;
}

const WinIndicator: React.FC<WinIndicatorProps> = ({ isMobile = false }) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 text-white">
      <span
        className={`font-normal ${
          isMobile ? 'text-3xl' : 'text-[50px]'
        } leading-none tracking-[0%] text-right align-middle`}
      >
        Win
      </span>
      <WinIcon height={isMobile ? 32 : 40} width={isMobile ? 32 : 40} />
    </div>
  );
};

export default WinIndicator;
