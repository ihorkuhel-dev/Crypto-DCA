const BASE_URL = 'https://api.binance.com/api/v3';

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
    limit = 1000,
  ): Promise<BinanceKline[]> {
    let url = `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    if (startTime !== undefined) url += `&startTime=${startTime}`;
    if (endTime !== undefined) url += `&endTime=${endTime}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance Klines error: ${res.status}`);
    const json: unknown[][] = await res.json();

    return json.map((kline) => ({
      timestamp: Number(kline[0]),
      price: parseFloat(String(kline[4])), // Цена закрытия свечи
    }));
  },

  async getExchangeInfo(): Promise<{ symbol: string; baseAsset: string }[]> {
    const res = await fetch(`${BASE_URL}/ticker/24hr`);
    if (!res.ok) throw new Error(`Binance ticker 24hr error: ${res.status}`);
    const json: {
      symbol: string;
      quoteVolume: string;
    }[] = await res.json();

    return json
      .filter((s) => s.symbol.endsWith('USDT') && parseFloat(s.quoteVolume) > 0)
      .toSorted((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .map((s) => ({
        symbol: s.symbol,
        baseAsset: s.symbol.replace('USDT', ''),
      }));
  },

  async getEarliestAvailableDate(symbol: string): Promise<number | null> {
    try {
      // Запрашиваем первую месячную свечу начиная с 0 (начало эпохи Unix).
      // Это надёжный способ получить дату листинга монеты на Binance.
      // ВАЖНО: startTime=0 должен быть передан явно, поэтому используется !== undefined.
      const res = await fetch(
        `${BASE_URL}/klines?symbol=${symbol}&interval=1M&limit=1&startTime=0`,
      );
      if (!res.ok) throw new Error(`Binance Klines error: ${res.status}`);
      const json: unknown[][] = await res.json();
      if (json.length > 0) {
        return Number(json[0][0]);
      }
    } catch (e) {
      console.error('Failed to get inception date', e);
    }
    return null;
  },
};
