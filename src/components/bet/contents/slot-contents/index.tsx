import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PlayPanel from './play-panel';
import SlotPanel from './slot-panel/SlotPanel';
import SlotMachineController from './slot-panel/SlotMachineController';
import ResultContainer from './results-container';

import useWindowSize from '@/hooks/useWindowSize';
import { motion, AnimatePresence } from 'framer-motion';
import StartButton from './play-panel/start-button/StartButton';
import WinningPatternsDisplay from './winnin-patterns-show/WinningPatternsDisplay';

const SlotContents = () => {
  const { isMobile } = useWindowSize();
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Set up portal element when component mounts
  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  // Toggle controls panel on mobile
  const toggleControls = () => {
    setIsControlsOpen(!isControlsOpen);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-visible">
      {/* Top Result Container */}
      <ResultContainer />

      {/* Main Game Area */}
      <div
        className={`w-full flex-1 flex ${
          isMobile ? 'flex-col' : 'flex-row'
        } overflow-visible relative`}
      >
        {/* Play Panel - Betting Controls */}
        {isMobile ? (
          // Modal Portal for Mobile
          portalElement &&
          isControlsOpen &&
          createPortal(
            <AnimatePresence>
              <motion.div
                className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-[320px] mx-auto mt-20 p-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                >
                  <div className="flex justify-between items-center mb-2 text-white">
                    <h3 className="text-xl font-bold">Controls</h3>
                    <button
                      onClick={() => setIsControlsOpen(false)}
                      className="p-1 rounded-full hover:bg-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="bg-black/20 rounded-lg p-1">
                    <PlayPanel
                      onClosePortal={() => {
                        setIsControlsOpen(false);
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>,
            portalElement
          )
        ) : (
          <div className={`${isMobile ? 'w-full' : 'w-[280px] xl:w-[300px]'}`}>
            <PlayPanel />
          </div>
        )}

        {/* Slot Machine */}
        <div className={`${isMobile ? 'w-full' : 'flex-1'} overflow-hidden`}>
          <SlotMachineController>
            {({ isReady, onReelStop, completedReels }) => (
              <SlotPanel
                onReelStop={onReelStop}
                completedReels={completedReels}
                isReady={isReady}
                isMobile={isMobile}
              />
            )}
          </SlotMachineController>
        </div>
      </div>

      {isMobile && (
        <StartButton className="bg-[#6c924a] border-r-4 border-b-4 border-l-4 border-[#A0C380]" />
      )}

      {/* Bottom Last Wins Display */}
      <WinningPatternsDisplay />

      {/* Mobile Controls Toggle Button */}
      {isMobile && (
        <motion.button
          className="fixed bottom-6 left-6 z-40 bg-[#a0c380] text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={toggleControls}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default SlotContents;
