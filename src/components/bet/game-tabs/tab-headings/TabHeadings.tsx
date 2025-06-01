'use client';

import React from 'react';
import SlotFrenzyTabContent from './SlotFrenzyTabContent';
import CoinFlipTabContent from './CoinFlipTabContent';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GameTabs } from '@/types/bet';
import useWindowSize from '@/hooks/useWindowSize';

interface TabHeadingsProps {
  activeTab: GameTabs;
  setActiveTab: (tab: GameTabs) => void;
  onBalanceClick?: () => void;
}

const TabHeadings: React.FC<TabHeadingsProps> = ({
  activeTab,
  setActiveTab,
  onBalanceClick,
}) => {
  const { isMobile, isLargeScreen } = useWindowSize();

  return (
    <div className="w-full flex items-center justify-between">
      <div
        className={`flex-1 flex ${
          isMobile ? 'h-[70px]' : 'h-[80px]'
        } border-[1.5px] border-border rounded-t-[37.37px] overflow-hidden`}
      >
        <motion.div
          onClick={() => setActiveTab(GameTabs.SLOT)}
          className={cn(
            'flex-1 w-full flex items-center justify-center rounded-tl-[37.37px] py-4 cursor-pointer relative'
          )}
          animate={{
            backgroundColor:
              activeTab === GameTabs.SLOT ? '#212c16' : '#1a1a1a', // dark-bg color
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Background gradient overlay */}
          <motion.div
            className={cn(
              'absolute inset-0 slot-gradient-to-bottom rounded-tl-[37.37px]'
            )}
            initial={{ opacity: activeTab === GameTabs.SLOT ? 1 : 0 }}
            animate={{ opacity: activeTab === GameTabs.SLOT ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10"
            animate={{
              scale: activeTab === GameTabs.SLOT ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <SlotFrenzyTabContent
              isActive={activeTab === GameTabs.SLOT}
              isMobile={isMobile}
            />
          </motion.div>
        </motion.div>

        <motion.div
          onClick={() => setActiveTab(GameTabs.FLIP)}
          className={cn(
            'flex-1 w-full flex items-center justify-center rounded-tr-[37.37px] py-4 cursor-pointer relative'
          )}
          animate={{
            backgroundColor:
              activeTab === GameTabs.FLIP ? '#78ff00' : '#1a1a1a', // dark-bg color
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Background gradient overlay */}
          <motion.div
            className={cn(
              'absolute inset-0 coin-flip-gradient rounded-tr-[37.37px]'
            )}
            initial={{ opacity: activeTab === GameTabs.FLIP ? 1 : 0 }}
            animate={{ opacity: activeTab === GameTabs.FLIP ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          {/* Content */}
          <motion.div
            className={cn(
              'relative z-10',
              activeTab === GameTabs.FLIP ? 'text-black' : ''
            )}
            animate={{
              scale: activeTab === GameTabs.FLIP ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <CoinFlipTabContent
              isActive={activeTab === GameTabs.FLIP}
              isMobile={isMobile}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TabHeadings;
