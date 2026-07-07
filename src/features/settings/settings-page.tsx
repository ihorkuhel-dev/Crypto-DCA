import {useTranslation} from 'react-i18next';
import {ThemeSelector} from '@/features/settings/components/theme-selector.tsx';
import {LanguageSelector} from '@/features/settings/components/language-selector.tsx';

export function SettingsPage() {
  const { t } = useTranslation('settings');

  return (
    <div className="p-6 space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">{t('title', 'Settings')}</h1>
      <div className="flex flex-col gap-6">
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </div>
  );
}
