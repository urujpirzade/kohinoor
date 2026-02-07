import { generateReportFileName } from './fileNameGenerator';

describe('generateReportFileName', () => {
  it('should generate correct filename for PDF format', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    const result = generateReportFileName(startDate, endDate, 'pdf');

    expect(result).toBe('event-report_2024-01-01_to_2024-01-31.pdf');
  });

  it('should generate correct filename for Excel format', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    const result = generateReportFileName(startDate, endDate, 'xlsx');

    expect(result).toBe('event-report_2024-01-01_to_2024-01-31.xlsx');
  });

  it('should format single-digit months and days with leading zeros', () => {
    const startDate = new Date('2024-01-05');
    const endDate = new Date('2024-02-09');
    const result = generateReportFileName(startDate, endDate, 'pdf');

    expect(result).toBe('event-report_2024-01-05_to_2024-02-09.pdf');
  });

  it('should handle same start and end date', () => {
    const date = new Date('2024-12-25');
    const result = generateReportFileName(date, date, 'xlsx');

    expect(result).toBe('event-report_2024-12-25_to_2024-12-25.xlsx');
  });

  it('should handle dates across different years', () => {
    const startDate = new Date('2023-12-15');
    const endDate = new Date('2024-01-15');
    const result = generateReportFileName(startDate, endDate, 'pdf');

    expect(result).toBe('event-report_2023-12-15_to_2024-01-15.pdf');
  });

  it('should handle leap year dates', () => {
    const startDate = new Date('2024-02-28');
    const endDate = new Date('2024-02-29');
    const result = generateReportFileName(startDate, endDate, 'xlsx');

    expect(result).toBe('event-report_2024-02-28_to_2024-02-29.xlsx');
  });

  it('should handle dates with different months having different day counts', () => {
    const startDate = new Date('2024-01-31');
    const endDate = new Date('2024-02-28');
    const result = generateReportFileName(startDate, endDate, 'pdf');

    expect(result).toBe('event-report_2024-01-31_to_2024-02-28.pdf');
  });
});
