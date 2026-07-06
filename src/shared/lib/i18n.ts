import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

import calculatorEn from '@/features/calculator/locales/en.json';
import calculatorRu from '@/features/calculator/locales/ru.json';
import dashboardEn from '@/features/dashboard/locales/en.json';
import dashboardRu from '@/features/dashboard/locales/ru.json'; // oxlint-disable-next-line import/no-named-as-default-member

// oxlint-disable-next-line import/no-named-as-default-member
void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    ns: ['calculator', 'dashboard'],
    resources: {
      en: { calculator: calculatorEn, dashboard: dashboardEn },
      ru: { calculator: calculatorRu, dashboard: dashboardRu },
    },
    interpolation: { escapeValue: false },
  });

export { i18next };
