/**
 * Currency formatting utilities for Indian Rupee (INR)
 */

/**
 * Formats a number as Indian Rupee currency
 * @param amount - The numeric amount to format
 * @returns Formatted string with ₹ symbol and proper locale formatting
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Formats a number as Indian Rupee currency for PDF documents
 * Uses "Rs." instead of ₹ symbol to ensure compatibility with PDF fonts
 * @param amount - The numeric amount to format
 * @returns Formatted string with Rs. prefix and proper locale formatting
 */
export function formatINRForPDF(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `Rs. ${formatted}`;
}

/**
 * Formats a number without currency symbol for Excel reports
 * @param amount - The numeric amount to format
 * @returns Formatted string with proper locale formatting but no currency symbol
 */
export function formatAmountWithoutSymbol(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number without currency symbol for PDF reports
 * @param amount - The numeric amount to format
 * @returns Formatted string with proper locale formatting but no currency symbol
 */
export function formatAmountWithoutSymbolForPDF(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
