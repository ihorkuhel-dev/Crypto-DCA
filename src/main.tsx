/* eslint-disable */
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProvider } from '@/app/providers/app-provider';
import { router } from '@/app/router';
import '@/shared/lib/i18n';

import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
