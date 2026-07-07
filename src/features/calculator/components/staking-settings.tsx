import { Controller, type UseFormRegister, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Field, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

interface StakingSettingsProps {
  control: any;
  register: UseFormRegister<any>;
  errors: {
    apyPercent?: { message?: string };
  };
}

export function StakingSettings({ control, register, errors }: StakingSettingsProps) {
  const { t } = useTranslation('calculator');

  const watchStakingEnabled = useWatch({ control, name: 'stakingEnabled' });
  const watchStakingMode = useWatch({ control, name: 'stakingMode' });

  const stakingModes = [
    { value: 'simple', label: t('stakingModes.simple') },
    { value: 'compound', label: t('stakingModes.compound') },
  ];

  const compoundingPeriods = [
    { value: 'daily', label: t('compounding.daily') },
    { value: 'monthly', label: t('compounding.monthly') },
    { value: 'yearly', label: t('compounding.yearly') },
  ];

  return (
    <div className="space-y-6 sm:col-span-2">
      <div className="flex items-center justify-between p-4 border border-border/60 rounded-lg bg-muted/10">
        <div className="space-y-0.5">
          <span className="text-sm font-semibold">{t('form.stakingEnabled')}</span>
        </div>
        <Controller
          name="stakingEnabled"
          control={control}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
      </div>

      {watchStakingEnabled && (
        <div className="p-4 border border-border/60 rounded-lg bg-muted/5 space-y-6 animate-in fade-in-0 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>{t('form.stakingMode')}</FieldLabel>
              <Controller
                name="stakingMode"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || 'simple'}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('form.stakingMode')} />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectGroup>
                        <SelectLabel>{t('form.stakingMode')}</SelectLabel>
                        {stakingModes.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>{t('form.apyPercent')}</FieldLabel>
              <Input
                type="number"
                step="any"
                {...register('apyPercent', { valueAsNumber: true })}
              />
              {errors.apyPercent && (
                <p className="text-xs text-destructive mt-1">{errors.apyPercent.message}</p>
              )}
            </Field>

            {watchStakingMode === 'compound' && (
              <Field className="sm:col-span-2">
                <FieldLabel>{t('form.compoundingFrequency')}</FieldLabel>
                <Controller
                  name="compoundingFrequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || 'daily'}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('form.compoundingFrequency')} />
                      </SelectTrigger>
                      <SelectContent side="bottom" align="start">
                        <SelectGroup>
                          <SelectLabel>{t('form.compoundingFrequency')}</SelectLabel>
                          {compoundingPeriods.map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              {period.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
