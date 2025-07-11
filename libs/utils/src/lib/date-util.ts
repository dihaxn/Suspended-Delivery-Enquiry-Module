/**
 * Compares two dates to determine if they represent the same calendar date.
 * 
 * This function performs a date-only comparison, ignoring time components.
 * It compares the year, month, and day values of the two provided dates.
 * 
 * @param d1 - The first date to compare. Can be a Date object or a string that can be parsed into a Date.
 * @param d2 - The second date to compare. Can be a Date object or a string that can be parsed into a Date.
 * @returns True if both dates represent the same calendar date (same year, month, and day), false otherwise.
 * 
 * @example
 * ```typescript
 * isSameDate('2023-12-25', '2023-12-25T15:30:00Z'); // returns true
 * isSameDate(new Date('2023-12-25'), new Date('2023-12-26')); // returns false
 * ```
 */
export const isSameDate = (d1: string | Date, d2: string | Date) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

/**
 * Compares two dates to determine their chronological relationship.
 * 
 * This function performs a date-only comparison, ignoring time components.
 * It compares the calendar dates (year, month, day) of the two provided dates.
 * 
 * @param d1 - The first date to compare. Can be a Date object or a string that can be parsed into a Date.
 * @param d2 - The second date to compare. Can be a Date object or a string that can be parsed into a Date.
 * @returns A number: negative if d1 is before d2, positive if d1 is after d2, zero if they are the same date.
 * 
 * @example
 * ```typescript
 * compareDates('2023-12-25', '2023-12-26'); // returns negative number (d1 < d2)
 * compareDates('2023-12-26', '2023-12-25'); // returns positive number (d1 > d2)
 * compareDates('2023-12-25', '2023-12-25T15:30:00Z'); // returns 0 (same date)
 * ```
 */
export const compareDates = (d1: string | Date, d2: string | Date): number => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  
  // Set time to midnight for date-only comparison
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  
  return date1.getTime() - date2.getTime();
};

/**
 * Checks if the first date is after the second date.
 * 
 * @param d1 - The first date to compare.
 * @param d2 - The second date to compare.
 * @returns True if d1 is after d2, false otherwise.
 */
export const isDateAfter = (d1: string | Date, d2: string | Date): boolean => {
  return compareDates(d1, d2) > 0;
};

/**
 * Checks if the first date is before the second date.
 * 
 * @param d1 - The first date to compare.  
 * @param d2 - The second date to compare.
 * @returns True if d1 is before d2, false otherwise.
 */
export const isDateBefore = (d1: string | Date, d2: string | Date): boolean => {
  return compareDates(d1, d2) < 0;
};