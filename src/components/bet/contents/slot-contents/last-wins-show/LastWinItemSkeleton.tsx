import React from 'react';

const LastWinItemSkeleton = () => {
  return (
    <div className="bg-[#DFFFD1] px-3 py-1.5 flex flex-col gap-1 w-max rounded-[15px] animate-pulse">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {[...Array(3)].map((_, index) => (
            <div
              key={`skeleton-row1-icon-${index}`}
              className="w-[30px] h-[30px] bg-gray-300 rounded-md"
            />
          ))}
        </div>
        <div className="w-24 h-12 bg-gray-300 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {[...Array(3)].map((_, index) => (
            <div
              key={`skeleton-row2-icon-${index}`}
              className="w-[30px] h-[30px] bg-gray-300 rounded-md"
            />
          ))}
        </div>

        <div className="w-24 h-12 bg-gray-300 rounded-md" />
      </div>
    </div>
  );
};

export default LastWinItemSkeleton;
