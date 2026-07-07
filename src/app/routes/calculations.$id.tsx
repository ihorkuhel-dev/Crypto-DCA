import { createFileRoute } from '@tanstack/react-router';
import { CalculationDetailPage } from '@/features/calculation-detail/calculation-detail-page.tsx';

export const Route = createFileRoute('/calculations/$id')({
  component: CalculationDetailPage,
});
