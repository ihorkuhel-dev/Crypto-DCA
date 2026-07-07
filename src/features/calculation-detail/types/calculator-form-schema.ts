import { z } from 'zod';

export const calculatorFormSchema = z
  .object({
    coinId: z.string().min(1, 'Выберите монету'),
    coinSymbol: z.string().min(1),
    totalCapitalUsd: z.number().positive('Сумма должна быть больше нуля'),
    startDate: z.string().date(),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
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
