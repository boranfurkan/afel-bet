"use client";
import { createContext, useContext, useCallback, useState } from "react";

interface NFTRefreshContextType {
  refreshAllNFTs: () => void;
  setRefreshFunction: (fn: () => void) => () => void; // Update return type here
}

const NFTRefreshContext = createContext<NFTRefreshContextType | undefined>(
  undefined,
);

export function NFTRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshFns, setRefreshFns] = useState<Set<() => void>>(new Set());

  const refreshAllNFTs = useCallback(() => {
    setTimeout(() => {
      refreshFns.forEach((fn) => fn());
    }, 1000);
  }, [refreshFns]);

  const setRefreshFunction = useCallback((fn: () => void) => {
    setRefreshFns((prev) => {
      const newSet = new Set(prev);
      newSet.add(fn);
      return newSet;
    });

    // Return the cleanup function
    return () => {
      setRefreshFns((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fn);
        return newSet;
      });
    };
  }, []);

  return (
    <NFTRefreshContext.Provider value={{ refreshAllNFTs, setRefreshFunction }}>
      {children}
    </NFTRefreshContext.Provider>
  );
}

export function useNFTRefresh() {
  const context = useContext(NFTRefreshContext);
  if (context === undefined) {
    throw new Error("useNFTRefresh must be used within a NFTRefreshProvider");
  }
  return context;
}
