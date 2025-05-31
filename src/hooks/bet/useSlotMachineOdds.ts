import { useGamesPublicControllerGetSlotMachineOdds } from '@/api';
import { symbolsToNumbers } from '@/utils/gameUtils';
import { SlotIconType } from '@/types/bet';
import { useMemo } from 'react';

// Define types for the API response
export interface SlotMachineOddsResponse {
  symbolWeights: Record<string, number>;
  threeOfAKindMultipliers: Record<string, number>;
  specialCombinations: {
    symbols: string[];
    multiplier: number;
  }[];
}

// Define types for the transformed data
export interface SlotMachineOdds {
  iconDropChances: Record<SlotIconType, number>;
  iconMultipliers: Record<SlotIconType, number>;
  specialCombinations: {
    combo: SlotIconType[];
    multiplier: number;
  }[];
  isLoading: boolean;
  error: unknown;
}

export const useSlotMachineOdds = (): SlotMachineOdds => {
  const { data, isLoading, error } =
    useGamesPublicControllerGetSlotMachineOdds();

  return useMemo(() => {
    // Fallback values if data is not loaded yet - updated to match API response structure
    const fallbackIconDropChances: Record<SlotIconType, number> = {
      [SlotIconType.MEAT]: 0.35, // LEMON: 28 / 80
      [SlotIconType.CROCODILE]: 0.338, // ORANGE: 27 / 80
      [SlotIconType.HEAD]: 0.263, // MEAT: 21 / 80
      [SlotIconType.TRUMP]: 0.181, // TRUMP: 14.5 / 80
      [SlotIconType.SOLANA]: 0.088, // SOLANA: 7 / 80
      [SlotIconType.AFEL]: 0.031, // AFEL: 2.5 / 80
    };

    const fallbackIconMultipliers: Record<SlotIconType, number> = {
      [SlotIconType.MEAT]: 1.2, // LEMON
      [SlotIconType.CROCODILE]: 1.3, // ORANGE
      [SlotIconType.HEAD]: 2, // MEAT
      [SlotIconType.TRUMP]: 3, // TRUMP
      [SlotIconType.SOLANA]: 10, // SOLANA
      [SlotIconType.AFEL]: 15, // AFEL
    };

    const fallbackSpecialCombinations = [
      {
        combo: [SlotIconType.HEAD, SlotIconType.SOLANA, SlotIconType.AFEL], // MEAT, SOLANA, AFEL
        multiplier: 4,
      },
      {
        combo: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.CROCODILE,
        ], // LEMON, ORANGE, ORANGE
        multiplier: 1.6,
      },
      {
        combo: [SlotIconType.HEAD, SlotIconType.TRUMP, SlotIconType.HEAD], // MEAT, TRUMP, MEAT
        multiplier: 2.5,
      },
      {
        combo: [SlotIconType.CROCODILE, SlotIconType.SOLANA, SlotIconType.AFEL], // ORANGE, SOLANA, AFEL
        multiplier: 3.5,
      },
      {
        combo: [SlotIconType.TRUMP, SlotIconType.AFEL, SlotIconType.SOLANA], // TRUMP, AFEL, SOLANA
        multiplier: 4,
      },
      {
        combo: [SlotIconType.MEAT, SlotIconType.MEAT, SlotIconType.CROCODILE], // LEMON, LEMON, ORANGE
        multiplier: 1.3,
      },
    ];

    if (!data) {
      return {
        iconDropChances: fallbackIconDropChances,
        iconMultipliers: fallbackIconMultipliers,
        specialCombinations: fallbackSpecialCombinations,
        isLoading,
        error,
      };
    }

    // Transform symbolWeights to iconDropChances
    const iconDropChances: Record<SlotIconType, number> = {
      [SlotIconType.MEAT]: 0,
      [SlotIconType.CROCODILE]: 0,
      [SlotIconType.HEAD]: 0,
      [SlotIconType.TRUMP]: 0,
      [SlotIconType.SOLANA]: 0,
      [SlotIconType.AFEL]: 0,
    };
    let totalWeight = 0;

    // Calculate total weight
    Object.values(data.symbolWeights).forEach((weight) => {
      totalWeight += weight as number;
    });

    Object.entries(data.symbolWeights).forEach(([symbol, weight]) => {
      const normalizedWeight = (weight as number) / totalWeight;
      const iconType = symbolsToNumbers([symbol])[0];
      iconDropChances[iconType] = normalizedWeight;
    });

    // Transform threeOfAKindMultipliers to iconMultipliers
    const iconMultipliers: Record<SlotIconType, number> = {
      [SlotIconType.MEAT]: 0,
      [SlotIconType.CROCODILE]: 0,
      [SlotIconType.HEAD]: 0,
      [SlotIconType.TRUMP]: 0,
      [SlotIconType.SOLANA]: 0,
      [SlotIconType.AFEL]: 0,
    };
    Object.entries(data.threeOfAKindMultipliers).forEach(
      ([symbol, multiplier]) => {
        const iconType = symbolsToNumbers([symbol])[0];
        iconMultipliers[iconType] = multiplier as number;
      }
    );

    // Transform specialCombinations
    const specialCombinations = data.specialCombinations.map((combo) => ({
      combo: symbolsToNumbers([...combo.symbols]),
      multiplier: combo.multiplier,
    }));

    return {
      iconDropChances,
      iconMultipliers,
      specialCombinations,
      isLoading,
      error,
    };
  }, [data, isLoading, error]);
};
