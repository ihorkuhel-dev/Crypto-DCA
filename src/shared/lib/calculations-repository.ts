import { type Calculation, type InvestmentTransaction, db } from './dexie-db';

export const calculationsRepository = {
  list: () =>
    db.calculations
      .orderBy('createdAt')
      .toArray()
      .then((arr) => arr.toReversed()),
  getById: (id: string) => db.calculations.get(id),
  getTransactions: (calculationId: string) =>
    db.transactions.where('calculationId').equals(calculationId).sortBy('date'),

  async create(calculation: Calculation, transactions: InvestmentTransaction[]): Promise<void> {
    await db.transaction('rw', db.calculations, db.transactions, async () => {
      await db.calculations.add(calculation);
      await db.transactions.bulkAdd(transactions);
    });
  },

  async update(
    id: string,
    calculation: Calculation,
    transactions: InvestmentTransaction[],
  ): Promise<void> {
    await db.transaction('rw', db.calculations, db.transactions, async () => {
      await db.calculations.put(calculation);
      await db.transactions.where('calculationId').equals(id).delete();
      await db.transactions.bulkAdd(transactions);
    });
  },

  async remove(id: string): Promise<void> {
    await db.transaction('rw', db.calculations, db.transactions, async () => {
      await db.calculations.delete(id);
      await db.transactions.where('calculationId').equals(id).delete();
    });
  },
};
