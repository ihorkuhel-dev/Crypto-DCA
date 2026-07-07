import { useCallback, useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox.tsx';
import { Field, FieldLabel } from '@/components/ui/field.tsx';
import {
  useBinanceAssets,
  useFilteredAssets,
  useAssetVirtualizer,
} from '../hooks/use-binance-assets.ts';

interface AssetSelectorProps {
  control: any;
  error?: string;
}

function getDisplayName(symbol: string, assets: { symbol: string; baseAsset: string }[]): string {
  if (!symbol) return '';
  const asset = assets.find((a) => a.symbol === symbol);
  return asset ? `${asset.baseAsset} (${asset.symbol})` : symbol;
}

export function AssetSelector({ control, error }: AssetSelectorProps) {
  const { t } = useTranslation('calculator');
  const symbolValue = useWatch({ control, name: 'symbol' }) as string;

  const { assets, isLoading } = useBinanceAssets();

  // inputValue — что пользователь набирает в поиске
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Отображаем: при поиске — набранный текст, иначе — имя выбранного актива.
  // Нет useEffect + setState, только чистый useMemo — устраняет EffectSetState lint.
  const shownValue = useMemo(
    () => (isSearching ? inputValue : getDisplayName(symbolValue, assets)),
    [isSearching, inputValue, symbolValue, assets],
  );

  const filteredAssets = useFilteredAssets(assets, isSearching ? inputValue : '');

  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const { virtualizer, isVirtual } = useAssetVirtualizer(filteredAssets.length, scrollEl);

  const handleFocus = useCallback(() => {
    setIsSearching(true);
    setInputValue('');
  }, []);

  const handleBlur = useCallback(() => {
    setIsSearching(false);
    setInputValue('');
  }, []);

  return (
    <Field>
      <FieldLabel>{t('form.symbol')}</FieldLabel>
      <Controller
        name="symbol"
        control={control}
        render={({ field }) => (
          <Combobox
            value={field.value}
            onValueChange={(val) => {
              const newSymbol = val || '';
              field.onChange(newSymbol);
              setIsSearching(false);
              setInputValue('');
            }}
          >
            <div className="relative">
              <ComboboxInput
                showClear
                value={shownValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={t('form.symbol')}
                className="w-full"
              />
            </div>
            <ComboboxContent align="start" className="w-full min-w-70">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('hints.loadingPrice')}
                </div>
              ) : filteredAssets.length === 0 ? (
                <ComboboxEmpty className="p-4 text-center text-sm text-muted-foreground">
                  {t('hints.noAssetsFound')}
                </ComboboxEmpty>
              ) : isVirtual ? (
                <ComboboxList ref={setScrollEl} className="h-60 overflow-auto">
                  <div
                    style={{
                      height: virtualizer.getTotalSize(),
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {virtualizer.getVirtualItems().map((vItem) => {
                      const item = filteredAssets[vItem.index];
                      return (
                        <div
                          key={vItem.key}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: vItem.size,
                            transform: `translateY(${vItem.start}px)`,
                          }}
                        >
                          <ComboboxItem value={item.symbol}>
                            <span className="font-semibold">{item.baseAsset}</span>
                            <span className="text-muted-foreground text-xs">
                              {' '}({item.symbol})
                            </span>
                          </ComboboxItem>
                        </div>
                      );
                    })}
                  </div>
                </ComboboxList>
              ) : (
                <ComboboxList className="max-h-60 overflow-auto">
                  {filteredAssets.map((item) => (
                    <ComboboxItem key={item.symbol} value={item.symbol}>
                      <span className="font-semibold">{item.baseAsset}</span>
                      <span className="text-muted-foreground text-xs"> ({item.symbol})</span>
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              )}
            </ComboboxContent>
          </Combobox>
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </Field>
  );
}
