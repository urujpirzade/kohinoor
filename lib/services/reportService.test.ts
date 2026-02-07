/**
 * Unit tests for Report Service
 */

import { fetchEventsByDateRange, validateDateRange } from './reportService';
import type { DateRange, FilteredEventsResult } from '../types/report';

// Mock Prisma client
const mockFindMany = jest.fn();

jest.mock('../db', () => ({
  __esModule: true,
  default: {
    event: {
      findMany: jest.fn(),
    },
  },
}));

// Get the mocked db to access the mock functions
import db from '../db';
const mockedDb = db as jest.Mocked<typeof db>;

describe('Report Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Assign our mock function to the mocked db
    mockedDb.event.findMany = mockFindMany;
  });

  describe('fetchEventsByDateRange', () => {
    const mockEvents = [
      {
        id: 1,
        client_name: 'John Doe',
        date: new Date('2024-01-15'),
        start_time: '10:00',
        end_time: '12:00',
        email: 'john@example.com',
        contact: '1234567890',
        address: '123 Main St',
        event_name: 'Birthday Party',
        hall: 'mainHall',
        details: 'Birthday celebration',
        bookingBy: 'John Doe',
        reference: 'REF001',
        hallHandover: true,
        decoration: false,
        catering: true,
        kitchen: false,
        amount: 5000,
        advance: 2000,
        balance: 3000,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        client_name: 'Jane Smith',
        date: new Date('2024-01-20'),
        start_time: '14:00',
        end_time: '18:00',
        email: 'jane@example.com',
        contact: '0987654321',
        address: '456 Oak Ave',
        event_name: 'Wedding Reception',
        hall: 'secondHall',
        details: 'Wedding celebration',
        bookingBy: 'Jane Smith',
        reference: 'REF002',
        hallHandover: true,
        decoration: true,
        catering: true,
        kitchen: true,
        amount: 15000,
        advance: 5000,
        balance: 10000,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    it('should fetch events successfully with valid date range', async () => {
      mockFindMany.mockResolvedValue(mockEvents);

      const dateRange: DateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const result: FilteredEventsResult =
        await fetchEventsByDateRange(dateRange);

      expect(result.events).toEqual(mockEvents);
      expect(result.count).toBe(2);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
    });

    it('should return empty results when no events match date range', async () => {
      mockFindMany.mockResolvedValue([]);

      const dateRange: DateRange = {
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-28'),
      };

      const result: FilteredEventsResult =
        await fetchEventsByDateRange(dateRange);

      expect(result.events).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      mockFindMany.mockRejectedValue(new Error('Database connection failed'));

      const dateRange: DateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      await expect(fetchEventsByDateRange(dateRange)).rejects.toThrow(
        'Failed to fetch events from database',
      );
    });

    it('should set correct time boundaries for date filtering', async () => {
      mockedDb.event.findMany.mockResolvedValue([]);

      const dateRange: DateRange = {
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-15'),
      };

      await fetchEventsByDateRange(dateRange);

      const callArgs = mockedDb.event.findMany.mock.calls[0][0];
      const whereClause = callArgs?.where?.date;

      expect(whereClause.gte.getUTCHours()).toBe(0);
      expect(whereClause.lte.getUTCHours()).toBe(23);
    });

    it('should sort events by date in ascending order', async () => {
      mockedDb.event.findMany.mockResolvedValue(mockEvents);

      const dateRange: DateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      await fetchEventsByDateRange(dateRange);

      expect(mockedDb.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            date: 'asc',
          },
        }),
      );
    });
  });

  describe('validateDateRange', () => {
    it('should pass validation for valid date range', () => {
      const dateRange: DateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      expect(() => validateDateRange(dateRange)).not.toThrow();
    });

    it('should throw error when start date is missing', () => {
      const dateRange = {
        startDate: null as unknown as Date,
        endDate: new Date('2024-01-31'),
      };

      expect(() => validateDateRange(dateRange)).toThrow(
        'Both start date and end date are required',
      );
    });

    it('should throw error when end date is missing', () => {
      const dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: null as unknown as Date,
      };

      expect(() => validateDateRange(dateRange)).toThrow(
        'Both start date and end date are required',
      );
    });

    it('should throw error when start date is invalid', () => {
      const dateRange = {
        startDate: new Date('invalid-date'),
        endDate: new Date('2024-01-31'),
      };

      expect(() => validateDateRange(dateRange)).toThrow(
        'Start date and end date must be valid dates',
      );
    });

    it('should throw error when end date is invalid', () => {
      const dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('invalid-date'),
      };

      expect(() => validateDateRange(dateRange)).toThrow(
        'Start date and end date must be valid dates',
      );
    });

    it('should throw error when start date is after end date', () => {
      const dateRange: DateRange = {
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-01-01'),
      };

      expect(() => validateDateRange(dateRange)).toThrow(
        'Start date must be before or equal to end date',
      );
    });

    it('should pass validation when start date equals end date', () => {
      const dateRange: DateRange = {
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-15'),
      };

      expect(() => validateDateRange(dateRange)).not.toThrow();
    });
  });
});
