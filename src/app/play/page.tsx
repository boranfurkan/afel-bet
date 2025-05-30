import TabSystem from '@/components/bet/game-tabs/TabSystem';
import WalletGuard from '@/components/WalletGuard';
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <WalletGuard>
        <div className="bet-container w-full min-h-screen max-md:pt-24 py-6 md:py-10 lg:py-20 [&>*]:font-pixel">
          <TabSystem />
        </div>
      </WalletGuard>
    </div>
  );
};

export default Page;
