/**
 * PDF Generator for Event Booking Reports
 *
 * This module generates PDF documents from report data using jsPDF with autoTable.
 * It creates a formatted PDF with title, date range, structured data table with borders, and summary section.
 * The table uses a grid theme with vertical and horizontal lines for better readability.
 *
 * Requirements:
 * - 9.1: Create PDF file containing the filtered report data
 * - 9.2: Include all report columns in the specified order
 * - 9.3: Include the summary section
 * - 4.6: Display columns in exact order: Sr No, Name, Event Type, Date, Contact, Amount, Status
 * - 7.5: Position summary section at bottom of report
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatAmountWithoutSymbolForPDF } from '../utils/currencyFormatter';
import { getPDFTextProcessingNote } from '../utils/textProcessor';
import type { PDFGeneratorOptions } from '../types/report';

/**
 * Generates a PDF document from report data
 *
 * @param options - Configuration options for PDF generation
 * @returns Promise that resolves to PDF buffer
 *
 * Requirements:
 * - 9.1: Creates PDF file containing the filtered report data
 * - 9.2: Includes all report columns in the specified order
 * - 9.3: Includes the summary section
 * - 4.6: Displays columns in exact order: Sr No, Name, Event Type, Amount, Event Status
 * - 7.5: Positions summary section at bottom of report
 */
export async function generatePDF(
  options: PDFGeneratorOptions,
): Promise<Buffer> {
  const { rows, summary, dateRange } = options;

  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add title
    doc.setFontSize(19);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Booking Report', doc.internal.pageSize.getWidth() / 2, 20, {
      align: 'center',
    });

    // Add date range subtitle
    const startDateStr = dateRange.startDate.toLocaleDateString('en-IN');
    const endDateStr = dateRange.endDate.toLocaleDateString('en-IN');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `From ${startDateStr} to ${endDateStr}`,
      doc.internal.pageSize.getWidth() / 2,
      30,
      { align: 'center' },
    );

    // Prepare table data
    const tableColumns = [
      { header: 'Sr No', dataKey: 'srNo' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Event Type', dataKey: 'eventType' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Contact', dataKey: 'contact' },
      { header: 'Amount (Rs.)', dataKey: 'amount' },
      { header: 'Status', dataKey: 'status' },
    ];

    const tableRows = rows.map((row) => ({
      srNo: row.srNo.toString(),
      name: row.name,
      eventType: row.eventType,
      date: row.date,
      contact: row.contact,
      amount: row.amount,
      status: row.status,
    }));

    // Add table using autoTable plugin with full borders
    autoTable(doc, {
      columns: tableColumns,
      body: tableRows,
      startY: 45,
      theme: 'grid', // Use grid theme for full borders
      headStyles: {
        fillColor: [220, 220, 220], // Light gray header background
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 11,
        lineColor: [0, 0, 0], // Black border lines
        lineWidth: 0.5,
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0], // Black border lines
        lineWidth: 0.5,
        valign: 'middle',
      },
      columnStyles: {
        srNo: {
          halign: 'center',
          cellWidth: 15,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        name: {
          halign: 'left',
          cellWidth: 35,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        eventType: {
          halign: 'left',
          cellWidth: 35,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        date: {
          halign: 'center',
          cellWidth: 25,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        contact: {
          halign: 'center',
          cellWidth: 30,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        amount: {
          halign: 'center',
          cellWidth: 28,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        status: {
          halign: 'center',
          cellWidth: 22,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
      },
      margin: { top: 45, left: 10, right: 10 },
      tableWidth: 'auto',
      // Add alternating row colors for better readability
      alternateRowStyles: {
        fillColor: [248, 248, 248], // Very light gray for alternate rows
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      // Ensure all borders are drawn
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
    });

    // Get the final Y position after the table
    const docWithAutoTable = doc as jsPDF & {
      lastAutoTable?: { finalY: number };
    };
    const finalY = docWithAutoTable.lastAutoTable?.finalY || 100;

    // Add summary section as a structured table
    const summaryY = finalY + 20;

    // Check if we need a new page for summary
    if (summaryY > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();

      // Add summary as a table (centered)
      const pageWidth = doc.internal.pageSize.getWidth();
      const summaryTableWidth = 80;
      const summaryMarginLeft = (pageWidth - summaryTableWidth) / 2;

      autoTable(doc, {
        body: [
          ['Summary', ''],
          ['Total Bookings', summary.totalBookings.toString()],
          [
            'Total Turnover (Rs.)',
            formatAmountWithoutSymbolForPDF(summary.totalTurnover),
          ],
        ],
        startY: 30,
        theme: 'grid',
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 12,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles: {
          0: {
            halign: 'left',
            cellWidth: 40,
            fontStyle: 'bold',
            fillColor: [240, 240, 240],
          },
          1: {
            halign: 'center',
            cellWidth: 40,
          },
        },
        margin: { left: summaryMarginLeft },
        tableWidth: summaryTableWidth,
      });

      // Add text processing note
      doc.setFontSize(9);
      doc.text(getPDFTextProcessingNote(), 20, 90);
    } else {
      // Add summary as a table (centered)
      const pageWidth = doc.internal.pageSize.getWidth();
      const summaryTableWidth = 80;
      const summaryMarginLeft = (pageWidth - summaryTableWidth) / 2;

      autoTable(doc, {
        body: [
          ['Summary', ''],
          ['Total Bookings', summary.totalBookings.toString()],
          [
            'Total Turnover (Rs.)',
            formatAmountWithoutSymbolForPDF(summary.totalTurnover),
          ],
        ],
        startY: summaryY,
        theme: 'grid',
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 12,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles: {
          0: {
            halign: 'left',
            cellWidth: 40,
            fontStyle: 'bold',
            fillColor: [240, 240, 240],
          },
          1: {
            halign: 'center',
            cellWidth: 40,
          },
        },
        margin: { left: summaryMarginLeft },
        tableWidth: summaryTableWidth,
      });

      // Add text processing note
      doc.setFontSize(9);
      doc.text(getPDFTextProcessingNote(), 20, summaryY + 60);
    }

    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
