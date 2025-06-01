import OneIcon from '@/assets/icons/OneIcon';
import ThreeIcon from '@/assets/icons/ThreeIcon';
import TwoIcon from '@/assets/icons/TwoIcon';
import React, { useMemo, memo } from 'react';

interface RowIndicatorProps {
  side: 'left' | 'right';
  containerHeight: string;
}

const RowIndicator: React.FC<RowIndicatorProps> = ({
  side,
  containerHeight,
}) => {
  const rowPositions = useMemo(() => {
    const heightValue = parseInt(containerHeight.replace('px', ''));
    const rowHeight = (heightValue + 50) / 2.1;

    return [
      rowHeight / 2.5, // row 1 center
      rowHeight + rowHeight / 2.5, // row 2 center
      2 * rowHeight + rowHeight / 2.5, // row 3 center
    ];
  }, [containerHeight]);

  const firstRowStyles = useMemo(() => {
    const backgroundColor = `linear-gradient(180deg, #1A55DD 0%, #00A7D1 100%)`;
    const width = '32px';
    const height = '42px';
    const borderRadius = '8px';

    return {
      background: backgroundColor,
      width: width,
      height: height,
      borderRadius: borderRadius,
    };
  }, []);

  const secondRowStyles = useMemo(() => {
    const backgroundColor = `linear-gradient(180deg, #E76800 0%, #F47103 100%)`;
    const width = '32px';
    const height = '42px';
    const borderRadius = '8px';

    return {
      background: backgroundColor,
      width: width,
      height: height,
      borderRadius: borderRadius,
    };
  }, []);

  const thirdRowStyles = useMemo(() => {
    const backgroundColor = `linear-gradient(180deg, #04FF00 0%, #1A3700 100%)`;
    const width = '32px';
    const height = '42px';
    const borderRadius = '8px';

    return {
      background: backgroundColor,
      width: width,
      height: height,
      borderRadius: borderRadius,
    };
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{ height: containerHeight }}
    >
      {[1, 2, 3].map((rowNumber, index) => (
        <div
          key={`row-indicator-${side}-${rowNumber}`}
          className="absolute flex items-center justify-center"
          style={{
            top: `${rowPositions[index]}px`,
            [side === 'left' ? 'left' : 'right']: '0px',
            transform: 'translateY(-250%)',
            ...((index === 0 && firstRowStyles) ||
              (index === 1 && secondRowStyles) ||
              (index === 2 && thirdRowStyles)),
          }}
        >
          {index === 0 ? (
            <OneIcon className="scale-75" />
          ) : index === 1 ? (
            <TwoIcon className="scale-75" />
          ) : (
            <ThreeIcon className="scale-75" />
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(RowIndicator);
