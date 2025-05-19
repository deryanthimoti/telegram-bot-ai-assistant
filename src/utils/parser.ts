export function parseCoinCommand(text: string): { coinId: string } | null {
  const regex = /(?:What's the price of|What's the current price of|Check for) (.+)\?/i;
  const match = text.match(regex);

  if (match) {
    const [, coinId] = match;
    return {
      coinId,
    };
  }

  return null;
}
