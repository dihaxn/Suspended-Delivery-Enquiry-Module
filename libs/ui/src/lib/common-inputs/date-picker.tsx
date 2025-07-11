import { Button } from '@radix-ui/themes';
import { format, getMonth, getYear } from 'date-fns';
import { memo, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const range = (start: number, end: number, step = 1): number[] => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

// Helper function to safely parse date
const parseDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;
  
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return null;
    return parsed;
  }
  
  return null;
};

interface DatePickerProps {
  label?: string;
  dateFormat?: string;
  defaultValue?: Date | string;
  value?: Date | string;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | string | null | undefined) => void;
  returnType?: 'date' | 'string'; // Specify the desired return type
  popperPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
  placeholder?: string;
}

export const CustomDatePicker = memo(
  ({
    label,
    dateFormat = 'dd-MMM-yyyy',
    defaultValue,
    value,
    readOnly = false,
    minDate,
    maxDate,
    onChange,
    returnType = 'date',
    popperPlacement = 'bottom',
    placeholder = 'Select date',
  }: Readonly<DatePickerProps>) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
      const initialValue = value || defaultValue;
      return parseDate(initialValue);
    });

    const years = range(1950, getYear(new Date()) + 1, 1);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Update internal state when value prop changes (for controlled components)
    useEffect(() => {
      if (value !== undefined) {
        const newDate = parseDate(value);
        setSelectedDate(newDate);
      }
    }, [value]);

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date);
      
      const parsedDate = date && !isNaN(date.getTime()) ? date : null;
      const formattedDate = parsedDate ? format(parsedDate, 'dd-MMM-yyyy') : null;
      
      // Always return as string (text)
      if (onChange) {
        onChange(formattedDate);
      }
    };

    return (
      <div className="date-picker-container !text-sm !font-normal">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
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
          popperPlacement={popperPlacement}
          placeholderText={placeholder}
          onChange={handleDateChange}
          selected={selectedDate}
          showIcon={true}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z" />
            </svg>
          }
          toggleCalendarOnIconClick
          dateFormat={dateFormat}
          readOnly={readOnly}
          disabled={readOnly}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    );
  }
);