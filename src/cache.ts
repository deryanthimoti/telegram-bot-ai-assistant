import { PrismaClient } from '@prisma/client';
import { getCoinList } from './services/coinGecko';
import { getDexMarketData } from './services/dexScreener';

import type { Coin } from './types';
const prisma = new PrismaClient();

export async function caching(coinId: string): Promise<any | null> {
  const today = new Date();
  const nextThreeDays = new Date(today.setDate(today.getDate() + 3));
  let returnVal: any | null = null;

  const cacheData = await prisma.cache.findFirst({
    where: {
      coinId: coinId,
    }
  });
  
  if (!cacheData) {
    const coinList = await getCoinList();
    
    // We need to get the exact coin ID based on the symbol, so we filtered it manually
    let ret: any[] = coinList.filter((c: Coin) => c.symbol === coinId);

    if (ret.length > 0) {
      const enhancedRet: any[] = await Promise.all(ret.map(async item => {
        const marketData = await getDexMarketData(item.id);
        return {
          ...item,
          totalVolume: marketData ? marketData!.totalVolume : 0,
          currentPrice: marketData ? marketData!.currentPrice : 0,
          liquidity: marketData ? marketData!.liquidity : 0,
        }
      }));

      // Get the most appropriate result based on total volume, current price, and liquidity
      const result = enhancedRet.sort((a: any, b: any) => b.totalVolume - a.totalVolume || b.liquidity - a.liquidity || b.currentPrice - a.currentPrice)[0]
      
      await prisma.cache.create({
        data: {
          coinId: result.id,
          coinSymbol: result.symbol,
          coinName: result.name,
          deletedAt: nextThreeDays,
        }
      });
      returnVal = result;
    }
  } else {
    await prisma.cache.update({
      where: {
        id: cacheData.id
      },
      data: {
        deletedAt: nextThreeDays,
      },
    });
    const marketData = await getDexMarketData(cacheData.coinId);
    returnVal = {
      coinId: cacheData.id,
      total_volume: marketData ? marketData!.total_volume : 0,
      current_price: marketData ? marketData!.current_price : 0,
      liquidity: marketData ? marketData!.liquidity : 0,
    };
  }
  
  return Promise.resolve(returnVal);
};
