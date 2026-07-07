const BASE_URL = '[https://api.binance.com/api/v3](https://api.binance.com/api/v3)';

export interface BinanceKline {
  timestamp: number;
  price: number;
}

export const binanceClient = {
  async getCurrentPrice(symbol: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/ticker/price?symbol=${symbol}`);
    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
    const json: { price: string } = await res.json();
    return parseFloat(json.price);
  },

  async getKlines(
    symbol: string,
    interval: string,
    startTime?: number,
    endTime?: number,
  ): Promise<BinanceKline[]> {
    let url = `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=1000`;
    if (startTime) url += `&startTime=${startTime}`;
    if (endTime) url += `&endTime=${endTime}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance Klines error: ${res.status}`);
    const json: unknown[][] = await res.json();

    return json.map((kline) => ({
      timestamp: Number(kline[0]),
      price: parseFloat(String(kline[4])), // Цена закрытия свечи
    }));
  },
};
