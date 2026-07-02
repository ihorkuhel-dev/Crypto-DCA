import Dexie, { type EntityTable } from 'dexie';

export interface Calculation {
  id: string;
  coinId: string;
  coinSymbol: string;
  totalCapitalUsd: number;
  startDate: string;
  frequency: 'daily' | 'weekly' | 'monthly';
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

export const db = new Dexie('dca-calculator') as Dexie & {
  calculations: EntityTable<Calculation, 'id'>;
  transactions: EntityTable<InvestmentTransaction, 'id'>;
};

db.version(1).stores({
  calculations: 'id, coinId, createdAt',
  transactions: 'id, calculationId, date',
});
