export type Coin = {
  id: string;
  symbol: string;
  name: string;
};

export type EnhanchedCoin = Coin & {
  market_cap_rank: string;
  total_volume: string;
  current_price: string;
};

export type MessageType = 'COMMAND' | 'PROMPT' | 'ADDRESS';