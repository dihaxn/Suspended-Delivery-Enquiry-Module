export const getMinTime = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
};
export const getEventOnDateMaxMinTime = (date: Date): { maxTime?: Date; minTime?: Date } => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (date >= startOfToday) {
    return {
      maxTime: today,
      minTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
    };
  }

  return {
    maxTime: undefined,
    minTime: undefined,
  };
};
export const getInjuryReportMinTime = (eventDate: Date, eventLogOnDate: Date, injuryReportDate: Date): { maxTime?: Date; minTime?: Date } => {
  const today = new Date();

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
if (eventDate?.toDateString() === eventLogOnDate?.toDateString() && !injuryReportDate) {
  const minTime = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
    eventDate.getHours(),
    eventDate.getMinutes(),
    eventDate.getSeconds()
  );
  return {
    minTime,
    maxTime: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 23, 59, 59), // Max time is end of the eventDate day
  };
}

// Case when all three dates are the same (eventDate, eventLogOnDate, injuryReportDate)
if (
  eventDate?.toDateString() === eventLogOnDate?.toDateString() &&
  eventLogOnDate?.toDateString() === injuryReportDate?.toDateString()
) {
  const minTime = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
    eventDate.getHours(),
    eventDate.getMinutes(),
    eventDate.getSeconds()
  );
  return {
    minTime,
    maxTime: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 23, 59, 59),
  };
}

  return {
    maxTime: undefined,
    minTime: undefined,
  };
};
