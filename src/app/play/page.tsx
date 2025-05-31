"use client";
import TabSystem from '@/components/bet/game-tabs/TabSystem';
import WalletGuard from '@/components/WalletGuard';
import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Separate component for referral handling
function ReferralHandler() {
  const searchParams = useSearchParams();
  
  // Handle referral code from URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Store referral code for referral system
      localStorage.setItem('pendingReferralCode', refCode);
      
      // Show success message or notification
      console.log(`Referral code received: ${refCode}`);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Referral Handler with Suspense */}
      <Suspense fallback={null}>
        <ReferralHandler />
      </Suspense>

      <WalletGuard>
        <div className="bet-container w-full min-h-screen max-md:pt-24 py-6 md:py-10 lg:py-20 [&>*]:font-pixel">
          <TabSystem />
        </div>
      </WalletGuard>
    </div>
  );
};

export default Page;
