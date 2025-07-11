import * as Ariakit from '@ariakit/react';
import { matchSorter } from 'match-sorter';
import { FC, memo, useMemo, useState,startTransition } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

import { cn } from '@cookers/utils';
import { TextField } from '@radix-ui/themes';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '../shadcn/button';


export interface InputAutoCompleteEditProps {
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
  list: string[];
  onItemSelect?: (value: string) => void;
  restricted?: boolean;
}
export const FormInputAutoCompleteEdit: FC<InputAutoCompleteEditProps> = memo(({ onItemSelect, ...props }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  const [searchValue, setSearchValue] = useState('');
  const matches = useMemo(() => matchSorter(props.list, searchValue), [props.list, searchValue]);

  //console.log('matches', props.list, props.readOnly);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <FormField {...props}>
      <Controller
        name={props.name}
        control={control}
        shouldUnregister={true}
        render={({ field: { onChange, name, ref, value, onBlur } }) => {
          if (props.readOnly) {
            return (
              <TextField.Root
                readOnly={props.readOnly}
                name={name}
                data-textid={name}
                value={value}
                ref={ref}
                maxLength={props.maxLength}
                autoComplete={props.autoComplete ? props.autoComplete : 'on'}
              >
                <TextField.Slot></TextField.Slot>
                <TextField.Slot>
                  <ChevronsUpDown className="opacity-50 " size={16} />
                </TextField.Slot>
              </TextField.Root>
            );
          }

          return (
            <Ariakit.ComboboxProvider
            setValue={(value) => {
              startTransition(() => setSearchValue(value));
              onChange(value);
            }}
          >
            <Ariakit.Combobox
              placeholder={props.placeHolder}
              readOnly={props.readOnly} // Keep this for consistency
              maxLength={props.maxLength}
              data-textid={props.name}
              value={value}
              className={`ariakit-combobox ${props.readOnly ? 'readonly' : ''}`}
              onKeyDown={(e) => {
                if (props.readOnly) e.preventDefault(); // Prevent typing
              }}
              onClick={(e) => {
                if (props.readOnly) e.preventDefault(); // Prevent focus
              }}
            />

            {!props.readOnly && (
              <Ariakit.ComboboxPopover gutter={8} sameWidth className="ariakit-popover">
                {matches.length ? (
                  matches.map((value) => (
                    <Ariakit.ComboboxItem
                      key={value}
                      value={value}
                      className="ariakit-combobox-item"
                      onClick={() => {
                        onItemSelect?.(value); // Notify parent component
                        setSearchValue(value); // Update input value
                      }}
                    />
                  ))
                ) : (
                  <div className="no-results">No results found</div>
                )}
              </Ariakit.ComboboxPopover>
            )}
          </Ariakit.ComboboxProvider>

          );
          //}
        }}
      />
    </FormField>
  );
});
