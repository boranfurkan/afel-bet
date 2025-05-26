import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import WinAnimation from './WinAnimation';
import LoseAnimation from './LoseAnimation';
import IdleState from './IdleState';
import useWindowSize from '@/hooks/useWindowSize';

const ResultContainer = () => {
  const { winResult, isSpinning, spinCompleted } = useSlotMachine();
  const [componentKey, setComponentKey] = useState(Date.now());
  const { isMobile } = useWindowSize();

  const [playWinnerSound] = useSound('/sounds/winner.mp3');

  useEffect(() => {
    setComponentKey(Date.now());
  }, [isSpinning, spinCompleted]);

  useEffect(() => {
    if (winResult?.isWin && spinCompleted && !isSpinning) {
      playWinnerSound();
    }
  }, [winResult, spinCompleted, isSpinning, playWinnerSound]);

  if (isSpinning) {
    return (
      <IdleState
        key={`spinning-${componentKey}`}
        isSpinning={true}
        isMobile={isMobile}
      />
    );
  } else if (!spinCompleted) {
    return (
      <IdleState
        key={`waiting-${componentKey}`}
        isSpinning={false}
        isMobile={isMobile}
      />
    );
  } else if (winResult) {
    if (winResult.isWin) {
      return <WinAnimation key={`win-${componentKey}`} isMobile={isMobile} />;
    } else {
      return <LoseAnimation key={`lose-${componentKey}`} isMobile={isMobile} />;
    }
  } else {
    return (
      <IdleState
        key={`idle-${componentKey}`}
        isSpinning={false}
        isMobile={isMobile}
      />
    );
  }
};

export default ResultContainer;
