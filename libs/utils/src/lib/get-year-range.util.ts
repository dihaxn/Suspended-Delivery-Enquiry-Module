export const GetYearRange = (yearType: string) => {
    const currentYear = new Date().getFullYear();
    const years = [];
  
    switch (yearType) {
      case 'calendar':
        for (let year = 2015; year <= currentYear; year++) {
            years.push({ value: `${year}`, label: `${year}`,  isCurrentYear: year === currentYear});
          }
        break;
  
      case 'financial':
        for (let year = 2015; year <= currentYear; year++) {
            const nextYear = year + 1;
            years.push({ value: `${year}-${nextYear}`, label: `${year}-${nextYear}`,isCurrentYear: year == currentYear && nextYear >= currentYear });
          }
        break;
        case '3yrs-financial':
            // Generate 3 years of financial year range: previous, current, and next year
            years.push({ value: `${currentYear - 1}-${currentYear+1}`, label: `${currentYear - 1}-${currentYear+1}` });  // Previous year
          
            break;
      default:
        throw new Error(`Unsupported year type: ${yearType}`);
    }
  
    return years;
  };