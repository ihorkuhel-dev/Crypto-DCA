import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useLiveQuery } from 'dexie-react-hooks';

import { type Calculation } from '@/shared/lib/dexie-db.ts';
import { calculationsRepository } from '@/shared/lib/calculations-repository.ts';
import { getFormSchema } from '../types/calculator-form-schema.ts';

function getDefaultValues() {
  const now = Date.now();
  return {
    symbol: 'BTCUSDT',
    totalCapitalUsd: 1000,
    startDate: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(now).toISOString().split('T')[0],
    frequency: '7d' as const,
    stakingEnabled: false,
    stakingMode: 'simple' as const,
    compoundingFrequency: 'daily' as const,
    apyPercent: 4,
  };
}

export function useCalculatorForm(id: string | undefined) {
  const { t } = useTranslation('calculator');
  const isEditMode = !!id;

  const formSchema = useMemo(() => getFormSchema(t), [t]);
  type FormValues = z.infer<typeof formSchema>;

  const existingCalculation = useLiveQuery<Calculation | null>(
    () => (isEditMode && id ? calculationsRepository.getById(id).then((res) => res ?? null) : Promise.resolve(null)),
    [id],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const { reset } = form;

  useEffect(() => {
    if (existingCalculation) {
      reset({
        symbol: existingCalculation.symbol,
        totalCapitalUsd: existingCalculation.totalCapitalUsd,
        startDate: existingCalculation.startDate.split('T')[0],
        endDate: existingCalculation.endDate.split('T')[0],
        frequency: existingCalculation.frequency,
        stakingEnabled: existingCalculation.stakingEnabled,
        stakingMode: existingCalculation.stakingMode || 'simple',
        compoundingFrequency: existingCalculation.compoundingFrequency || 'daily',
        apyPercent: existingCalculation.apyPercent ?? 4,
      });
    }
  }, [existingCalculation, reset]);

  return { form, isEditMode, existingCalculation };
}
