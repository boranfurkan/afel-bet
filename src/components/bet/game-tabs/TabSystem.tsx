'use client';
import React, { useState } from 'react';
import TabHeadings from './tab-headings/TabHeadings';
import { AnimatePresence, motion } from 'framer-motion';
import SlotContents from '../contents/slot-contents';
import FlipContents from '../contents/flip-contents';
import { GameTabs } from '@/types/bet';
import BalancePanel from './BalancePanel';

const TabSystem = () => {
  const [activeTab, setActiveTab] = useState(GameTabs.SLOT);

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
      <TabHeadings activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="w-full flex-1 flex">
        {/* Game Content */}
        <div className="flex-1 relative overflow-hidden">
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

        {/* Side Balance Panel */}
        <BalancePanel />
      </div>
    </div>
  );
};

export default TabSystem;
