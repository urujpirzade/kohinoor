/**
 * API Route: Fetch Report Data
 *
 * This route handles POST requests to fetch filtered event booking report data.
 * It validates the request, filters events by date range, transforms the data,
 * and returns a JSON response with report rows, summary, and count.
 *
 * Requirements:
 * - 3.1: Call report service to fetch filtered events
 * - 3.2: Include only records where Event.date >= start date
 * - 3.3: Include only records where Event.date <= end date
 * - 12.4: Handle errors with appropriate status codes (400, 500)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchEventsByDateRange,
  validateDateRange,
} from '@/lib/services/reportService';
import { transformEventsToReportRows } from '@/lib/utils/reportTransformer';
import { calculateSummary } from '@/lib/utils/summaryCalculator';
import type {
  ReportDataRequest,
  ReportDataResponse,
  ErrorResponse,
  DateRange,
  EventRecord,
} from '@/lib/types/report';

/**
 * POST handler for fetching report data
 *
 * @param request - Next.js request object
 * @returns JSON response with report data or error
 *
 * Requirements:
 * - Parse and validate request body (startDate, endDate)
 * - Call report service to fetch filtered events
 * - Transform events to report rows
 * - Calculate summary
 * - Return JSON response with rows, summary, and count
 * - Handle errors with appropriate status codes (400, 500)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let requestBody: ReportDataRequest;

    try {
      requestBody = await request.json();
    } catch {
      const errorResponse: ErrorResponse = {
        error: 'INVALID_JSON',
        message: 'Invalid JSON in request body',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate required fields
    const { startDate: startDateStr, endDate: endDateStr } = requestBody;

    if (!startDateStr || !endDateStr) {
      const errorResponse: ErrorResponse = {
        error: 'MISSING_PARAMETERS',
        message: 'Both startDate and endDate are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Parse and validate dates
    let dateRange: DateRange;

    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }

      dateRange = { startDate, endDate };

      // Validate date range
      validateDateRange(dateRange);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'INVALID_DATE_RANGE',
        message:
          error instanceof Error
            ? error.message
            : 'Invalid date format. Expected ISO 8601 format.',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Fetch filtered events from database
    const { events, count } = await fetchEventsByDateRange(dateRange);

    // Transform events to report rows
    const rows = transformEventsToReportRows(
      events as unknown as EventRecord[],
    );

    // Calculate summary statistics
    const summary = calculateSummary(events as unknown as EventRecord[]);

    // Return successful response
    const response: ReportDataResponse = {
      rows,
      summary,
      count,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in /api/reports/data:', error);

    // Return server error response
    const errorResponse: ErrorResponse = {
      error: 'SERVER_ERROR',
      message: 'Failed to fetch report data',
      details:
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : undefined,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
