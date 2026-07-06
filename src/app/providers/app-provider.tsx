import {QueryClientProvider} from '@tanstack/react-query';
import type {ReactNode} from 'react';
import {queryClient} from '@/shared/lib/query-client.ts';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {TooltipProvider} from '@/components/ui/tooltip.tsx';
import {ThemeProvider} from "@/app/providers/theme-provider.tsx";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
