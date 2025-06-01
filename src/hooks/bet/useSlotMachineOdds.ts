import { useGamesPublicControllerGetSlotMachineOdds } from '@/api';
import { SlotIconType } from '@/types/bet';
import { useMemo } from 'react';

export interface SlotMachineOddsResponse {
  symbolWeights: Record<string, number>;
  threeOfAKindMultipliers: Record<string, number>;
  specialCombinations: {
    symbols: string[];
    multiplier: number;
  }[];
  freeSpinCombination: number[];
  symbolNumbers: Record<string, number>;
}

export interface SlotMachineOdds {
  iconDropChances: Record<SlotIconType, number>;
  iconMultipliers: Record<SlotIconType, number>;
  specialCombinations: {
    combo: SlotIconType[];
    multiplier: number;
  }[];
  freeSpinCombination: SlotIconType[];
  isLoading: boolean;
  error: unknown;
}

export const useSlotMachineOdds = (): SlotMachineOdds => {
  const { data, isLoading, error } =
    useGamesPublicControllerGetSlotMachineOdds();

  return useMemo(() => {
    const fallbackIconDropChances: Record<SlotIconType, number> = {
      [SlotIconType.MEAT]: 0.35,
      [SlotIconType.CROCODILE]: 0.338,
      [SlotIconType.HEAD]: 0.263,
      [SlotIconType.TRUMP]: 0.181,
      [SlotIconType.SOLANA]: 0.088,
      [SlotIconType.AFEL]: 0.031,
    };

    const fallbackIconMultipliers: Record<SlotIconType, number> = {
      [SlotIconType.MEAT]: 1.2,
      [SlotIconType.CROCODILE]: 1.3,
      [SlotIconType.HEAD]: 2,
      [SlotIconType.TRUMP]: 3,
      [SlotIconType.SOLANA]: 10,
      [SlotIconType.AFEL]: 15,
    };

    const fallbackSpecialCombinations = [
      {
        combo: [SlotIconType.HEAD, SlotIconType.SOLANA, SlotIconType.AFEL],
        multiplier: 4,
      },
      {
        combo: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.CROCODILE,
        ],
        multiplier: 1.6,
      },
      {
        combo: [SlotIconType.HEAD, SlotIconType.TRUMP, SlotIconType.HEAD],
        multiplier: 2.5,
      },
      {
        combo: [SlotIconType.CROCODILE, SlotIconType.SOLANA, SlotIconType.AFEL],
        multiplier: 3.5,
      },
      {
        combo: [SlotIconType.TRUMP, SlotIconType.AFEL, SlotIconType.SOLANA],
        multiplier: 4,
      },
      {
        combo: [SlotIconType.MEAT, SlotIconType.MEAT, SlotIconType.CROCODILE],
        multiplier: 1.3,
      },
    ];

    const fallbackFreeSpinCombination = [
      SlotIconType.CROCODILE,
      SlotIconType.CROCODILE,
      SlotIconType.CROCODILE,
    ];

    if (!data) {
      return {
        iconDropChances: fallbackIconDropChances,
        iconMultipliers: fallbackIconMultipliers,
        specialCombinations: fallbackSpecialCombinations,
        freeSpinCombination: fallbackFreeSpinCombination,
        isLoading,
        error,
      };
    }

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
      const iconType = data.symbolNumbers[symbol] as SlotIconType;
      if (iconType) {
        iconDropChances[iconType] = normalizedWeight;
      }
    });

    // Transform threeOfAKindMultipliers to iconMultipliers using symbolNumbers mapping
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
        const iconType = data.symbolNumbers[symbol] as SlotIconType;
        if (iconType) {
          iconMultipliers[iconType] = multiplier as number;
        }
      }
    );

    // Transform specialCombinations using symbolNumbers mapping
    const specialCombinations = data.specialCombinations.map((combo) => ({
      combo: combo.symbols.map(
        (symbol) => data.symbolNumbers[symbol] as SlotIconType
      ),
      multiplier: combo.multiplier,
    }));

    const freeSpinCombination = data.freeSpinCombination.map(
      (iconNumber) => iconNumber as SlotIconType
    );

    return {
      iconDropChances,
      iconMultipliers,
      specialCombinations,
      freeSpinCombination,
      isLoading,
      error,
    };
  }, [data, isLoading, error]);
};
