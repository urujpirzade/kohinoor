/**
 * Unit Tests for Summary Calculator Utility
 *
 * Tests the calculateSummary function with various scenarios including:
 * - Empty arrays
 * - Single events
 * - Multiple events
 * - Edge cases with zero amounts
 */

import { calculateSummary } from './summaryCalculator';
import type { EventRecord } from '../types/report';

describe('Summary Calculator', () => {
  // Helper function to create a mock event
  const createMockEvent = (
    overrides: Partial<EventRecord> = {},
  ): EventRecord => ({
    id: 1,
    client_name: 'Test Client',
    date: new Date('2024-01-15'),
    start_time: '10:00',
    end_time: '14:00',
    email: 'test@example.com',
    contact: '1234567890',
    address: 'Test Address',
    event_name: 'Wedding',
    hall: 'mainHall',
    details: 'Test event details',
    bookingBy: 'Test Booker',
    reference: 'REF123',
    hallHandover: true,
    decoration: true,
    catering: false,
    kitchen: false,
    amount: 50000,
    advance: 20000,
    balance: 30000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  describe('calculateSummary', () => {
    it('should return zero totals for empty array', () => {
      const result = calculateSummary([]);

      expect(result).toEqual({
        totalBookings: 0,
        totalTurnover: 0,
      });
    });

    it('should return zero totals for null/undefined input', () => {
      const result = calculateSummary(null as unknown as EventRecord[]);

      expect(result).toEqual({
        totalBookings: 0,
        totalTurnover: 0,
      });
    });

    it('should calculate correct totals for single event', () => {
      const events = [createMockEvent({ amount: 75000 })];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 1,
        totalTurnover: 75000,
      });
    });

    it('should calculate correct totals for multiple events', () => {
      const events = [
        createMockEvent({ id: 1, amount: 50000 }),
        createMockEvent({ id: 2, amount: 75000 }),
        createMockEvent({ id: 3, amount: 100000 }),
      ];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 3,
        totalTurnover: 225000,
      });
    });

    it('should handle events with zero amounts', () => {
      const events = [
        createMockEvent({ id: 1, amount: 50000 }),
        createMockEvent({ id: 2, amount: 0 }),
        createMockEvent({ id: 3, amount: 25000 }),
      ];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 3,
        totalTurnover: 75000,
      });
    });

    it('should handle all zero amounts', () => {
      const events = [
        createMockEvent({ id: 1, amount: 0 }),
        createMockEvent({ id: 2, amount: 0 }),
      ];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 2,
        totalTurnover: 0,
      });
    });

    it('should handle large amounts correctly', () => {
      const events = [
        createMockEvent({ id: 1, amount: 999999 }),
        createMockEvent({ id: 2, amount: 1000000 }),
      ];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 2,
        totalTurnover: 1999999,
      });
    });

    it('should handle negative amounts (edge case)', () => {
      const events = [
        createMockEvent({ id: 1, amount: 50000 }),
        createMockEvent({ id: 2, amount: -10000 }),
        createMockEvent({ id: 3, amount: 25000 }),
      ];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 3,
        totalTurnover: 65000,
      });
    });

    it('should return correct types', () => {
      const events = [createMockEvent({ amount: 50000 })];
      const result = calculateSummary(events);

      expect(typeof result.totalBookings).toBe('number');
      expect(typeof result.totalTurnover).toBe('number');
      expect(Number.isInteger(result.totalBookings)).toBe(true);
      expect(Number.isInteger(result.totalTurnover)).toBe(true);
    });

    it('should handle events with different properties but same amount calculation', () => {
      const events = [
        createMockEvent({
          id: 1,
          client_name: 'Client A',
          event_name: 'Wedding',
          hall: 'mainHall',
          amount: 100000,
        }),
        createMockEvent({
          id: 2,
          client_name: 'Client B',
          event_name: 'Birthday',
          hall: 'secondHall',
          amount: 50000,
        }),
      ];
      const result = calculateSummary(events);

      expect(result).toEqual({
        totalBookings: 2,
        totalTurnover: 150000,
      });
    });
  });
});
