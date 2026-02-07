/**
 * Unit tests for Event Status Calculator
 */

import { calculateEventStatus } from './eventStatus';

describe('Event Status Calculator', () => {
  // Mock current date to January 15, 2024
  const mockDate = new Date('2024-01-15T10:30:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Past dates should return Complete', () => {
    it('should return Complete for yesterday', () => {
      const yesterday = new Date('2024-01-14T15:00:00Z');
      expect(calculateEventStatus(yesterday)).toBe('Complete');
    });

    it('should return Complete for a date one week ago', () => {
      const oneWeekAgo = new Date('2024-01-08T08:00:00Z');
      expect(calculateEventStatus(oneWeekAgo)).toBe('Complete');
    });

    it('should return Complete for a date one month ago', () => {
      const oneMonthAgo = new Date('2023-12-15T12:00:00Z');
      expect(calculateEventStatus(oneMonthAgo)).toBe('Complete');
    });
  });

  describe('Today should return Upcoming', () => {
    it('should return Upcoming for today (same date, different time)', () => {
      const today = new Date('2024-01-15T05:00:00Z');
      expect(calculateEventStatus(today)).toBe('Upcoming');
    });

    it('should return Upcoming for today (same date, later time)', () => {
      const today = new Date('2024-01-15T20:00:00Z');
      expect(calculateEventStatus(today)).toBe('Upcoming');
    });
  });

  describe('Future dates should return Upcoming', () => {
    it('should return Upcoming for tomorrow', () => {
      const tomorrow = new Date('2024-01-16T10:00:00Z');
      expect(calculateEventStatus(tomorrow)).toBe('Upcoming');
    });

    it('should return Upcoming for a date one week in the future', () => {
      const oneWeekLater = new Date('2024-01-22T14:00:00Z');
      expect(calculateEventStatus(oneWeekLater)).toBe('Upcoming');
    });
  });

  describe('Timezone edge cases', () => {
    it('should handle dates in different timezones correctly', () => {
      const edgeDate = new Date('2024-01-14T23:30:00-05:00'); // 11:30 PM EST on Jan 14
      // This converts to 2024-01-15T04:30:00Z (4:30 AM UTC on Jan 15)
      expect(calculateEventStatus(edgeDate)).toBe('Upcoming');
    });

    it('should handle UTC dates correctly', () => {
      const utcDate = new Date('2024-01-14T00:00:00Z'); // Midnight UTC on Jan 14
      expect(calculateEventStatus(utcDate)).toBe('Complete');
    });
  });

  describe('Boundary conditions', () => {
    it('should handle the exact boundary between Complete and Upcoming', () => {
      const lastMomentYesterday = new Date('2024-01-14T23:59:59.999Z');
      expect(calculateEventStatus(lastMomentYesterday)).toBe('Complete');

      const firstMomentToday = new Date('2024-01-15T00:00:00.000Z');
      expect(calculateEventStatus(firstMomentToday)).toBe('Upcoming');
    });
  });
});
