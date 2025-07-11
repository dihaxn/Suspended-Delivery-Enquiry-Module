function isValueFilled(value: any) {
  return value !== null && value !== undefined && (typeof value !== 'string' || value.trim() !== '');
}

export function isAnyFieldFilledInObject(obj: any, omitFields: string[] = []) {
  if (typeof obj !== 'object' || obj === null) return isValueFilled(obj);

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    if (omitFields.includes(key)) continue;

    const value = obj[key];

    if (typeof value === 'object') {
      if (isAnyFieldFilledInObject(value, omitFields)) {
        return true;
      }
    } else if (isValueFilled(value)) {
      return true;
    }
  }

  return false;
}
