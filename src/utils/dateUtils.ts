export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (shouldDecreaseAge(monthDiff, today, birthDate)) {
    age--;
  }
  return age;
};

const shouldDecreaseAge = (
  monthDiff: number,
  today: Date,
  birthDate: Date
): boolean => {
  return (
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
  );
};

export const formatTrainingDuration = (startDate: string): string => {
  const start = new Date(startDate);
  const today = new Date();
  const years = today.getFullYear() - start.getFullYear();
  const months = today.getMonth() - start.getMonth();
  if (years === 0) {
    return `${months} months`;
  }
  return `${years} years${months > 0 ? ` ${months} months` : ""}`;
};
