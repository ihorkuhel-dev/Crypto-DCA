import type {ReactNode} from 'react';
import {Footer} from '@/components/layout/footer.tsx';
import {Header} from '@/components/layout/header.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 min-h-0">
        <main className="w-full h-full p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
