import { useParams } from '@tanstack/react-router';

export function CalculationDetailPage() {
  const params = useParams({ strict: false });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Детали — {params.id}</h1>
      <p className="text-sm text-muted-foreground">
        Здесь будут отображаться графики Binance, итоговая доходность стейкинга и виртуализированная
        таблица транзакций.
      </p>
    </div>
  );
}
