import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// export async function getAllCoinGeckoData() {
//   try {
//     const response = await axios.get(process.env.COIN_GECKO_API_BASE_ROUTE! + `/coins/list?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY!}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching all coins data:', error);
//     return { error: 'Failed to fetch data' };
//   }
// }

export async function getPair(query: string) {
  try {
    const response = await axios.get(process.env.DEX_SCREENER_API_BASE_ROUTE! + `/latest/dex/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${query} coin data:`, error);
    return { error: 'Failed to fetch data' };
  }
}
