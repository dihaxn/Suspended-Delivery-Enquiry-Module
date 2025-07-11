import { Button } from '@radix-ui/themes';
import { format, getMonth, getYear } from 'date-fns';
import { memo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

const range = (start: number, end: number, step = 1): number[] => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

interface FormDateProps {
  label: string;
  name: string;
  required?: string | boolean;
  dateFormat?: string;
  defaultValue?: Date;
  showTimeSelect?: boolean;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  onDateChange?: (date: Date | string | null | undefined) => void;
  returnType?: 'date' | 'string'; // New prop to specify the desired return type
  popperPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
}

export const FormDate = memo(
  ({
    returnType = 'date', // Default to 'date'
    ...props
  }: Readonly<FormDateProps>) => {
    const { control } = useFormContext();

    const years = range(1950, getYear(new Date()) + 1, 1);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
      <FormField {...props}>
        <Controller
          control={control}
          name={props.name}
          shouldUnregister={true}
          render={({ field }) => (
            <DatePicker
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    margin: 10,
                    gap: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    type="button"
                    radius="full"
                    color="gray"
                    variant="outline"
                    size="1"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                  >
                    {'<'}
                  </Button>
                  <div className="custom-select">
                    <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))}>
                      {years.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="custom-select">
                    <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                      {months.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="button"
                    radius="full"
                    color="gray"
                    variant="outline"
                    size="1"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  >
                    {'>'}
                  </Button>
                </div>
              )}
              popperPlacement={props.popperPlacement || 'bottom'}
              placeholderText="Select date"
              onChange={(date) => {
                const parsedDate = date ? (date instanceof Date ? date : new Date(date)) : null; // Ensure it's a Date object or null
                const formattedDate = parsedDate ? format(parsedDate, 'dd-MMM-yyyy HH:mm:ss') : null; // Convert to string (or use custom format)

                const returnValue = returnType === 'string' ? formattedDate : parsedDate; // Return based on returnType

                field.onChange(returnValue); // Update form state with the desired type
                if (props.onDateChange) {
                  props.onDateChange(returnValue); // Trigger onDateChange event with the desired type
                }
              }}
              selected={field.value ? new Date(field.value) : null} // Convert string to Date for display
              showIcon={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z" />
                </svg>
              }
              toggleCalendarOnIconClick
              dateFormat={props.dateFormat ? props.dateFormat : 'dd-MMM-yyyy - HH:mm'}
              timeFormat="HH:mm"
              readOnly={props.readOnly || false}
              disabled={props.readOnly || false}
              showTimeSelect={props.showTimeSelect || false}
              minDate={props.minDate}
              maxDate={props.maxDate}
              minTime={props.minTime}
              maxTime={props.maxTime}
              data-textid={props.name}
            />
          )}
        />
      </FormField>
    );
  }
);
