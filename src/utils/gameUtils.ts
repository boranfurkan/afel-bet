export function symbolsToNumbers(arr: string[]): number[] {
  const uniqueStrings = Array.from(new Set(arr));

  const stringToNumberMap = new Map<string, number>();

  const numbers = Array.from({ length: uniqueStrings.length }, (_, i) => i + 1);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  uniqueStrings.forEach((str, index) => {
    stringToNumberMap.set(str, numbers[index]);
  });

  return arr.map((str) => stringToNumberMap.get(str)!);
}
