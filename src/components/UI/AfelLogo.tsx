import React, { memo } from 'react';
import Image from 'next/image';

interface AfelLogoProps {
  isMobile?: boolean;
}

const AfelLogo: React.FC<AfelLogoProps> = ({ isMobile = false }) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-5">
      <Image
        src="/images/bet/afel-logo.png"
        width={isMobile ? 40 : 78}
        height={isMobile ? 32 : 62}
        alt="Afel Logo"
        className={`${isMobile ? 'w-[40px] h-[32px]' : 'w-[78px] h-[62px]'}`}
      />
      <span
        className={`font-normal ${
          isMobile ? 'text-3xl' : 'text-[77.25px]'
        } leading-[100%] tracking-[0%] align-middle text-white`}
      >
        AFEL
      </span>
    </div>
  );
};

export default memo(AfelLogo);
