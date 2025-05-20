import axios from 'axios';

const DEX_SCREENER_API_BASE_ROUTE = "https://api.dexscreener.com"

export async function getDexMarketData(symbol: string): Promise<any | null> {
  try {
    const { data } = await axios.get(`${DEX_SCREENER_API_BASE_ROUTE}/latest/dex/search/?q=${symbol}`);
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

export async function getDexMarketDataByTokenAddress(tokenAddress: string): Promise<any | null> {
  try {
    const { data } = await axios.get(`${DEX_SCREENER_API_BASE_ROUTE}/tokens/v1/solana/${tokenAddress}`);
    return {
      name: data[0].baseToken.name,
      chainId: data[0].chainId,
      liquidity: data[0].liquidity.usd,
      currentPrice: data[0].priceUsd,
      totalVolume: data[0].volume.h24,
    }
  } catch {
    return null;
  }
}
