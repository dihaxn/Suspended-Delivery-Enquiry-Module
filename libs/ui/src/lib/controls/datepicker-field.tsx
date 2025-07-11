import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatepickerFieldProps {
  startDate: Date | null;
  onChange?: (date: Date | null) => void;
  dataFormat?: string;
}

export const DatepickerField: React.FC<DatepickerFieldProps> = ({ startDate, onChange, dataFormat }) => {
	console.log('DatepickerField startDate:', startDate);
  return (
    <div>
      <DatePicker selected={startDate} onChange={onChange} dateFormat={dataFormat ? dataFormat : 'dd-MMM-yyyy'} />
    </div>
  );
};
