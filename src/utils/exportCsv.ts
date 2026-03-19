import type { Transaction } from '../types/index';

/**
 * Formats a number in cents to a USD currency string
 * @param cents - Amount in cents
 * @returns Formatted string like "$1,234.56"
 */
function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Formats an ISO date string to "Jan 12, 2025" format
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date like "Jan 12, 2025"
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Escapes a CSV field value, wrapping in quotes if it contains special characters
 * @param value - The field value to escape
 * @returns Escaped and quoted value if necessary
 */
function escapeCsvField(value: string): string {
  // If the field contains comma, newline, or double quote, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Converts transactions array to CSV format
 * @param transactions - Array of Transaction objects
 * @returns CSV formatted string
 */
function transactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    'Date',
    'Merchant',
    'Cardholder',
    'Department',
    'Category',
    'Amount',
    'Status',
  ];

  const rows = transactions.map((txn) => [
    escapeCsvField(formatDate(txn.date)),
    escapeCsvField(txn.merchant),
    escapeCsvField(txn.cardholderName),
    escapeCsvField(txn.department),
    escapeCsvField(txn.category),
    escapeCsvField(formatCurrency(txn.amount)),
    escapeCsvField(txn.status),
  ]);

  const headerRow = headers.map(escapeCsvField).join(',');
  const dataRows = rows.map((row) => row.join(',')).join('\n');

  return `${headerRow}\n${dataRows}`;
}

/**
 * Exports transactions to a CSV file and triggers browser download
 * @param transactions - Array of transactions to export
 * @param filename - Name of the file to download (without extension)
 */
export function exportTransactionsToCsv(
  transactions: Transaction[],
  filename: string = 'transactions'
): void {
  try {
    // Convert transactions to CSV
    const csv = transactionsToCSV(transactions);

    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the blob
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Set the download attributes
    link.href = url;
    link.download = `${filename}.csv`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export transactions to CSV:', error);
    throw new Error('Failed to export transactions. Please try again.');
  }
}

/**
 * Exports transactions to CSV with a timestamp in the filename
 * @param transactions - Array of transactions to export
 * @returns Generated filename
 */
export function exportTransactionsWithTimestamp(transactions: Transaction[]): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `transactions-${timestamp}`;
  exportTransactionsToCsv(transactions, filename);
  return filename;
}
