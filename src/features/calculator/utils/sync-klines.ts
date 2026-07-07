import {binanceClient} from '@/shared/lib/binance-client';
import {db} from '@/shared/lib/dexie-db';

export async function syncKlines(
  symbol: string,
  startDateTs: number,
  interval = '1d',
): Promise<void> {
  const todayTs = Date.now();
  const cached = await db.klines.where('symbol').equals(symbol).sortBy('timestamp');

  let needFetch = false;
  let fetchStart = startDateTs;
  let fetchEnd = todayTs;

  if (cached.length > 0) {
    const minCached = cached[0].timestamp;
    const maxCached = cached[cached.length - 1].timestamp;

    if (startDateTs < minCached) {
      needFetch = true;
      fetchEnd = minCached;
    } else if (todayTs - maxCached > 24 * 60 * 60 * 1000) {
      needFetch = true;
      fetchStart = maxCached;
    }
  } else {
    needFetch = true;
  }

  if (needFetch) {
    const points = await binanceClient.getKlines(symbol, interval, fetchStart, fetchEnd);
    const records = points.map((p) => ({
      symbol,
      timestamp: p.timestamp,
      price: p.price,
    }));
    await db.klines.bulkPut(records);
  }
}
