import { parse, isValid ,format} from 'date-fns';


export const convertToNullableTime = (dateString: string | Date | null | undefined | ''): Date | null => {
  if (dateString === null || dateString === undefined || dateString === '' || dateString === '0001-01-01T00:00:00') {
    return null;
  }

  const parsedDate = new Date(dateString);

  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const parseCustomDateNullableString = (dateString: string): Date | undefined => {
  
  if (!dateString.trim()) {
    return undefined;
  }

  const dateFormats = ['dd-MMM-yyyy', 'dd-MMM-yyyy HH:mm:ss'];

  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      console.log("dob",parsedDate);
      return parsedDate;
    }
  }

  return undefined; // Return undefined if no valid date found
};
export const parseCustomDateNullableString2 = (dateString: string): Date | undefined => {
  
  if (!dateString.trim()) {
    return undefined;
  }

  const dateFormats = ['MM/dd/yyyy', 'MM/dd/yyyy HH:mm:ss'];

  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      console.log("dob",parsedDate);
      return parsedDate;
    }
  }

  return undefined; // Return undefined if no valid date found
};
export const parseCustomDateString = (dateString: string): Date => {
  const dateFormats = ['dd-MMM-yyyy', 'dd-MMM-yyyy HH:mm:ss'];

  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  throw new Error(`Invalid date string: "${dateString}"`);
};

export function formattoJsonDate(date?: Date | null|undefined): string {
  if (!date) {
    return ''; // Return empty string if date is undefined
  }

  // Get date components
  const day = String(date.getDate()).padStart(2, '0'); // Day
  const year = date.getFullYear(); // Year

  // Array of month names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()]; // Get month name

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the final string
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export function formattoDate(date?: Date | null): string {
  if (!date) {
    return ''; // Return empty string if date is undefined
  }

  // Get date components
  const day = String(date.getDate()).padStart(2, '0'); // Day
  const year = date.getFullYear(); // Year

  // Array of month names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()]; // Get month name

  
  // Format the final string
  const formattedDate = `${day}-${month}-${year} `;
  return formattedDate;
}

export function formatStringDatetostring(date?: string | null): string {
  if (!date) {
    return ''; // Return empty string if date is undefined
  }

  const isoDate = new Date(date);
  const formattedDate = format(isoDate, 'dd-MMM-yyyy');
  
  return formattedDate;
}