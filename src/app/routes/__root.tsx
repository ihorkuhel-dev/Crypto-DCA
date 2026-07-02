import { createRootRoute, Outlet } from '@tanstack/react-router';

// import { RouteErrorBoundary } from '@/shared/components/route-error-boundary';
// import { RouteFallback } from '@/shared/components/route-fallback';

export const Route = createRootRoute({
  // errorComponent: () => <RouteErrorBoundary fallback={<div>Что-то пошло не так</div>} />,
  // pendingComponent: RouteFallback,
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
