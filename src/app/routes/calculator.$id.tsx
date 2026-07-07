import {createFileRoute} from '@tanstack/react-router';
import {CalculatorPage} from '@/features/calculator/calculator-page';

export const Route = createFileRoute('/calculator/$id')({
  component: CalculatorPage,
});
