import { format, isValid, parse } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { useController, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Field, FieldLabel } from '@/components/ui/field.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { useListingDate } from '../hooks/use-listing-date.ts';

interface DateRangeSelectorProps {
  control: any;
  errors: {
    startDate?: { message?: string };
    endDate?: { message?: string };
  };
}

const DATE_FNS_LOCALES: Record<string, typeof enUS> = {
  ru,
  en: enUS,
};

function parseDate(str: string | undefined): Date | undefined {
  if (!str) return undefined;
  const d = parse(str, 'yyyy-MM-dd', new Date());
  return isValid(d) ? d : undefined;
}

function toFormDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function ListingDateHint({ isLoading, dateStr }: { isLoading: boolean; dateStr?: string }) {
  const { t } = useTranslation('calculator');
  if (isLoading) return <Skeleton className="mt-0.5 h-3.5 w-36" />;
  if (dateStr) {
    return (
      <p className="text-[11px] text-muted-foreground mt-0.5">
        {t('hints.earliestDate')}: {dateStr}
      </p>
    );
  }
  return null;
}

export function DateRangeSelector({ control, errors }: DateRangeSelectorProps) {
  const { t, i18n } = useTranslation('calculator');
  const symbol = useWatch({ control, name: 'symbol' });

  const { listingDateStr, listingTimestamp, isLoading } = useListingDate(symbol);
  const locale = DATE_FNS_LOCALES[i18n.language] ?? enUS;

  const { field: startField } = useController({ name: 'startDate', control });
  const { field: endField } = useController({ name: 'endDate', control });

  const from = parseDate(startField.value != null ? String(startField.value) : undefined);
  const to = parseDate(endField.value != null ? String(endField.value) : undefined);

  const minDate = listingTimestamp ? new Date(listingTimestamp) : undefined;
  const maxDate = new Date();

  const range: DateRange | undefined = from ? { from, to } : undefined;

  const handleSelect = (selected: DateRange | undefined) => {
    startField.onChange(selected?.from ? toFormDate(selected.from) : '');
    endField.onChange(selected?.to ? toFormDate(selected.to) : '');
  };

  const label = (() => {
    if (from && to)
      return `${format(from, 'dd MMM yyyy', { locale })} – ${format(to, 'dd MMM yyyy', { locale })}`;
    if (from) return `${format(from, 'dd MMM yyyy', { locale })} – ...`;
    return null;
  })();

  return (
    <div className="sm:col-span-2 space-y-1">
      <Field>
        <FieldLabel>{t('form.period')}</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal h-9',
                  !label && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 size-4 shrink-0" />
                {label ?? <span>{t('hints.pickDateRange')}</span>}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleSelect}
              locale={locale}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (date > maxDate) return true;
                return false;
              }}
              captionLayout="dropdown"
              defaultMonth={from ?? minDate ?? new Date()}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {errors.startDate && (
          <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>
        )}
        {errors.endDate && !errors.startDate && (
          <p className="text-xs text-destructive mt-1">{errors.endDate.message}</p>
        )}

        <ListingDateHint isLoading={!!symbol && isLoading} dateStr={listingDateStr} />
      </Field>
    </div>
  );
}
