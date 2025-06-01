'use client';

import AppWalletProvider from '@/contexts/AppWalletProvider';
import { FlipProvider } from '@/contexts/FlipContext';
import { NFTRefreshProvider } from '@/contexts/NFTRefreshContext';
import { SlotMachineProvider } from '@/contexts/SlotMachineContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppWalletProvider>
        <NFTRefreshProvider>
          <SlotMachineProvider>
            <FlipProvider>{children}</FlipProvider>
          </SlotMachineProvider>
        </NFTRefreshProvider>
      </AppWalletProvider>
    </QueryClientProvider>
  );
};

export default Providers;
