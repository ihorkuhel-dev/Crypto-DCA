import { useTranslation } from 'react-i18next';
import { ThemeSelector } from '@/features/settings/components/theme-selector.tsx';
import { LanguageSelector } from '@/features/settings/components/language-selector.tsx';
import { DangerZone } from '@/features/settings/components/danger-zone.tsx';
import { useDocumentMetadata } from '@/hooks/use-document-metadata.ts';

export function SettingsPage() {
  const { t } = useTranslation('settings');

  useDocumentMetadata('settings');

  return (
    <div className="p-6 space-y-6 max-w-md">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <div className="flex flex-col gap-6">
        <ThemeSelector />
        <LanguageSelector />
      </div>
      <DangerZone />
    </div>
  );
}
