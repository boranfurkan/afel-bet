'use client';
import React, { useState } from 'react';
import TabHeadings from './tab-headings/TabHeadings';
import { AnimatePresence, motion } from 'framer-motion';
import SlotContents from '../contents/slot-contents';
import FlipContents from '../contents/flip-contents';
import { GameTabs } from '@/types/bet';
import BalancePanel from './BalancePanel';
import useWindowSize from '@/hooks/useWindowSize';

const TabSystem = () => {
  const [activeTab, setActiveTab] = useState(GameTabs.SLOT);
  const [isBalancePanelOpen, setIsBalancePanelOpen] = useState(false);
  const { isMobile, isLargeScreen } = useWindowSize();

  const toggleBalancePanel = () => {
    setIsBalancePanelOpen(!isBalancePanelOpen);
  };

  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Navigation */}
      <TabHeadings
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBalanceClick={isMobile ? toggleBalancePanel : undefined}
      />

      {/* Main Content */}
      <div
        className={`w-full flex-1 flex ${
          isMobile ? 'flex-col' : 'flex-row'
        } relative`}
      >
        {/* Game Content */}
        <div
          className={`${
            isMobile ? 'w-full' : 'flex-1'
          } relative overflow-hidden`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="w-full h-full"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
            >
              {activeTab === GameTabs.SLOT ? (
                <div className="w-full h-full border-[1.5px] border-t-0 border-border bg-dark-bg">
                  <SlotContents />
                </div>
              ) : (
                <div className="w-full h-full border-[1.5px] border-t-0 border-border bg-dark-bg">
                  <FlipContents />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Balance Panel - Desktop: Always visible, Mobile: Toggle */}
        <AnimatePresence>
          {(!isMobile || isBalancePanelOpen) && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`
                ${
                  isMobile
                    ? 'w-[85%] max-w-[300px]'
                    : isLargeScreen
                    ? 'w-[250px]'
                    : 'w-[280px]'
                }
              `}
            >
              <BalancePanel
                onClose={isMobile ? toggleBalancePanel : undefined}
                isOpen={isBalancePanelOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: Balance Panel Toggle Button (Fixed to bottom right) */}
        {isMobile && !isBalancePanelOpen && (
          <motion.button
            className="fixed bottom-6 right-6 z-40 bg-[#a0c380] text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            onClick={toggleBalancePanel}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
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
              <path d="M2 17h12a3 3 0 1 0 0-6H2"></path>
              <path d="M2 7h12a3 3 0 1 1 0 6H2"></path>
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TabSystem;
