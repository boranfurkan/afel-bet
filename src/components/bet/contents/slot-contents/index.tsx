import React from 'react';
import PlayPanel from './play-panel';
import SlotPanel from './slot-panel/SlotPanel';
import SlotMachineController from './slot-panel/SlotMachineController';
import ResultContainer from './results-container';
import LastWinsDisplay from './last-wins-show/LastWinsDisplay';

const SlotContents = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-visible">
      {/* Top Result Container */}
      <ResultContainer />

      {/* Main Game Area */}
      <div className="w-full flex-1 flex overflow-visible">
        {/* Play Panel - Betting Controls */}
        <div className="w-[280px] xl:w-[300px]">
          <PlayPanel />
        </div>

        {/* Slot Machine */}
        <div className="flex-1 overflow-hidden">
          <SlotMachineController>
            {({ isReady, onReelStop, completedReels }) => (
              <SlotPanel
                onReelStop={onReelStop}
                completedReels={completedReels}
                isReady={isReady}
              />
            )}
          </SlotMachineController>
        </div>
      </div>

      {/* Bottom Last Wins Display */}
      <LastWinsDisplay />
    </div>
  );
};

export default SlotContents;
