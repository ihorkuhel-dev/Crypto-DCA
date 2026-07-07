import { startTransition, useMemo } from 'react';
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
    { label: t('theme.options.system'), value: 'system' },
    { label: t('theme.options.light'), value: 'light' },
    { label: t('theme.options.dark'), value: 'dark' },
  ], [t]);

  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string | null) => {
    if (value) {
      startTransition(() => {
        setTheme(value as 'dark' | 'light' | 'system');
      });
    }
  };

  return (
    <Field>
      <FieldLabel>{t('theme.label')}</FieldLabel>
      <Select
        items={items}
        value={theme}
        onValueChange={handleThemeChange}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder={t('theme.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('theme.title')}</SelectLabel>
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
