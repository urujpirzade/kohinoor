// Helper function to check if a string is a valid DD/MM/YYYY date
export const isValidDDMMYYYY = (dateString: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;

  const [day, month, year] = dateString.split('/').map(Number);

  // Check month validity (1-12)
  if (month < 1 || month > 12) return false;

  // Check day validity based on month and leap year
  const daysInMonth = new Date(year, month, 0).getDate(); // Gets the last day of the *previous* month, effectively giving days in the target month
  if (day < 1 || day > daysInMonth) return false;

  // Basic year check (optional, adjust as needed)
  if (year < 1900 || year > 2100) return false;

  return true;
};

// Helper function to parse DD/MM/YYYY string to Date object
export const parseDDMMYYYY = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  // Month is 0-indexed in JavaScript Date constructor
  return new Date(year, month - 1, day);
};

export const formatTime12hr = (timeString: string | undefined): string => {
  if (!timeString || !timeString.includes(':')) return '-';
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    console.error('Error formatting time:', timeString, e);
    return timeString;
  }
};

export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '-';
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const convertBigCalendarDate = (
  schedule: {
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    hall: string;
    client: string;
  }[]
): {
  title: string;
  start: Date;
  end: Date;
  hall: string;
  client: string;
}[] => {
  return schedule.map((event) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);

    const start = new Date(event.date);
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date(event.date);
    end.setHours(endHour, endMinute, 0, 0);

    return {
      title: event.title,
      start,
      end,
      hall: event.hall,
      client: event.client,
    };
  });
};
