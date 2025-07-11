import { cn } from '@cookers/utils';
import { TextField } from '@radix-ui/themes';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger } from '../shadcn';
import { Button } from '../shadcn/button';

type Option = {
  value: string | number;
  label: string;
  other?: string | number;
};

type SelectedOptionType = { label: string; value: string | number; other?: string | number } | string | number;

interface VirtualizedCommandProps {
  height: string;
  options: Option[];
  placeholder: string;
  selectedOption: SelectedOptionType;
  onSelectOption?: (option: SelectedOptionType) => void;
  maxHeight?: string;
  itemHeight?: number;
  allowCustomValue?: boolean;
  showSearch?: boolean;
  popOverWidth?: string;
}

const VirtualizedCommand = ({ height, options, placeholder, selectedOption, onSelectOption, maxHeight = '400px', itemHeight = 35, allowCustomValue = false, showSearch = true, popOverWidth }: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const parentRef = useRef(null);

  // Check if the input matches any existing option
  const isExistingOption = () => {
    return filteredOptions.some(
      option => option.label.toLowerCase() === inputValue.toLowerCase()
    );
  };

  // Calculate dynamic height based on number of items
  const calculateDynamicHeight = () => {
    const commandInputHeight = showSearch ? 40 : 10; // Only add height if search is shown
    const maxHeightValue = parseInt(maxHeight.replace('px', ''));
    const hasCustomOption = allowCustomValue && inputValue && !isExistingOption();
    const totalItems = filteredOptions.length + (hasCustomOption ? 1 : 0);
    const calculatedHeight = Math.min(
      totalItems * itemHeight + commandInputHeight,
      maxHeightValue
    );
    const minHeight = Math.min(100, calculatedHeight); // Minimum height of 100px or calculated height if smaller
    return Math.max(minHeight, calculatedHeight);
  };

  const dynamicHeight = calculateDynamicHeight();

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: 'center',
    });
  };

  // Handle creating a custom option
  const handleCreateOption = () => {
    const newOption = { value: inputValue, label: inputValue };
    onSelectOption?.(newOption);
  };

  const handleSearch = (search: string) => {
    setInputValue(search);
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
        if (allowCustomValue && inputValue && !isExistingOption()) {
          handleCreateOption();
        } else if (filteredOptions[focusedIndex]) {
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
      {showSearch && <CommandInput onValueChange={handleSearch} placeholder={placeholder} />}
      <CommandList
        ref={parentRef}
        style={{
          height: `${dynamicHeight}px`,
          width: popOverWidth || '100%',
          overflow: 'auto',
        }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        {/* Show custom option when input doesn't match any existing option */}
        {allowCustomValue && inputValue && !isExistingOption() && (
          <CommandItem 
            onSelect={handleCreateOption}
            className="text-xs cursor-pointer flex items-center border-b border-border mb-1"
          >
            <span>Add "{inputValue}"</span>
          </CommandItem>
        )}
        
        <CommandEmpty>Please wait item are loading</CommandEmpty>
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
                  height: `${itemHeight}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                key={filteredOptions[virtualOption.index].value + '-' + virtualOption.index}
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
  options: { label: string; value: number | string; other?: string | number }[] | string[];
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  maxHeight?: string;
  itemHeight?: number;
  maxLength?: number;
  autoComplete?: string;
  readOnly?: boolean;
  name?: string;
  label?: string;
  value?: SelectedOptionType;
  onChange?: (value: SelectedOptionType) => void;
  onBlur?: () => void;
  allowCustomValue?: boolean;
  showSearch?: boolean;
  popOverWidth?: string;
}

export function InputAutoCompleteVirtualized(props: Readonly<VirtualizedComboboxProps>) {
  const {
    options,
    searchPlaceholder = 'Search items...',
    width = '100%',
    height = '400px',
    maxHeight = '400px',
    itemHeight = 35,
    value,
    onChange,
    onBlur,
    readOnly,
    name,
    maxLength,
    autoComplete,
    allowCustomValue = false,
    showSearch = true,
    popOverWidth = '--radix-popover-trigger-width'
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number>('');

  // Sync selectedOption with the incoming value prop
  useEffect(() => {
    if (typeof value === 'string' || typeof value === 'number') {
      setSelectedOption(value);
    } else if (typeof value === 'object' && value !== null) {
      setSelectedOption(value.value);
    } else {
      setSelectedOption('');
    }
  }, [value]);

  const getDisplayValue = () => {
    if (typeof value === 'string' || typeof value === 'number') {
      // Find the option that matches this value and return its label
      const matchingOption = options.find(option => 
        typeof option === 'string' ? option === value : option.value === value
      );
      if (matchingOption) {
        return typeof matchingOption === 'string' ? matchingOption : matchingOption.label;
      }
      return value.toString();
    }
    if (typeof value === 'object' && value !== null) return value.label;
    return '';
  };

  const getOtherValue = (): string | number => {
    if (typeof value === 'object' && value !== null && 'other' in value && value.other !== undefined) {
      return value.other;
    }
    return '';
  };

  const transformOptions = () => {
    return options.map((option) => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }
      
      if (option.other) {
        return { value: option.value.toString(), label: option.label, other: option.other };
      }
      
      return { value: option.value.toString(), label: option.label };
    });
  };

  const handleOptionSelect = (currentValue: SelectedOptionType) => {
    let newSelectedValue: SelectedOptionType;
    
    if (typeof currentValue === 'string' || typeof currentValue === 'number') {
      newSelectedValue = currentValue === selectedOption ? '' : currentValue;
    } else {
      // Check if this is a custom option (not in original options list)
      const isCustomOption = typeof currentValue === 'object' && 
        !options.some(opt => 
          typeof opt === 'string' 
            ? opt === currentValue.value 
            : opt.value === currentValue.value
        );
        
      // If it's a custom option, we need to format it properly
      if (isCustomOption) {
        newSelectedValue = {
          value: currentValue.value,
          label: currentValue.label,
        };
      } else {
        newSelectedValue = currentValue;
      }
    }
    
    setSelectedOption(
      typeof newSelectedValue === 'string' || typeof newSelectedValue === 'number'
        ? newSelectedValue
        : newSelectedValue.value
    );
    setOpen(false);
    onChange?.(newSelectedValue);
  };

  if (readOnly) {
    const displayValue = getDisplayValue();
    const otherValue = getOtherValue();
    
    return (
      <TextField.Root
        readOnly={readOnly}
        name={name}
        data-textid={name}
        value={displayValue}
        maxLength={maxLength}
        autoComplete={autoComplete ?? 'on'}
      >
        <TextField.Slot></TextField.Slot>
        <TextField.Slot>
          <span className="ml-auto italic text-sm text-muted-foreground">{otherValue}</span>
          <ChevronsUpDown className="ml-auto opacity-50 " size={16} />
        </TextField.Slot>
      </TextField.Root>
    );
  }

  const displayValue = getDisplayValue();
  const otherValue = getOtherValue();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="justify-between"
          style={{
            width: width,
          }}
          onBlur={onBlur}
        >
          <span className="overflow-hidden">{displayValue}</span>
          <span className="ml-auto italic text-sm text-muted-foreground">{otherValue}</span>
          <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[${popOverWidth}] p-0`}>
        <VirtualizedCommand
          height={height}
          maxHeight={maxHeight}
          itemHeight={itemHeight}
          options={transformOptions()}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption.toString()}
          onSelectOption={handleOptionSelect}
          allowCustomValue={allowCustomValue}
          showSearch={showSearch}
          popOverWidth={popOverWidth}
        />
      </PopoverContent>
    </Popover>
  );
}
