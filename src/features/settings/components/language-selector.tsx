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
import {Field, FieldLabel} from '@/components/ui/field.tsx';

export function LanguageSelector() {
  const { t, i18n } = useTranslation('settings');

  const supportedLngs = useMemo(() => {
    return Array.isArray(i18n.options.supportedLngs)
      ? i18n.options.supportedLngs.filter((lng) => lng !== 'cimode')
      : ['en', 'ru'];
  }, [i18n.options.supportedLngs]);

  const currentLanguage = i18n.language || 'en';

  const handleLanguageChange = (lng: string | null) => {
    if (lng) {
      void i18n.changeLanguage(lng);
    }
  };

  const items = useMemo(() => {
    return supportedLngs.map((lng) => ({
      value: lng,
      label: t(`language.options.${lng}`, lng.toUpperCase()) as string,
    }));
  }, [supportedLngs, t]);

  return (
    <Field>
      <FieldLabel>{t('language.label', 'Select language:')}</FieldLabel>
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder={t('language.placeholder', 'Select language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('language.title', 'Language')}</SelectLabel>
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
