import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useDocumentMetadata(ns: string) {
  const { t } = useTranslation(ns);

  const title = t('title');
  const description = t('description');

  useEffect(() => {
    document.title = `${title} | Crypto DCA`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    if (description && description !== 'description') {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
