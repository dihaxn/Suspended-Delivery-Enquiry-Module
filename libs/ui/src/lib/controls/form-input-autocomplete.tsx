import { FC, memo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

import { cn } from '@cookers/utils';
import { TextField } from '@radix-ui/themes';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '../shadcn/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './../shadcn';

export type FormAutoCompleterRequestTypeType = { label: string; value: number | string } | string;
export type FormAutoCompleterReturnType = number | string;

export interface InputAutoCompleteProps {
  label: string;
  name: string;
  desc?: string;
  required?: string | boolean;
  icon?: string;
  readOnly?: boolean;
  placeHolder?: string;
  maxLength?: number;
  autoComplete?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onCopy?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  list: { label: string; value: number | string }[] | string[];
  onItemSelect?: (value: FormAutoCompleterReturnType) => void;
  restricted?: boolean;
}
export const FormInputAutoComplete: FC<InputAutoCompleteProps> = memo(({ onItemSelect, ...props }) => {
  const { control } = useFormContext();
  const [searchValue, setSearchValue] = useState<FormAutoCompleterRequestTypeType | null>(null);
const [open, setOpen] = useState(false);
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
                  <ChevronsUpDown className="ml-auto opacity-50 " size={16} />
                </TextField.Slot>
              </TextField.Root>
            );
          }

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox" className={cn('justify-between')} onClick={() => setOpen((prev) => !prev)} >
                    <span className='text-ellipsis overflow-hidden'>{typeof value === 'string' ? value : typeof value === 'object' ? value.label : ''}</span>
                    <ChevronsUpDown className="ml-auto opacity-50 " />
                  </Button>
                  {/* <TextField.Root role="combobox" className={cn(' justify-between border-r-amber-500')}>
                    <TextField.Slot role="combobox">
                      {typeof value === 'string' ? value : typeof value === 'object' ? value.label : ''}
                    </TextField.Slot>
                    <TextField.Slot>
                      <ChevronsUpDown className="ml-auto opacity-50 " size={16} />
                    </TextField.Slot>
                  </TextField.Root> */}
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="min-w-[200px] p-0">
                <Command>
                  <CommandInput placeholder={`Search ${props.label} `} className="h-9" data-textid={props.name} />
                  <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup>
                      {props.list.map((item, index) => (
                        <CommandItem
                          value={typeof item === 'string' ? item : item.label}
                          key={`${typeof item === 'string' ? item : item.value}`}
                                                  onSelect={() => {
                          const selectedValue = item;
                          onChange(selectedValue);
                          onItemSelect?.(typeof selectedValue === 'string' ? selectedValue : selectedValue.value);
                          setSearchValue(selectedValue);
                          setOpen(false); // ❗ Close the Popover after selection
                        }}
                        >
                          {typeof item === 'string' ? item : item.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              (typeof item === 'string' ? item === searchValue : typeof searchValue === 'object' && item.value === searchValue?.value)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </FormField>
  );
});
