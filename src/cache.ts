import { PrismaClient } from '@prisma/client';
import { getCoinList } from './services/coinGecko';
import { getDexMarketData } from './services/dexScreener';
import { multiSort } from './utils/generic';

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
    let ret: any[] = coinList.filter((c: Coin) => c.symbol.toLowerCase().includes(coinId) || c.name.toLowerCase().includes(coinId));

    if (ret.length > 0) {
      const enhancedRet: any[] = await Promise.all(ret.map(async item => {
        const marketData = await getDexMarketData(item.id);
        return {
          ...item,
          totalVolume: marketData ? marketData?.totalVolume : 0,
          currentPrice: marketData ? marketData?.currentPrice : 0,
          liquidity: marketData ? marketData!.liquidity : 0,
        }
      }));

      // Get the most appropriate result based on total volume, current price, and liquidity
      const result = multiSort(enhancedRet, [{ key: 'liquidity', direction: 'desc' }, { key: 'totalVolume', direction: 'desc' }, { key: 'currentPrice', direction: 'desc' }]);
      
      await prisma.cache.create({
        data: {
          coinId: result[0].id,
          coinSymbol: result[0].symbol,
          coinName: result[0].name,
          deletedAt: nextThreeDays,
        }
      });
      returnVal = result[0];
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
      total_volume: marketData ? marketData!.totalVolume : 0,
      current_price: marketData ? marketData!.currentPrice : 0,
      liquidity: marketData ? marketData!.liquidity : 0,
    };
  }
  
  return Promise.resolve(returnVal);
};
