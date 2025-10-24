export const getAgeString = (birthDate: string | null | undefined): string => {
  if (!birthDate) return 'Unknown age';
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  const ageInYears = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  let age = ageInYears;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age = ageInYears - 1;
  }
  
  if (age === 0) {
    const ageInMonths = today.getMonth() - birth.getMonth() + (12 * (today.getFullYear() - birth.getFullYear()));
    return ageInMonths <= 1 ? 'Less than 1 month' : `${ageInMonths} months`;
  }
  
  return age === 1 ? '1 year' : `${age} years`;
};

export const formatDateShort = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateLong = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date > today;
};

export const getDaysUntilDate = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
