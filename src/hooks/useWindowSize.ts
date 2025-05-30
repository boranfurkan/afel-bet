'use client';

import { useIsomorphicLayoutEffect } from 'framer-motion';
import { useState } from 'react';

import useEventListener from './useEventListeners';

export interface WindowDimensions {
  windowSize: WindowSize;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isLargeScreen: boolean;
}

export interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowDimensions {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEventListener('resize', handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return {
    windowSize,
    isMobile:
      Number(windowSize?.width) <= 768 && Number(windowSize?.width) != 0,
    isTablet:
      Number(windowSize?.width) > 768 && Number(windowSize?.width) <= 1024,
    isLargeScreen: Number(windowSize?.width) <= 1024,
    isDesktop: Number(windowSize?.width) >= 1440,
  };
}

export default useWindowSize;
