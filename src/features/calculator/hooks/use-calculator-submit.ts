import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { calculationsRepository } from '@/shared/lib/calculations-repository.ts';
import { type Calculation } from '@/shared/lib/dexie-db.ts';
import { syncKlines } from '../utils/sync-klines.ts';
import { simulateDca } from '../utils/simulate-dca.ts';
import { getFormSchema } from '../types/calculator-form-schema.ts';

type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

interface SubmitOptions {
  isEditMode: boolean;
  id: string | undefined;
  existingCalculation: Calculation | null | undefined;
}

export function useCalculatorSubmit({ isEditMode, id, existingCalculation }: SubmitOptions) {
  const { t } = useTranslation('calculator');
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const startTs = new Date(values.startDate).getTime();

        await syncKlines(values.symbol, startTs);

        const { calculation, transactions } = await simulateDca({
          id: isEditMode ? id : undefined,
          symbol: values.symbol,
          totalCapitalUsd: values.totalCapitalUsd,
          startDate: values.startDate,
          endDate: values.endDate,
          frequency: values.frequency,
          stakingEnabled: values.stakingEnabled,
          stakingMode: values.stakingEnabled ? (values.stakingMode ?? null) : null,
          compoundingFrequency:
            values.stakingEnabled && values.stakingMode === 'compound'
              ? (values.compoundingFrequency ?? null)
              : null,
          apyPercent: values.stakingEnabled ? (values.apyPercent ?? null) : null,
          existingCreatedAt: existingCalculation?.createdAt,
        });

        if (isEditMode && id) {
          await calculationsRepository.update(id, calculation, transactions);
          toast.success(t('toast.updated'));
        } else {
          await calculationsRepository.create(calculation, transactions);
          toast.success(t('toast.created'));
        }

        await navigate({
          to: '/calculations/$id',
          params: { id: calculation.id },
        });
      } catch (error) {
        console.error(error);
        toast.error(t('toast.error'));
      }
    },
    [isEditMode, id, existingCalculation, t, navigate],
  );

  return { onSubmit };
}
