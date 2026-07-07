import type {ReactNode} from 'react';
import {Footer} from '@/components/layout/footer.tsx';
import {Header} from '@/components/layout/header.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex px-12 h-dvh flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 min-h-0">
        <main className="w-full h-full py-4 ">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
