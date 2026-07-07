import { binanceClient } from '@/shared/lib/binance-client';
import { db } from '@/shared/lib/dexie-db';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function syncKlines(
  symbol: string,
  startDateTs: number,
  interval = '1d',
): Promise<void> {
  const todayTs = Date.now();
  const cached = await db.klines.where('symbol').equals(symbol).sortBy('timestamp');

  if (cached.length === 0) {
    await fetchAndStore(symbol, interval, startDateTs, todayTs);
    return;
  }

  const minCached = cached[0].timestamp;
  const maxCached = cached[cached.length - 1].timestamp;

  const needHistorical = startDateTs < minCached;
  const needRecent = todayTs - maxCached > DAY_MS;

  const fetches: Promise<void>[] = [];

  if (needHistorical) {
    fetches.push(fetchAndStore(symbol, interval, startDateTs, minCached));
  }

  if (needRecent) {
    fetches.push(fetchAndStore(symbol, interval, maxCached, todayTs));
  }

  if (fetches.length > 0) {
    await Promise.all(fetches);
  }
}

async function fetchAndStore(
  symbol: string,
  interval: string,
  from: number,
  to: number,
): Promise<void> {
  const points = await binanceClient.getKlines(symbol, interval, from, to);
  const records = points.map((p) => ({
    symbol,
    timestamp: p.timestamp,
    price: p.price,
  }));
  await db.klines.bulkPut(records);
}
