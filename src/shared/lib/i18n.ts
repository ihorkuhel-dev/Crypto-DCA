/* eslint-disable */
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import calculatorEn from '@/features/calculator/locales/en.json';
import calculatorRu from '@/features/calculator/locales/ru.json';
import dashboardEn from '@/features/dashboard/locales/en.json';
import dashboardRu from '@/features/dashboard/locales/ru.json';
import settingsEn from '@/features/settings/locales/en.json';
import settingsRu from '@/features/settings/locales/ru.json';

// oxlint-disable-next-line import/no-named-as-default-member
void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    ns: ['calculator', 'dashboard', 'settings'],
    resources: {
      en: {
        calculator: calculatorEn,
        dashboard: dashboardEn,
        settings: settingsEn,
      },
      ru: {
        calculator: calculatorRu,
        dashboard: dashboardRu,
        settings: settingsRu,
      },
    },
    interpolation: { escapeValue: false },
  });

export { i18next };
