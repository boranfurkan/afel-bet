import TabSystem from '@/components/bet/game-tabs/TabSystem';
import React from 'react';

const Page = () => {
  return (
    <div className="bet-container w-full min-h-screen max-md:pt-24 py-6 md:py-10 lg:py-20 [&>*]:font-pixel">
      <TabSystem />
    </div>
  );
};

export default Page;
