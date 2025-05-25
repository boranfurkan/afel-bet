"use client";
import React, { createContext, useContext, useState } from "react";

interface CollectionsContextType {
  selectedTraits: { trait_type: string; value: string }[];
  setSelectedTraits: (traits: { trait_type: string; value: string }[]) => void;
  selectedOptionSort: string;
  setSelectedOptionSort: (option: string) => void;
  filterSwitch: boolean;
  setFilterSwitch: (data: boolean) => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(
  undefined
);

export const CollectionsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedTraits, setSelectedTraits] = useState<
    { trait_type: string; value: string }[]
  >([]);
  const [selectedOptionSort, setSelectedOptionSort] = useState("");
  const [filterSwitch, setFilterSwitch] = useState(false);
  return (
    <CollectionsContext.Provider
      value={{
        selectedTraits,
        setSelectedTraits,
        selectedOptionSort,
        setSelectedOptionSort,
        setFilterSwitch,
        filterSwitch,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error(
      "useSelectedTraits must be used within a SelectedTraitsProvider"
    );
  }
  return context;
};
