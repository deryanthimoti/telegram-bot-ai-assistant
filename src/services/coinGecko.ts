import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const COIN_GECKO_API_BASE_ROUTE = "https://api.coingecko.com/api/v3";

export async function getCoinList() {
  try {
    const { data } = await axios.get(`${COIN_GECKO_API_BASE_ROUTE}/coins/list?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY!}`);
    return data;
  } catch (error) {
    console.error('Error fetching all coins data:', error);
    return { error: 'Failed to fetch data' };
  }
}

export async function getMarketData(coinId: string) {
  try {
    const { data } = await axios.get(`${COIN_GECKO_API_BASE_ROUTE}/coins/${coinId}?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY!}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return {
      market_cap_rank: data.market_cap_rank,
      current_price: data.market_data.current_price.usd,
      total_volume: data.market_data.total_volume.usd,
    }
  } catch (error) {
    console.error(`Error fetching ${coinId} coin data:`, error);
    return { error: 'Failed to fetch data' };
  }
}

export async function getMarketDataByTokenAddress(id: string, address: string) {
  try {
    const response = await axios.get(COIN_GECKO_API_BASE_ROUTE + `/simple/token_price/${id}?contract_addresses=${address}&x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY!}`)
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${address} token address data:`, error);
    return { error: 'Failed to fetch data' };
  }
}
