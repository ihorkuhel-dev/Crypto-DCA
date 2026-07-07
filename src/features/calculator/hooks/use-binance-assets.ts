import { useEffect, useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { binanceClient } from '@/shared/lib/binance-client.ts';
import { db } from '@/shared/lib/dexie-db.ts';

export interface BinanceAsset {
  symbol: string;
  baseAsset: string;
  rank: number;
}

const ASSETS_CACHE_TTL_MS = 30 * 60 * 1000;
const VIRTUAL_THRESHOLD = 20;

export function useBinanceAssets() {
  const [assets, setAssets] = useState<BinanceAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      try {
        const [sample] = await db.cachedAssets.limit(1).toArray();
        const now = Date.now();

        if (sample && now - sample.cachedAt < ASSETS_CACHE_TTL_MS) {
          const cached = await db.cachedAssets.orderBy('rank').toArray();
          if (active) setAssets(cached);
        } else {
          const fresh = await binanceClient.getExchangeInfo();
          const cachedAt = Date.now();
          const records = fresh.map((f, index) => ({
            symbol: f.symbol,
            baseAsset: f.baseAsset,
            rank: index,
            cachedAt,
          }));
          await db.cachedAssets.clear();
          await db.cachedAssets.bulkPut(records);
          if (active) setAssets(records);
        }
      } catch (err) {
        console.error('Failed to load Binance assets', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { assets, isLoading };
}

export function useFilteredAssets(assets: BinanceAsset[], searchQuery: string) {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return assets;
    return assets.filter(
      (a) => a.symbol.toLowerCase().includes(query) || a.baseAsset.toLowerCase().includes(query),
    );
  }, [assets, searchQuery]);
}

export function useAssetVirtualizer(count: number, scrollEl: HTMLDivElement | null) {
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollEl,
    estimateSize: () => 36,
    overscan: 8,
  });

  return {
    virtualizer,
    isVirtual: count > VIRTUAL_THRESHOLD,
  };
}
