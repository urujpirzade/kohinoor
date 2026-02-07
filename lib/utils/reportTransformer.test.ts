/**
 * Unit tests for Report Data Transformer
 */

import {
  transformEventsToReportRows,
  transformEventsToReportRowsForPDF,
} from './reportTransformer';
import type { EventRecord } from '../types/report';

describe('Report Data Transformer', () => {
  // Mock current date to January 15, 2024
  const mockDate = new Date('2024-01-15T10:30:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const createMockEvent = (
    overrides: Partial<EventRecord> = {},
  ): EventRecord => ({
    id: 1,
    client_name: 'John Doe',
    date: new Date('2024-01-20T10:00:00Z'),
    start_time: '10:00',
    end_time: '14:00',
    email: 'john@example.com',
    contact: '1234567890',
    address: '123 Main St',
    event_name: 'Wedding',
    hall: 'mainHall' as const,
    details: 'Wedding ceremony',
    bookingBy: 'John Doe',
    reference: 'REF001',
    hallHandover: true,
    decoration: true,
    catering: true,
    kitchen: false,
    amount: 50000,
    advance: 25000,
    balance: 25000,
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-01-10T10:00:00Z'),
    ...overrides,
  });

  describe('transformEventsToReportRows', () => {
    it('should return empty array for empty input', () => {
      const result = transformEventsToReportRows([]);
      expect(result).toEqual([]);
    });

    it('should transform single event correctly', () => {
      const event = createMockEvent({
        client_name: 'Alice Smith',
        event_name: 'Birthday Party',
        amount: 25000,
        contact: '9876543210',
        date: new Date('2024-01-20T15:00:00Z'), // Future date
      });

      const result = transformEventsToReportRows([event]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        srNo: 1,
        name: 'Alice Smith',
        eventType: 'Birthday Party',
        date: '20/1/2024',
        contact: '9876543210',
        amount: '25,000.00',
        status: 'Upcoming',
      });
    });

    it('should generate sequential serial numbers', () => {
      const events = [
        createMockEvent({ client_name: 'Event 1' }),
        createMockEvent({ client_name: 'Event 2' }),
        createMockEvent({ client_name: 'Event 3' }),
      ];

      const result = transformEventsToReportRows(events);

      expect(result).toHaveLength(3);
      expect(result[0].srNo).toBe(1);
      expect(result[1].srNo).toBe(2);
      expect(result[2].srNo).toBe(3);
    });

    it('should map all fields correctly', () => {
      const event = createMockEvent({
        client_name: 'Test Client',
        event_name: 'Corporate Event',
        amount: 75000,
      });

      const result = transformEventsToReportRows([event]);

      expect(result[0].name).toBe('Test Client');
      expect(result[0].eventType).toBe('Corporate Event');
      expect(result[0].amount).toBe('75,000.00');
    });

    it('should calculate event status correctly for past events', () => {
      const pastEvent = createMockEvent({
        date: new Date('2024-01-10T10:00:00Z'), // Past date
      });

      const result = transformEventsToReportRows([pastEvent]);

      expect(result[0].status).toBe('Complete');
    });

    it('should calculate event status correctly for future events', () => {
      const futureEvent = createMockEvent({
        date: new Date('2024-01-20T10:00:00Z'), // Future date
      });

      const result = transformEventsToReportRows([futureEvent]);

      expect(result[0].status).toBe('Upcoming');
    });

    it('should calculate event status correctly for today', () => {
      const todayEvent = createMockEvent({
        date: new Date('2024-01-15T18:00:00Z'), // Today
      });

      const result = transformEventsToReportRows([todayEvent]);

      expect(result[0].status).toBe('Upcoming');
    });

    it('should handle multiple events with different statuses', () => {
      const events = [
        createMockEvent({
          client_name: 'Past Event',
          date: new Date('2024-01-10T10:00:00Z'),
          amount: 30000,
        }),
        createMockEvent({
          client_name: 'Today Event',
          date: new Date('2024-01-15T15:00:00Z'),
          amount: 40000,
        }),
        createMockEvent({
          client_name: 'Future Event',
          date: new Date('2024-01-25T10:00:00Z'),
          amount: 50000,
        }),
      ];

      const result = transformEventsToReportRows(events);

      expect(result).toHaveLength(3);

      expect(result[0]).toEqual({
        srNo: 1,
        name: 'Past Event',
        eventType: 'Wedding',
        date: '10/1/2024',
        contact: '1234567890',
        amount: '30,000.00',
        status: 'Complete',
      });

      expect(result[1]).toEqual({
        srNo: 2,
        name: 'Today Event',
        eventType: 'Wedding',
        date: '15/1/2024',
        contact: '1234567890',
        amount: '40,000.00',
        status: 'Upcoming',
      });

      expect(result[2]).toEqual({
        srNo: 3,
        name: 'Future Event',
        eventType: 'Wedding',
        date: '25/1/2024',
        contact: '1234567890',
        amount: '50,000.00',
        status: 'Upcoming',
      });
    });

    it('should handle zero amounts correctly', () => {
      const event = createMockEvent({
        amount: 0,
      });

      const result = transformEventsToReportRows([event]);

      expect(result[0].amount).toBe('0.00');
    });

    it('should handle large amounts correctly', () => {
      const event = createMockEvent({
        amount: 1000000, // 10 lakh
      });

      const result = transformEventsToReportRows([event]);

      expect(result[0].amount).toBe('10,00,000.00');
    });
  });

  describe('transformEventsToReportRowsForPDF', () => {
    it('should return empty array for empty input', () => {
      const result = transformEventsToReportRowsForPDF([]);
      expect(result).toEqual([]);
    });

    it('should transform single event with PDF-compatible currency formatting', () => {
      const event = createMockEvent({
        client_name: 'Alice Smith',
        event_name: 'Birthday Party',
        amount: 25000,
        contact: '9876543210',
        date: new Date('2024-01-20T15:00:00Z'), // Future date
      });

      const result = transformEventsToReportRowsForPDF([event]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        srNo: 1,
        name: 'Alice Smith',
        eventType: 'Birthday Party',
        date: '20/1/2024',
        contact: '9876543210',
        amount: '25,000.00', // PDF uses same format but without Rs. prefix
        status: 'Upcoming',
      });
    });

    it('should process Devanagari text for PDF compatibility', () => {
      const event = createMockEvent({
        client_name: 'बाशा लवाने', // Marathi name
        event_name: 'अकिखा Day', // Mixed Marathi and English
        amount: 25000,
      });

      const result = transformEventsToReportRowsForPDF([event]);

      expect(result[0].name).not.toContain('बाशा');
      expect(result[0].name).not.toContain('लवाने');
      expect(result[0].eventType).not.toContain('अकिखा');
      // Should contain transliterated or processed text
      expect(result[0].name).toMatch(/[a-zA-Z\s?]+/);
      expect(result[0].eventType).toMatch(/[a-zA-Z\s?]+/);
    });

    it('should use Rs. prefix instead of ₹ symbol for PDF compatibility', () => {
      const event = createMockEvent({
        amount: 75000,
      });

      const result = transformEventsToReportRowsForPDF([event]);

      expect(result[0].amount).toBe('75,000.00');
      expect(result[0].amount).not.toContain('₹');
      expect(result[0].amount).not.toContain('Rs.');
    });

    it('should handle zero amounts correctly in PDF format', () => {
      const event = createMockEvent({
        amount: 0,
      });

      const result = transformEventsToReportRowsForPDF([event]);

      expect(result[0].amount).toBe('0.00');
    });

    it('should handle large amounts correctly in PDF format', () => {
      const event = createMockEvent({
        amount: 1000000, // 10 lakh
      });

      const result = transformEventsToReportRowsForPDF([event]);

      expect(result[0].amount).toBe('10,00,000.00');
    });
  });
});
