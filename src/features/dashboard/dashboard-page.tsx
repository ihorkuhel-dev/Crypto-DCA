import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from '@tanstack/react-router';
import { calculationsRepository } from '@/shared/lib/calculations-repository.ts';
import { useDocumentMetadata } from '@/hooks/use-document-metadata.ts';
import { Button } from '@/components/ui/button.tsx';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty.tsx';
import { Plus, TrendingUp } from 'lucide-react';
import { Route as calculatorRoute } from '@/app/routes/calculator.index.tsx';

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  useDocumentMetadata('dashboard');

  const calculations = useLiveQuery(() => calculationsRepository.list());

  if (calculations === undefined) {
    return null;
  }

  if (calculations.length === 0) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>

        <Empty className="mt-8 border border-dashed border-border p-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TrendingUp className="size-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>{t('empty.title')}</EmptyTitle>
            <EmptyDescription>{t('empty.description')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              render={
                <Link to={calculatorRoute.to}>
                  <Plus className="size-4 mr-2" />
                  {t('empty.action')}
                </Link>
              }
            />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="space-y-4">
        {calculations.map((calc) => (
          <div key={calc.id} className="p-4 border rounded-lg bg-card">
            {calc.symbol.toUpperCase()} - {calc.totalCapitalUsd} USD
          </div>
        ))}
      </div>
    </div>
  );
}
