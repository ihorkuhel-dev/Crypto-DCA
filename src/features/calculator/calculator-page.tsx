import {useParams} from '@tanstack/react-router';

export function CalculatorPage() {
  const params = useParams({ strict: false });

  if (params.id) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Редактор — {params.id}</h1>
        <p className="text-sm text-muted-foreground">
          Форма предзаполнена данными расчета из базы Dexie для последующего обновления.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Калькулятор</h1>
      <p className="text-sm text-muted-foreground">
        Чистая форма для создания нового DCA-расчета и первичного закупа.
      </p>
    </div>
  );
}
