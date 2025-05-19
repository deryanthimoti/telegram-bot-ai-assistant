import { PrismaClient } from '@prisma/client';
import { getAllCoinGeckoData } from './services/coinGecko';

import type { Coin } from './types';
const prisma = new PrismaClient();

export async function addToCache(coinId: string): Promise<string | null> {
  const today = new Date();
  const nextThreeDays = new Date(today.setDate(today.getDate() + 3));
  let returnVal: string | null = null;

  const cacheData = await prisma.cache.findFirst({
    where: {
      coinId,
    }
  });
  
  if (!cacheData) {
    const coinsList = await getAllCoinGeckoData();
    // We need to get the exact coin ID based on the symbol, so we filtered it manually
    const ret = coinsList.filter((c: Coin) => c.symbol === coinId);

    if (ret.length > 0) {
      await prisma.cache.create({
        data: {
          coinId: ret[0].id,
          deletedAt: nextThreeDays,
        }
      });
      returnVal = ret[0].id;
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
    returnVal = cacheData.coinId;
  }
  
  return Promise.resolve(returnVal);
};