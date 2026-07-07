import {z} from 'zod';

export const calculatorFormSchema = z
  .object({
    symbol: z.string().min(1, 'Выберите торговую пару (например, BTCUSDT)'),
    totalCapitalUsd: z.number().positive('Сумма должна быть больше нуля'),
    startDate: z.string().date(),
    frequency: z.enum(['1d', '3d', '7d', '1m']),
    stakingEnabled: z.boolean(),
    stakingMode: z.enum(['simple', 'compound']).nullable(),
    compoundingFrequency: z.enum(['daily', 'monthly', 'yearly']).nullable(),
    apyPercent: z.number().min(0).max(100).nullable(),
  })
  .refine((data) => !data.stakingEnabled || data.stakingMode !== null, {
    message: 'Выберите режим стейкинга',
    path: ['stakingMode'],
  })
  .refine(
    (data) =>
      !data.stakingEnabled || data.stakingMode !== 'compound' || data.compoundingFrequency !== null,
    { message: 'Выберите периодичность капитализации', path: ['compoundingFrequency'] },
  );

export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;
