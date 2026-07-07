import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDocumentMetadata } from '@/hooks/use-document-metadata.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Field, FieldLabel } from '@/components/ui/field.tsx';

import { AssetSelector } from './components/asset-selector.tsx';
import { DateRangeSelector } from './components/date-range-selector.tsx';
import { FrequencySelector } from './components/frequency-selector.tsx';
import { StakingSettings } from './components/staking-settings.tsx';
import { useCalculatorForm } from './hooks/use-calculator-form.ts';
import { useCalculatorSubmit } from './hooks/use-calculator-submit.ts';

export function CalculatorPage() {
  const params = useParams({ strict: false });
  const id = params.id;

  const { t } = useTranslation('calculator');
  useDocumentMetadata('calculator');

  const { form, isEditMode, existingCalculation } = useCalculatorForm(id);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const { onSubmit } = useCalculatorSubmit({ isEditMode, id, existingCalculation });

  if (isEditMode && existingCalculation === undefined) {
    return null;
  }

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <Link to="/">
              <ArrowLeft className="size-4 mr-2" />
              {t('actions.cancel')}
            </Link>
          }
        />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{isEditMode ? t('titleEdit') : t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {isEditMode ? t('descriptionEdit') : t('description')}
        </p>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-6 max-w-xl bg-card border border-border/80 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AssetSelector control={control} error={errors.symbol?.message} />

          <DateRangeSelector control={control} errors={errors} />

          <Field>
            <FieldLabel>{t('form.totalCapitalUsd')}</FieldLabel>
            <Input
              type="number"
              step="any"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              {...register('totalCapitalUsd', { valueAsNumber: true })}
            />
            {errors.totalCapitalUsd && (
              <p className="text-xs text-destructive mt-1">{errors.totalCapitalUsd.message}</p>
            )}
          </Field>

          <FrequencySelector control={control} error={errors.frequency?.message} />
        </div>

        <StakingSettings control={control} register={register} errors={errors} />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSubmitting} className="min-w-36">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {t('actions.create')}
              </>
            ) : isEditMode ? (
              t('actions.save')
            ) : (
              t('actions.create')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
