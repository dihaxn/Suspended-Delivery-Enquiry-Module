export const GetPeriodFromDate = (periodType: string): string => {
  let fromDate = new Date();
  let month = fromDate.getMonth();
  let day = fromDate.getDate();
  let year = fromDate.getFullYear();

  switch (periodType) {
    case 'yesterday':
      fromDate.setDate(day - 1);
      break;
    case 'today':
      fromDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
    case 'lastweek':
      fromDate.setDate(day - 7);
      break;
    case 'month':
    case 'lastmonth':
      fromDate.setMonth(month - 1);
      break;
    case '3month':
    case 'last3month':
      fromDate.setMonth(month - 3);
      break;
    case '6month':
    case 'last6month':
      fromDate.setMonth(month - 6);
      break;
    case '9month':
      fromDate.setMonth(month - 9);
      break;
    case 'year':
    case 'last12month':
      fromDate.setFullYear(year - 1);
      break;
    case 'all':
      fromDate = new Date(2000, 0, 1);
      break;
    default:
      break;
  }

  return fromDate.toISOString();
};
