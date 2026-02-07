/**
 * Excel Generator for Event Booking Reports
 *
 * This module generates Excel spreadsheets from report data using ExcelJS.
 * It creates a formatted Excel file with worksheet, headers, data rows, and summary section.
 *
 * Requirements:
 * - 10.1: Create Excel file containing the filtered report data
 * - 10.2: Include all report columns in the specified order
 * - 10.3: Include the summary section
 * - 4.6: Display columns in exact order: Sr No, Name, Event Type, Amount, Event Status
 * - 7.5: Position summary section at bottom of report
 */

import ExcelJS from 'exceljs';
import { formatAmountWithoutSymbol } from '../utils/currencyFormatter';
import type { ExcelGeneratorOptions } from '../types/report';

/**
 * Generates an Excel spreadsheet from report data
 *
 * @param options - Configuration options for Excel generation
 * @returns Promise that resolves to Excel buffer
 *
 * Requirements:
 * - 10.1: Creates Excel file containing the filtered report data
 * - 10.2: Includes all report columns in the specified order
 * - 10.3: Includes the summary section
 * - 4.6: Displays columns in exact order: Sr No, Name, Event Type, Date, Contact, Amount, Status
 * - 7.5: Positions summary section at bottom of report
 */
export async function generateExcel(
  options: ExcelGeneratorOptions,
): Promise<Buffer> {
  const { rows, summary, dateRange } = options;

  try {
    // Create new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Event Report');

    // Set worksheet properties
    worksheet.properties.defaultRowHeight = 20;

    // Add title row
    const titleRow = worksheet.addRow(['Event Booking Report']);
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center' };
    worksheet.mergeCells('A1:G1');

    // Add date range row
    const startDateStr = dateRange.startDate.toLocaleDateString('en-IN');
    const endDateStr = dateRange.endDate.toLocaleDateString('en-IN');
    const dateRow = worksheet.addRow([`From ${startDateStr} to ${endDateStr}`]);
    dateRow.getCell(1).font = { size: 12 };
    dateRow.getCell(1).alignment = { horizontal: 'center' };
    worksheet.mergeCells('A2:G2');

    // Add empty row for spacing
    worksheet.addRow([]);

    // Add header row with column names
    const headerRow = worksheet.addRow([
      'Sr No',
      'Name',
      'Event Type',
      'Date',
      'Contact',
      'Amount (₹)',
      'Status',
    ]);

    // Style header row
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Add data rows
    rows.forEach((row) => {
      const dataRow = worksheet.addRow([
        row.srNo,
        row.name,
        row.eventType,
        row.date,
        row.contact,
        row.amount,
        row.status,
      ]);

      // Style data row
      dataRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Align columns appropriately
        switch (colNumber) {
          case 1: // Sr No
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            break;
          case 2: // Name
          case 3: // Event Type
          case 5: // Contact
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
            break;
          case 4: // Date
          case 7: // Status
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            break;
          case 6: // Amount
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
            break;
        }
      });
    });

    // Add empty row before summary
    worksheet.addRow([]);

    // Add summary section
    const summaryHeaderRow = worksheet.addRow(['Summary']);
    summaryHeaderRow.getCell(1).font = { bold: true, size: 12 };
    summaryHeaderRow.getCell(1).alignment = { horizontal: 'left' };

    // Add summary data
    const totalBookingsRow = worksheet.addRow([
      'Total Bookings',
      summary.totalBookings,
    ]);
    totalBookingsRow.getCell(1).font = { bold: true };
    totalBookingsRow.getCell(2).alignment = { horizontal: 'left' };

    const totalTurnoverRow = worksheet.addRow([
      'Total Turnover',
      formatAmountWithoutSymbol(summary.totalTurnover),
    ]);
    totalTurnoverRow.getCell(1).font = { bold: true };
    totalTurnoverRow.getCell(2).alignment = { horizontal: 'left' };

    // Set column widths
    worksheet.getColumn(1).width = 8; // Sr No
    worksheet.getColumn(2).width = 20; // Name
    worksheet.getColumn(3).width = 20; // Event Type
    worksheet.getColumn(4).width = 12; // Date
    worksheet.getColumn(5).width = 15; // Contact
    worksheet.getColumn(6).width = 15; // Amount
    worksheet.getColumn(7).width = 12; // Status

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    throw new Error(
      `Failed to generate Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
