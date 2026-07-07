import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import {useTheme} from '@/app/providers/theme-provider.tsx';
import {Field, FieldLabel} from '@/components/ui/field.tsx';

export function ThemeSelector() {
  const { t } = useTranslation('settings');

  const items = useMemo(() => [
    { label: t('theme.options.system', 'System'), value: 'system' },
    { label: t('theme.options.light', 'Light'), value: 'light' },
    { label: t('theme.options.dark', 'Dark'), value: 'dark' },
  ], [t]);

  const { theme, setTheme } = useTheme();

  return (
    <Field>
      <FieldLabel>{t('theme.label', 'Select theme:')}</FieldLabel>
      <Select
        items={items}
        value={theme}
        onValueChange={(value) => setTheme(value as 'dark' | 'light' | 'system')}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder={t('theme.placeholder', 'Select theme')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('theme.title', 'Theme')}</SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
