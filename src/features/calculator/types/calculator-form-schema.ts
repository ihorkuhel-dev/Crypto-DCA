import * as z from 'zod';

export const getFormSchema = (t: (key: string) => string) =>
  z
    .object({
      symbol: z.string().min(1, t('validation.symbol')),
      totalCapitalUsd: z.number().min(10, t('validation.capital')),
      startDate: z.string().refine((val) => {
        const ts = new Date(val).getTime();
        return !isNaN(ts) && ts < Date.now();
      }, t('validation.startDate')),
      endDate: z.string().refine((val) => {
        const ts = new Date(val).getTime();
        return !isNaN(ts) && ts <= Date.now();
      }, t('validation.endDateError')),
      frequency: z.enum(['1d', '3d', '7d', '1m']),
      stakingEnabled: z.boolean(),
      stakingMode: z.enum(['simple', 'compound']).nullable().optional(),
      compoundingFrequency: z.enum(['daily', 'monthly', 'yearly']).nullable().optional(),
      apyPercent: z.number().min(0, t('validation.apy')).max(100).nullable().optional(),
    })
    .refine(
      (data) => {
        const startTs = new Date(data.startDate).getTime();
        const endTs = new Date(data.endDate).getTime();
        return startTs <= endTs;
      },
      {
        message: t('validation.dateRange'),
        path: ['startDate'],
      },
    );

export type CalculatorFormSchema = ReturnType<typeof getFormSchema>;
