const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_YEAR = 365.25;

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  // Convert to days since epoch
  const birthDays = birthDate.getTime() / MS_PER_DAY;
  const todayDays = today.getTime() / MS_PER_DAY;
  
  // Calculate age using pure arithmetic
  return Math.floor((todayDays - birthDays) / DAYS_PER_YEAR);
};

const formatPart = (value: number, unit: string): string[] => 
  Array(Number(value > 0)).fill(`${value} ${unit}`);

export const formatTrainingDuration = (startDate: string): string => {
  const start = new Date(startDate);
  const today = new Date();
  
  // Calculate total months
  const monthsDiff = (today.getFullYear() - start.getFullYear()) * 12 
    + (today.getMonth() - start.getMonth());
  
  // Calculate years and remaining months
  const years = Math.floor(monthsDiff / 12);
  const months = monthsDiff % 12;
  
  // Build duration parts array
  return [
    ...formatPart(years, 'years'),
    ...formatPart(months, 'months')
  ].join(' ') || '0 months';
};
