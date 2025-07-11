import { constructFromSymbol } from 'date-fns/constants';

export const GetCurrentDateISO = (): string => {
  return new Date().toISOString();
};

export const formatToISO = (date: Date): string => {
  const pad = (num: number): string => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}Z`;
};
