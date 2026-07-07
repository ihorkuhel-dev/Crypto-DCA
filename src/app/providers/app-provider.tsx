import type {ReactNode} from 'react';
import {TooltipProvider} from '@/components/ui/tooltip.tsx';
import {ThemeProvider} from "@/app/providers/theme-provider.tsx";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
