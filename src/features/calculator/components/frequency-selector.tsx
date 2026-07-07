import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Field, FieldLabel } from '@/components/ui/field.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

interface FrequencySelectorProps {
  control: any;
  error?: string;
}

export function FrequencySelector({ control, error }: FrequencySelectorProps) {
  const { t } = useTranslation('calculator');

  const frequencies = [
    { value: '1d', label: t('frequencies.1d') },
    { value: '3d', label: t('frequencies.3d') },
    { value: '7d', label: t('frequencies.7d') },
    { value: '1m', label: t('frequencies.1m') },
  ];

  return (
    <Field>
      <FieldLabel>{t('form.frequency')}</FieldLabel>
      <Controller
        name="frequency"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={(val) => field.onChange(val || '')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('form.frequency')} />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              <SelectGroup>
                <SelectLabel>{t('form.frequency')}</SelectLabel>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </Field>
  );
}
