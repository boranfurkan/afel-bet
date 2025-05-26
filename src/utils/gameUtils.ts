import { SlotIconType } from '@/types/bet';

export function symbolsToNumbers(arr: string[]): SlotIconType[] {
  const numbers: number[] = [];

  arr.forEach((str) => {
    switch (str) {
      case 'LEMON':
        numbers.push(SlotIconType.MEAT);
        break;
      case 'ORANGE':
        numbers.push(SlotIconType.CROCODILE);
        break;
      case 'MEAT':
        numbers.push(SlotIconType.HEAD);
        break;
      case 'TRUMP':
        numbers.push(SlotIconType.TRUMP);
        break;
      case 'AFEL':
        numbers.push(SlotIconType.AFEL);
        break;
      case 'SOLANA':
        numbers.push(SlotIconType.SOLANA);
        break;
      default:
        throw new Error(`Unknown symbol: ${str}`);
    }
  });

  return numbers;
}
