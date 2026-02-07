/**
 * Event Status Calculator Utility
 *
 * Determines whether an event is "Complete" or "Upcoming" based on the event date
 * compared to the current date using timezone-safe UTC comparison.
 */

import type { EventStatus } from '../types/report';

/**
 * Calculates the status of an event based on its date compared to the current date.
 *
 * Uses timezone-safe comparison by converting both dates to UTC for comparison.
 *
 * @param eventDate - The date of the event
 * @returns "Complete" if the event date is in the past, "Upcoming" if today or in the future
 *
 * Requirements:
 * - 6.1: WHEN Event.date is earlier than the current date, THE Event_Status_Calculator SHALL set Event Status to "Complete"
 * - 6.2: WHEN Event.date is equal to the current date, THE Event_Status_Calculator SHALL set Event Status to "Upcoming"
 * - 6.3: WHEN Event.date is later than the current date, THE Event_Status_Calculator SHALL set Event Status to "Upcoming"
 * - 6.4: THE Event_Status_Calculator SHALL use timezone-safe date comparison for status determination
 */
export function calculateEventStatus(eventDate: Date): EventStatus {
  // Get current date in UTC (start of day)
  const currentDate = new Date();
  const currentDateUTC = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
    ),
  );

  // Convert event date to UTC (start of day)
  const eventDateUTC = new Date(
    Date.UTC(
      eventDate.getUTCFullYear(),
      eventDate.getUTCMonth(),
      eventDate.getUTCDate(),
    ),
  );

  // Compare dates: if event date is before current date, it's complete
  if (eventDateUTC.getTime() < currentDateUTC.getTime()) {
    return 'Complete';
  }

  // If event date is today or in the future, it's upcoming
  return 'Upcoming';
}
