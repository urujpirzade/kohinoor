/**
 * TypeScript type definitions for Event Hall Booking Reports
 *
 * This file contains all shared types and interfaces used across
 * the reporting module for type safety and consistency.
 */

// Import and re-export Event type from Prisma with alias to avoid DOM Event conflict
import type { Event as PrismaEvent } from '@prisma/client';
export type EventRecord = PrismaEvent;

// Core data types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ReportRow {
  srNo: number;
  name: string;
  eventType: string;
  date: string;
  contact: string;
  amount: string;
  status: EventStatus;
}

export interface ReportSummary {
  totalBookings: number;
  totalTurnover: number;
}

export type EventStatus = 'Complete' | 'Upcoming';

// API Request types
export interface ReportDataRequest {
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
}

export interface DownloadReportRequest extends ReportDataRequest {
  format: 'pdf' | 'excel';
}

// API Response types
export interface ReportDataResponse {
  rows: ReportRow[];
  summary: ReportSummary;
  count: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string; // Optional technical details (dev mode only)
}

// File generator options
export interface PDFGeneratorOptions {
  rows: ReportRow[];
  summary: ReportSummary;
  dateRange: DateRange;
}

export interface ExcelGeneratorOptions {
  rows: ReportRow[];
  summary: ReportSummary;
  dateRange: DateRange;
}

// Service layer types
export interface FilteredEventsResult {
  events: EventRecord[];
  count: number;
}
