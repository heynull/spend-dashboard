import type { Transaction } from '../types/index';

/**
 * Calculates the start date for a given date range
 * @param range - The date range type ('last30', 'last90', 'thisYear')
 * @param referenceDate - Optional reference date to calculate from (defaults to today)
 * @returns Date object representing the start of the range
 */
export function getDateRangeStart(
  range: 'last30' | 'last90' | 'thisYear',
  referenceDate: Date = new Date()
): Date {
  const start = new Date(referenceDate);

  switch (range) {
    case 'last30':
      start.setDate(start.getDate() - 30);
      break;
    case 'last90':
      start.setDate(start.getDate() - 90);
      break;
    case 'thisYear':
      start.setFullYear(start.getFullYear());
      start.setMonth(0);
      start.setDate(1);
      break;
  }

  return start;
}

/**
 * Calculates the start date for the previous equivalent period
 * @param range - The current date range type
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Date object representing the start of the previous period
 */
export function getPreviousPeriodStart(
  range: 'last30' | 'last90' | 'thisYear',
  referenceDate: Date = new Date()
): Date {
  const start = new Date(referenceDate);

  switch (range) {
    case 'last30':
      start.setDate(start.getDate() - 60);
      break;
    case 'last90':
      start.setDate(start.getDate() - 180);
      break;
    case 'thisYear':
      // Previous year, Jan 1 to Dec 31
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(0);
      start.setDate(1);
      break;
  }

  return start;
}

/**
 * Calculates the end date for the previous equivalent period
 * @param range - The current date range type
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Date object representing the end of the previous period
 */
export function getPreviousPeriodEnd(
  range: 'last30' | 'last90' | 'thisYear',
  referenceDate: Date = new Date()
): Date {
  const end = new Date(referenceDate);

  switch (range) {
    case 'last30':
      end.setDate(end.getDate() - 31);
      break;
    case 'last90':
      end.setDate(end.getDate() - 91);
      break;
    case 'thisYear':
      // End of previous year
      end.setFullYear(end.getFullYear() - 1);
      end.setMonth(11);
      end.setDate(31);
      break;
  }

  return end;
}

/**
 * Filters transactions by the specified date range
 * @param transactions - Array of transactions to filter
 * @param range - The date range to filter by
 * @returns Filtered array of transactions within the specified range
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  range: 'last30' | 'last90' | 'thisYear'
): Transaction[] {
  const now = new Date();
  const rangeStart = getDateRangeStart(range, now);

  return transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    return txnDate >= rangeStart && txnDate <= now;
  });
}

/**
 * Gets transactions from the previous equivalent period
 * @param transactions - Array of transactions to filter
 * @param range - The current date range type
 * @returns Filtered array of transactions from the previous period
 */
export function getTransactionsFromPreviousPeriod(
  transactions: Transaction[],
  range: 'last30' | 'last90' | 'thisYear'
): Transaction[] {
  const now = new Date();
  const periodStart = getPreviousPeriodStart(range, now);
  const periodEnd = getPreviousPeriodEnd(range, now);

  return transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    return txnDate >= periodStart && txnDate <= periodEnd;
  });
}
