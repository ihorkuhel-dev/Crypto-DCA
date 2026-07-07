import Dexie, {type Table} from 'dexie';

export interface Calculation {
  id: string;
  symbol: string;
  totalCapitalUsd: number;
  startDate: string;
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

export class DcaDatabase extends Dexie {
  calculations!: Table<Calculation, string>;
  transactions!: Table<InvestmentTransaction, string>;
  klines!: Table<KlineRecord, [string, number]>;

  constructor() {
    super('dca-calculator');

    this.version(1).stores({
      calculations: 'id, symbol, createdAt',
      transactions: 'id, calculationId, date',
      klines: '[symbol+timestamp], symbol, timestamp',
    });
  }
}

export const db = new DcaDatabase();
