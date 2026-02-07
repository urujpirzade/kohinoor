/**
 * Summary Calculator Utility
 *
 * This module provides functionality to calculate summary statistics for event booking reports.
 * It computes total bookings count and total turnover from an array of Event objects.
 *
 * Requirements:
 * - 7.1: THE Summary_Calculator SHALL compute the total number of events in the filtered results
 * - 7.2: THE Summary_Calculator SHALL display the total count as "Total Bookings"
 * - 7.3: THE Summary_Calculator SHALL compute the sum of all Event.amount values in the filtered results
 * - 7.4: THE Summary_Calculator SHALL display the sum as "Total Turnover" formatted in Indian Rupees
 */

import type { EventRecord, ReportSummary } from '../types/report';

/**
 * Calculates summary statistics for a collection of events
 *
 * @param events - Array of Event objects to calculate summary for
 * @returns ReportSummary object containing totalBookings and totalTurnover
 *
 * Requirements:
 * - 7.1: Computes the total number of events in the filtered results
 * - 7.2: Returns the total count as totalBookings
 * - 7.3: Computes the sum of all Event.amount values in the filtered results
 * - 7.4: Returns the sum as totalTurnover (formatting is handled elsewhere)
 */
export function calculateSummary(events: EventRecord[]): ReportSummary {
  // Handle empty array case
  if (!events || events.length === 0) {
    return {
      totalBookings: 0,
      totalTurnover: 0,
    };
  }

  // Calculate total bookings (count of events)
  const totalBookings = events.length;

  // Calculate total turnover (sum of all amounts)
  const totalTurnover = events.reduce((sum, event) => {
    // Ensure amount is a number and handle potential null/undefined values
    const amount = typeof event.amount === 'number' ? event.amount : 0;
    return sum + amount;
  }, 0);

  return {
    totalBookings,
    totalTurnover,
  };
}
