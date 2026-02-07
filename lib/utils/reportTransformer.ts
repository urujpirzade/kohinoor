/**
 * Report Data Transformer Utility
 *
 * This module transforms Event objects into ReportRow format for display in reports.
 * It handles serial number generation, data mapping, status calculation, and currency formatting.
 *
 * Requirements:
 * - 4.1: Generate sequential Sr No starting from 1
 * - 4.2: Map Event.client_name to name field
 * - 4.3: Map Event.event_name to eventType field
 * - 4.4: Map Event.amount to amount field
 * - 4.5: Calculate event status for each row
 */

import {
  formatAmountWithoutSymbol,
  formatAmountWithoutSymbolForPDF,
} from './currencyFormatter';
import { calculateEventStatus } from './eventStatus';
import { processPDFText } from './textProcessor';
import type { EventRecord, ReportRow } from '../types/report';

/**
 * Transforms an array of Event objects into ReportRow format
 *
 * @param events - Array of Event objects to transform
 * @returns Array of ReportRow objects with sequential serial numbers and formatted data
 *
 * Requirements:
 * - 4.1: Generates sequential Sr No starting from 1
 * - 4.2: Maps Event.client_name to name field
 * - 4.3: Maps Event.event_name to eventType field
 * - 4.4: Maps Event.amount to amount field (formatted as currency)
 * - 4.5: Calculates event status for each row
 */
export function transformEventsToReportRows(
  events: EventRecord[],
): ReportRow[] {
  return events.map((event, index) => ({
    srNo: index + 1, // Sequential serial number starting from 1
    name: event.client_name,
    eventType: event.event_name,
    date: event.date.toLocaleDateString('en-IN'), // Format date for display
    contact: event.contact,
    amount: formatAmountWithoutSymbol(event.amount), // Format amount without currency symbol
    status: calculateEventStatus(event.date), // Calculate event status
  }));
}

/**
 * Transforms an array of Event objects into ReportRow format for PDF documents
 * Uses PDF-compatible currency formatting (Rs. instead of ₹) and text processing
 * for Devanagari script compatibility
 *
 * @param events - Array of Event objects to transform
 * @returns Array of ReportRow objects with sequential serial numbers and PDF-compatible formatting
 */
export function transformEventsToReportRowsForPDF(
  events: EventRecord[],
): ReportRow[] {
  return events.map((event, index) => ({
    srNo: index + 1, // Sequential serial number starting from 1
    name: processPDFText(event.client_name), // Process text for PDF compatibility
    eventType: processPDFText(event.event_name), // Process text for PDF compatibility
    date: event.date.toLocaleDateString('en-IN'), // Format date for display
    contact: event.contact,
    amount: formatAmountWithoutSymbolForPDF(event.amount), // Format amount without currency symbol for PDF
    status: calculateEventStatus(event.date), // Calculate event status
  }));
}
