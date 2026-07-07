import Dexie, { type Table } from 'dexie';

export interface Calculation {
  id: string;
  symbol: string;
  totalCapitalUsd: number;
  startDate: string;
  endDate: string;
  frequency: '1d' | '3d' | '7d' | '1m';
  stakingEnabled: boolean;
  stakingMode: 'simple' | 'compound' | null;
  compoundingFrequency: 'daily' | 'monthly' | 'yearly' | null;
  apyPercent: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentTransaction {
  id: string;
  calculationId: string;
  date: string;
  coinPriceUsdAtDate: number;
  amountSpentUsd: number;
  coinBalanceAfter: number;
}

export interface KlineRecord {
  symbol: string;
  timestamp: number;
  price: number;
}

/**
 * rank — порядковый номер монеты по объёму торгов (0 = наибольший объём).
 * Используется для восстановления правильного порядка при чтении из кэша,
 * поскольку Dexie возвращает записи по primary key (symbol = алфавитно).
 */
export interface CachedAsset {
  symbol: string;
  baseAsset: string;
  rank: number;
  cachedAt: number;
}

/**
 * Кэш дат листинга монет на Binance (первая месячная свеча).
 * Дата листинга — историческая константа, она никогда не изменится.
 * Поэтому TTL не используется: запись хранится бессрочно.
 */
export interface CachedListingDate {
  symbol: string;
  listingTimestamp: number;
}

export class DcaDatabase extends Dexie {
  calculations!: Table<Calculation, string>;
  transactions!: Table<InvestmentTransaction, string>;
  klines!: Table<KlineRecord, [string, number]>;
  cachedAssets!: Table<CachedAsset, string>;
  cachedListingDates!: Table<CachedListingDate, string>;

  constructor() {
    super('dca-calculator');

    this.version(1).stores({
      calculations: 'id, symbol, createdAt',
      transactions: 'id, calculationId, date',
      klines: '[symbol+timestamp], symbol, timestamp',
    });

    this.version(2).stores({
      calculations: 'id, symbol, createdAt',
      transactions: 'id, calculationId, date',
      klines: '[symbol+timestamp], symbol, timestamp',
      cachedAssets: 'symbol, cachedAt',
    });

    this.version(3).stores({
      calculations: 'id, symbol, createdAt',
      transactions: 'id, calculationId, date',
      klines: '[symbol+timestamp], symbol, timestamp',
      // rank добавлен в v3 — полная очистка таблицы при первом запуске (bulkPut пересоздаёт)
      cachedAssets: 'symbol, rank, cachedAt',
      // cachedListingDates: только symbol как PK, TTL не нужен (дата листинга — константа)
      cachedListingDates: 'symbol',
    });
  }
}

export const db = new DcaDatabase();
