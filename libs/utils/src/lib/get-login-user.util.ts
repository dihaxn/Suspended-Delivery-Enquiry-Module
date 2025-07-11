export const getUserFromLocalStorage = (): { [key: string]: any } | null => {
  const storedValue = localStorage.getItem('user');
  if (!storedValue) return null;

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error('Error parsing JSON from local storage:', error);
    return null;
  }
};

export const getProxyUserFromLocalStorage = (): { [key: string]: any } | null => {
  const storedValue = localStorage.getItem('proxyUser');
  if (!storedValue) return null;

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error('Error parsing JSON from local storage:', error);
    return null;
  }
};


export const getWso2TokenFromLocalStorage = (): { [key: string]: any } | null => {
  const storedValue = localStorage.getItem('wso2Token');
  if (!storedValue) return null;

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error('Error parsing JSON from local storage:', error);
    return null;
  }
};

export const getOriginatorFromLocalStorage = (): string | null => {
  const storedValue = localStorage.getItem('originator');
  if (!storedValue) return null;

  try {
    // If stored as JSON (e.g., `"Jale"`), parse it
    if (storedValue.startsWith('"') && storedValue.endsWith('"')) {
      return JSON.parse(storedValue);
    }
    // If stored as a plain string, return it directly
    return storedValue;
  } catch (error) {
    console.error('Error parsing JSON from local storage:', error);
    return null;
  }
};
