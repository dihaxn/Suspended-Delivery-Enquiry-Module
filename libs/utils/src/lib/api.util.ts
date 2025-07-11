/**
 * Converts an object to a JSON string and encodes it for use as an API query parameter.
 * @param obj The object to convert and encode.
 * @returns The encoded JSON string.
 */
export function encodeObjectForQueryParam(obj: Record<string, unknown>): string {
  const jsonString = JSON.stringify(obj);
  return encodeURIComponent(jsonString);
}

/**
 * Decodes an encoded JSON string from a query parameter back to an object.
 * @param encoded The encoded JSON string.
 * @returns The parsed object.
 */
export function decodeObjectFromQueryParam<T = Record<string, unknown>>(encoded: string): T {
  const jsonString = decodeURIComponent(encoded);
  return JSON.parse(jsonString) as T;
}

/**
 * Converts an array to a JSON string and encodes it for use as an API query parameter.
 * @param arr The array to convert and encode.
 * @returns The encoded JSON string.
 */
export function encodeArrayForQueryParam(arr: unknown[]): string {
  if(arr.length <= 0) return ''; 
  const jsonString = JSON.stringify(arr);
  return encodeURIComponent(jsonString);
}

/**
 * Decodes an encoded JSON string from a query parameter back to an array.
 * @param encoded The encoded JSON string.
 * @returns The parsed array.
 */
export function decodeArrayFromQueryParam<T = unknown>(encoded: string): T[] {
  const jsonString = decodeURIComponent(encoded);
  return JSON.parse(jsonString) as T[];
}