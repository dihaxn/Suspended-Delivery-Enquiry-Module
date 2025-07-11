// Utility function to calculate date ranges
export const GetDateRange = (type: string, period: string) => {
  const currentDate = new Date();
  let fromDate: Date;
  let toDate: Date;

  switch (type.toLowerCase()) {
    case 'lstm':
      fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1, 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 0, 0, 0);
      break;

    case 'yd3f':
      fromDate = new Date(currentDate.getFullYear() - 3, 6, 1, 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 31, 0, 0, 0);
      break;

    case 'yd5c':
      fromDate = new Date(currentDate.getFullYear() - 4, 0, 1, 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      break;
    case 'yd5f':
      fromDate = new Date(currentDate.getFullYear() - 5, 6, 1, 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 0, 0, 0);
      break;
    case 'cust':
      fromDate = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      break;

    case 'caly':
      fromDate = new Date(parseInt(period), 0, 1, 0, 0, 0);
      if (parseInt(period) === currentDate.getFullYear()) {
        toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      } else {
        // Otherwise, toDate is December 31 of that year
        toDate = new Date(parseInt(period), 11, 31, 0, 0, 0);
      }
      break;

    case 'finy': {
      const [startYear, endYear] = period.split('/').map(Number);
      fromDate = new Date(startYear, 6, 1, 0, 0, 0);
      if (startYear === currentDate.getFullYear()) {
        toDate = new Date(currentDate.getFullYear(), 7, 31);
      } else {
        // Otherwise, toDate is December 31 of that year
        toDate = new Date(endYear, 5, 30, 0, 0, 0);
      }
      break;
    }
    default:
      throw new Error('Invalid date range type');
  }

  return { fromDate, toDate };
};
