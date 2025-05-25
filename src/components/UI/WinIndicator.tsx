import WinIcon from '@/assets/icons/WinIcon';
import React from 'react';

const WinIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="font-normal text-[50px] tracking-[0%] text-right align-middle text-white uppercase leading-none">
        Win
      </span>
      <WinIcon height={42} width={42} />
    </div>
  );
};

export default WinIndicator;
