import { cn } from '@cookers/utils';
import { TextField } from '@radix-ui/themes';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger } from '../shadcn';
import { Button } from '../shadcn/button';
import { FormField } from './form-field';

type Option = {
  value: string | number;
  label: string;
  other?: any;
};

interface VirtualizedCommandProps {
  height: string;
  options: Option[];
  placeholder: string;
  selectedOption: { label: string; value: string | number } | string | number;
  onSelectOption?: (option: { label: string; value: string | number } | string | number) => void;
  emptyMessage?: string;
}

const VirtualizedCommand = ({ height, options, placeholder, selectedOption, onSelectOption, emptyMessage = "Please wait item are loading" }: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: 'center',
    });
  };

  const handleSearch = (search: string) => {
    // console.log('AAA, search', search);
    setIsKeyboardNavActive(false);
    setFilteredOptions(options.filter((option) => option.label.toString().toLowerCase().includes(search.toLowerCase())));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex = prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex = prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (filteredOptions[focusedIndex]) {
          onSelectOption?.(filteredOptions[focusedIndex]);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedOption) {
      const option = filteredOptions.find((option) => option.value === selectedOption);
      if (option) {
        const index = filteredOptions.indexOf(option);
        setFocusedIndex(index);
        virtualizer.scrollToIndex(index, {
          align: 'center',
        });
      }
    }
  }, [selectedOption, filteredOptions, virtualizer]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList
        ref={parentRef}
        style={{
          height: height,
          width: '100%',
          overflow: 'auto',
        }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualOptions.map((virtualOption) => (
              <CommandItem
                disabled={isKeyboardNavActive}
                className={cn(
                  'absolute left-0 top-0 w-full bg-transparent text',
                  focusedIndex === virtualOption.index && 'bg-accent text-accent-foreground',
                  isKeyboardNavActive && focusedIndex !== virtualOption.index && 'aria-selected:bg-transparent aria-selected:text-primary'
                )}
                style={{
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                key={filteredOptions[virtualOption.index].value}
                value={filteredOptions[virtualOption.index].value.toString()}
                onMouseEnter={() => !isKeyboardNavActive && setFocusedIndex(virtualOption.index)}
                onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                onSelect={() => onSelectOption?.(filteredOptions[virtualOption.index])}
              >
                <span className="text-xs">{filteredOptions[virtualOption.index].label}</span>
                {filteredOptions[virtualOption.index].other && (
                  <span className="ml-auto text-xs text-muted-foreground">{filteredOptions[virtualOption.index].other}</span>
                )}
                {/* <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedOption && typeof selectedOption === 'object' && selectedOption.value === filteredOptions[virtualOption.index].value
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                /> */}
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

interface VirtualizedComboboxProps {
  options: { label: string; value: number | string; other?: any }[] | string[];
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  maxLength?: number;
  autoComplete?: string;
  readOnly?: boolean;
  name: string;
  label: string;
  emptyMessage?: string;
}

export function FormInputAutoCompleteVirtualized({
  options,
  searchPlaceholder = 'Search items...',
  width = '100%',
  height = '400px',
  ...props
}: VirtualizedComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number>('');

  const { control } = useFormContext();
  // const [searchValue, setSearchValue] = useState<FormAutoCompleterRequestTypeType | null>(null);

  return (
    <FormField {...props}>
      <Controller
        name={props.name}
        control={control}
        shouldUnregister={true}
        render={({ field: { onChange, name, ref, value, onBlur } }) => {
          const displayValue = typeof value === 'string' ? value : typeof value === 'object' ? value.label : '';

          if (props.readOnly) {
            return (
              <TextField.Root
                readOnly={props.readOnly}
                name={name}
                data-textid={name}
                value={displayValue}
                ref={ref}
                maxLength={props.maxLength}
                autoComplete={props.autoComplete ? props.autoComplete : 'on'}
              >
                <TextField.Slot></TextField.Slot>
                <TextField.Slot>
                  <span className="ml-auto italic text-sm text-muted-foreground">{typeof value === 'object' && value.other ? value.other : ''}</span>
                  <ChevronsUpDown className="ml-auto opacity-50 " size={16} />
                </TextField.Slot>
              </TextField.Root>
            );
          }

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between"
                  style={{
                    width: width,
                  }}
                >
                  <span className="overflow-hidden">{typeof value === 'string' ? value : typeof value === 'object' ? value.label : ''}</span>
                  <span className="ml-auto italic text-sm text-muted-foreground">{typeof value === 'object' && value.other ? value.other : ''}</span>
                  <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[300px] p-0">
                <VirtualizedCommand
                  height={height}
                  options={options.map((option) =>
                    typeof option === 'string'
                      ? { value: option, label: option }
                      : option.other
                      ? { value: option.value.toString(), label: option.label, other: option.other }
                      : { value: option.value.toString(), label: option.label }
                  )}
                  placeholder={searchPlaceholder}
                  selectedOption={selectedOption.toString()}
                  emptyMessage={props.emptyMessage}
                  onSelectOption={(currentValue) => {
                    setSelectedOption(
                      typeof currentValue === 'string' || typeof currentValue === 'number'
                        ? currentValue === selectedOption
                          ? ''
                          : currentValue
                        : ''
                    );
                    setOpen(false);
                    onChange(currentValue);
                    // console.log('AAA, currentValue', currentValue);
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </FormField>
  );
}
