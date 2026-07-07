import { type Calculation, type InvestmentTransaction, db } from '@/shared/lib/dexie-db';

interface SimulateDcaParams {
  id?: string;
  symbol: string;
  totalCapitalUsd: number;
  startDate: string;
  endDate: string;
  frequency: '1d' | '3d' | '7d' | '1m';
  stakingEnabled: boolean;
  stakingMode: 'simple' | 'compound' | null;
  compoundingFrequency: 'daily' | 'monthly' | 'yearly' | null;
  apyPercent: number | null;
  existingCreatedAt?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Генерирует список временных меток DCA-покупок.
 * Вынесена в чистую функцию для изолированного тестирования.
 */
function generatePurchaseDates(start: number, end: number, frequency: string): number[] {
  const dates: number[] = [];
  let current = start;

  const advance: Record<string, (ts: number) => number> = {
    '1d': (ts) => ts + DAY_MS,
    '3d': (ts) => ts + 3 * DAY_MS,
    '7d': (ts) => ts + 7 * DAY_MS,
    '1m': (ts) => {
      const d = new Date(ts);
      d.setMonth(d.getMonth() + 1);
      return d.getTime();
    },
  };

  const getNext = advance[frequency] ?? ((ts) => ts + DAY_MS);

  while (current <= end) {
    dates.push(current);
    current = getNext(current);
  }

  return dates.length > 0 ? dates : [end];
}

/**
 * Строит Map<нормализованный_timestamp → price> из массива klines.
 * Нормализуем к началу суток (floor to day) для быстрого поиска O(1).
 */
function buildKlinesMap(klines: { timestamp: number; price: number }[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const kl of klines) {
    const dayKey = Math.floor(kl.timestamp / DAY_MS) * DAY_MS;
    map.set(dayKey, kl.price);
  }
  return map;
}

/**
 * Ищет цену на дату `ts`. Сначала точное совпадение, затем ближайшее в пределах ±3 дней.
 * Сложность: O(1) для точного совпадения, O(k) для поиска ближайшего (k≤6 итераций).
 */
function findPrice(map: Map<number, number>, ts: number, fallback: number): number {
  const dayKey = Math.floor(ts / DAY_MS) * DAY_MS;
  if (map.has(dayKey)) return map.get(dayKey)!;

  // Ищем в ±3 дней от даты
  for (let offset = 1; offset <= 3; offset++) {
    const prev = map.get(dayKey - offset * DAY_MS);
    if (prev !== undefined) return prev;
    const next = map.get(dayKey + offset * DAY_MS);
    if (next !== undefined) return next;
  }

  return fallback;
}

export async function simulateDca({
  id,
  symbol,
  totalCapitalUsd,
  startDate,
  endDate,
  frequency,
  stakingEnabled,
  stakingMode,
  compoundingFrequency,
  apyPercent,
  existingCreatedAt,
}: SimulateDcaParams): Promise<{
  calculation: Calculation;
  transactions: InvestmentTransaction[];
}> {
  const startTs = new Date(startDate).getTime();
  const endTs = new Date(endDate).getTime();

  // Загружаем котировки и строим O(1)-Map вместо O(n) find в цикле
  const klines = await db.klines.where('symbol').equals(symbol).sortBy('timestamp');
  const klinesMap = buildKlinesMap(klines);
  const lastKlinePrice = klines.at(-1)?.price ?? 1;

  const purchaseTimestamps = generatePurchaseDates(startTs, endTs, frequency);
  const txAmount = totalCapitalUsd / purchaseTimestamps.length;
  const transactions: InvestmentTransaction[] = [];

  let accumulatedCoinsBought = 0;
  let accumulatedStakingRewards = 0;
  let activeStakingBalance = 0;
  let lastStakingCalculationTs = startTs;

  const r = (apyPercent ?? 0) / 100;
  const calculationId = id ?? crypto.randomUUID();

  for (let k = 0; k < purchaseTimestamps.length; k++) {
    const ts = purchaseTimestamps[k];
    const coinPrice = findPrice(klinesMap, ts, lastKlinePrice);
    const coinsBought = coinPrice > 0 ? txAmount / coinPrice : 0;

    // Считаем стейкинг-доход за прошедший период
    if (stakingEnabled && k > 0 && r > 0) {
      const days = (ts - lastStakingCalculationTs) / DAY_MS;

      if (stakingMode === 'simple') {
        accumulatedStakingRewards += accumulatedCoinsBought * r * (days / 365);
      } else if (stakingMode === 'compound') {
        const compoundedBalance =
          compoundingFrequency === 'daily'
            ? activeStakingBalance * Math.pow(1 + r / 365, days)
            : compoundingFrequency === 'monthly'
              ? activeStakingBalance * Math.pow(1 + r / 12, days / 30.4375)
              : activeStakingBalance * Math.pow(1 + r, days / 365);

        accumulatedStakingRewards += compoundedBalance - activeStakingBalance;
        activeStakingBalance = compoundedBalance;
      }
    }

    accumulatedCoinsBought += coinsBought;
    activeStakingBalance += coinsBought;
    lastStakingCalculationTs = ts;

    const coinBalanceAfter =
      stakingMode === 'compound'
        ? activeStakingBalance
        : accumulatedCoinsBought + accumulatedStakingRewards;

    transactions.push({
      id: crypto.randomUUID(),
      calculationId,
      date: new Date(ts).toISOString(),
      coinPriceUsdAtDate: coinPrice,
      amountSpentUsd: txAmount,
      coinBalanceAfter,
    });
  }

  const calculation: Calculation = {
    id: calculationId,
    symbol,
    totalCapitalUsd,
    startDate,
    endDate,
    frequency,
    stakingEnabled,
    stakingMode,
    compoundingFrequency,
    apyPercent,
    createdAt: existingCreatedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { calculation, transactions };
}
