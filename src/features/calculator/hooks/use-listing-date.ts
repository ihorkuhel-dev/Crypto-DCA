import { useEffect, useMemo, useState } from 'react';

import { binanceClient } from '@/shared/lib/binance-client.ts';
import { db } from '@/shared/lib/dexie-db.ts';

export function useListingDate(symbol: string | undefined) {
  const [listingTimestamp, setListingTimestamp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (symbol) {
      setIsLoading(true);

      db.cachedListingDates
        .get(symbol)
        .then((cached) => {
          if (!active) return;
          if (cached) {
            setListingTimestamp(cached.listingTimestamp);
            setIsLoading(false);
          } else {
            binanceClient
              .getEarliestAvailableDate(symbol)
              .then((timestamp) => {
                if (!active) return;
                if (timestamp !== null) {
                  void db.cachedListingDates.put({ symbol, listingTimestamp: timestamp });
                }
                setListingTimestamp(timestamp);
                setIsLoading(false);
              })
              .catch((e) => {
                console.error(e);
                if (active) {
                  setListingTimestamp(null);
                  setIsLoading(false);
                }
              });
          }
        })
        .catch((e) => {
          console.error(e);
          if (active) {
            setListingTimestamp(null);
            setIsLoading(false);
          }
        });
    }

    return () => {
      active = false;
    };
  }, [symbol]);

  const resolvedTimestamp = useMemo(
    () => (symbol ? listingTimestamp : null),
    [symbol, listingTimestamp],
  );

  const listingDateStr = resolvedTimestamp
    ? new Date(resolvedTimestamp).toISOString().split('T')[0]
    : undefined;

  return { listingTimestamp: resolvedTimestamp, listingDateStr, isLoading };
}
