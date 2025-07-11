export const truncateTimeFromDateString=(dateString: string)=> {
    if (!dateString.includes(' ')) {
      return dateString;
    }
    return dateString.split(' ')[0];
  }