import LoseIcon from '@/assets/icons/LoseIcon';
import React from 'react';

const LoseIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="font-normal text-[50px] tracking-[0%] text-right align-middle text-white uppercase leading-none">
        Lose
      </span>
      <LoseIcon height={42} width={42} />
    </div>
  );
};

export default LoseIndicator;
