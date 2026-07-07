import {Outlet, createRootRoute} from '@tanstack/react-router';
import {Toaster} from 'sonner';
import {AppLayout} from '@/components/layout/app-layout.tsx';

// import { RouteErrorBoundary } from '@/shared/components/route-error-boundary';
// import { RouteFallback } from '@/shared/components/route-fallback';

export const Route = createRootRoute({
  // errorComponent: () => <RouteErrorBoundary fallback={<div>Что-то пошло не так</div>} />,
  // pendingComponent: RouteFallback,
  component: () => (
    <>
      <Toaster />
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  ),
});
