import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import {useTheme} from '@/app/providers/theme-provider.tsx';
import {Field, FieldLabel} from '@/components/ui/field.tsx';

export function ThemeSelector() {
  const items = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  const { theme, setTheme } = useTheme();

  return (
    <Field>
      <FieldLabel>Select theme:</FieldLabel>
      <Select
        items={items}
        value={theme}
        onValueChange={(value) => setTheme(value as 'dark' | 'light' | 'system')}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Theme</SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
