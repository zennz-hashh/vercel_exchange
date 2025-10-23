// utils/market.ts
// Fetch real-time prices for BNB, BASE, ETH, SOL, BTC from CoinGecko

export type MarketPrices = {
  bnb: number;
  base: number;
  eth: number;
  sol: number;
  btc: number;
};

export async function fetchMarketPrices(): Promise<MarketPrices | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,base-protocol,ethereum,solana,bitcoin&vs_currencies=usd'
    );
    const data = await res.json();
    return {
      bnb: data.binancecoin.usd,
      base: data['base-protocol']?.usd || 0,
      eth: data.ethereum.usd,
      sol: data.solana.usd,
      btc: data.bitcoin.usd,
    };
  } catch {
    return null;
  }
}
