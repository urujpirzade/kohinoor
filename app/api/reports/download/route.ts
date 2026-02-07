/**
 * API Route: Download Reports
 *
 * This route handles POST requests to generate and download event booking reports
 * in PDF or Excel format. It validates the request, filters events by date range,
 * generates the appropriate file format, and returns the file with proper headers.
 *
 * Requirements:
 * - 9.1: Create PDF file containing the filtered report data
 * - 9.4: Generate PDF filename using file name generator
 * - 9.5: Trigger browser download for PDF
 * - 10.1: Create Excel file containing the filtered report data
 * - 10.4: Generate Excel filename using file name generator
 * - 10.5: Trigger browser download for Excel
 * - 12.4: Handle errors with appropriate status codes (400, 500)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchEventsByDateRange,
  validateDateRange,
} from '@/lib/services/reportService';
import {
  transformEventsToReportRows,
  transformEventsToReportRowsForPDF,
} from '@/lib/utils/reportTransformer';
import { calculateSummary } from '@/lib/utils/summaryCalculator';
import { generatePDF } from '@/lib/generators/pdfGenerator';
import { generateExcel } from '@/lib/generators/excelGenerator';
import { generateReportFileName } from '@/lib/utils/fileNameGenerator';
import type {
  DownloadReportRequest,
  ErrorResponse,
  DateRange,
  EventRecord,
} from '@/lib/types/report';

/**
 * POST handler for downloading reports
 *
 * @param request - Next.js request object
 * @returns File buffer with appropriate headers or error response
 *
 * Requirements:
 * - Parse and validate request body (startDate, endDate, format)
 * - Call report service to fetch filtered events
 * - Transform events to report rows
 * - Calculate summary
 * - Generate PDF or Excel based on format parameter
 * - Generate filename using file name generator
 * - Set appropriate Content-Type and Content-Disposition headers
 * - Return file buffer
 * - Handle errors with appropriate status codes (400, 500)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let requestBody: DownloadReportRequest;

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
    const {
      startDate: startDateStr,
      endDate: endDateStr,
      format,
    } = requestBody;

    if (!startDateStr || !endDateStr || !format) {
      const errorResponse: ErrorResponse = {
        error: 'MISSING_PARAMETERS',
        message: 'startDate, endDate, and format are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate format parameter
    if (format !== 'pdf' && format !== 'excel') {
      const errorResponse: ErrorResponse = {
        error: 'INVALID_FORMAT',
        message: 'Format must be either "pdf" or "excel"',
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
    const { events } = await fetchEventsByDateRange(dateRange);

    // Calculate summary statistics (use original events for calculations)
    const summary = calculateSummary(events as unknown as EventRecord[]);

    // Generate file based on format
    let fileBuffer: Buffer;
    let contentType: string;
    let fileExtension: 'pdf' | 'xlsx';
    let rows;

    if (format === 'pdf') {
      // Transform events to report rows with PDF-compatible formatting
      rows = transformEventsToReportRowsForPDF(
        events as unknown as EventRecord[],
      );

      fileBuffer = await generatePDF({
        rows,
        summary,
        dateRange,
      });
      contentType = 'application/pdf';
      fileExtension = 'pdf';
    } else {
      // format === 'excel' - use regular formatting with ₹ symbol
      rows = transformEventsToReportRows(events as unknown as EventRecord[]);

      fileBuffer = await generateExcel({
        rows,
        summary,
        dateRange,
      });
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileExtension = 'xlsx';
    }

    // Generate filename
    const filename = generateReportFileName(
      dateRange.startDate,
      dateRange.endDate,
      fileExtension,
    );

    // Set response headers for file download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Length', fileBuffer.length.toString());

    // Return file buffer
    return new NextResponse(fileBuffer as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error in /api/reports/download:', error);

    // Return server error response
    const errorResponse: ErrorResponse = {
      error: 'SERVER_ERROR',
      message: 'Failed to generate report file',
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
