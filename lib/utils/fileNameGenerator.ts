/**
 * File name generator utility for event booking reports
 * Generates standardized file names with date range formatting
 */

/**
 * Formats a date as YYYY-MM-DD string
 * @param date - The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
function formatDateForFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates a standardized report file name with date range
 * @param startDate - The start date of the report range
 * @param endDate - The end date of the report range
 * @param format - The file format ('pdf' or 'xlsx')
 * @returns Formatted filename string
 *
 * @example
 * generateReportFileName(new Date('2024-01-01'), new Date('2024-01-31'), 'pdf')
 * // Returns: "event-report_2024-01-01_to_2024-01-31.pdf"
 */
export function generateReportFileName(
  startDate: Date,
  endDate: Date,
  format: 'pdf' | 'xlsx',
): string {
  const formattedStartDate = formatDateForFilename(startDate);
  const formattedEndDate = formatDateForFilename(endDate);

  return `event-report_${formattedStartDate}_to_${formattedEndDate}.${format}`;
}
