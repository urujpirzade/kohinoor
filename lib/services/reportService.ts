/**
 * Report Service
 *
 * This module provides data access functionality for event booking reports.
 * It handles fetching filtered events from the database with date range filtering and sorting.
 *
 * Requirements:
 * - 3.1: Fetch events from the Event_Table
 * - 3.2: Include only records where Event.date >= start date
 * - 3.3: Include only records where Event.date <= end date
 * - 8.1: Sort results by date ascending
 */

import prisma from '../db';
import type {
  EventRecord,
  DateRange,
  FilteredEventsResult,
} from '../types/report';

/**
 * Fetches events from the database filtered by date range
 *
 * @param dateRange - Object containing startDate and endDate for filtering
 * @returns Promise resolving to FilteredEventsResult with events and count
 *
 * Requirements:
 * - 3.1: Fetches events from the Event table using Prisma
 * - 3.2: Filters events where Event.date >= startDate
 * - 3.3: Filters events where Event.date <= endDate
 * - 8.1: Sorts results by date in ascending order
 */
export async function fetchEventsByDateRange(
  dateRange: DateRange,
): Promise<FilteredEventsResult> {
  try {
    const { startDate, endDate } = dateRange;

    // Ensure dates are properly formatted for comparison
    // Convert to start of day for startDate and end of day for endDate
    const startOfDay = new Date(startDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Fetch events with date filtering and sorting
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startOfDay, // Greater than or equal to start date
          lte: endOfDay, // Less than or equal to end date
        },
      },
      orderBy: {
        date: 'asc', // Sort by date ascending
      },
    });

    return {
      events,
      count: events.length,
    };
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw new Error('Failed to fetch events from database');
  }
}

/**
 * Validates that a date range is valid
 *
 * @param dateRange - The date range to validate
 * @throws Error if the date range is invalid
 */
export function validateDateRange(dateRange: DateRange): void {
  const { startDate, endDate } = dateRange;

  if (!startDate || !endDate) {
    throw new Error('Both start date and end date are required');
  }

  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Start date and end date must be valid Date objects');
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Start date and end date must be valid dates');
  }

  if (startDate > endDate) {
    throw new Error('Start date must be before or equal to end date');
  }
}
