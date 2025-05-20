import axios from 'axios';

export async function getDexMarketData(symbol: string): Promise<any | null> {
  try {
    const { data } = await axios.get(`https://api.dexscreener.com/latest/dex/search/?q=${symbol}`);
    const matches = data.pairs;
    if (!matches || matches.length === 0) return null;

    // Pick the pair with highest liquidity
    const best = matches.sort((a: any, b: any) => b.priceUsd - a.priceUsd || b.liquidity.usd - a.liquidity.usd || b.volume.h24 - a.volume.h24)[0];
    return {
      liquidity: best?.liquidity?.usd || null,
      currentPrice: best?.priceUsd || null,
      totalVolume: best?.volume.h24 || null,
    }
  } catch {
    return null;
  }
}
