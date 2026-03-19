/**
 * API layer for transaction data
 * Simulates backend API calls with setTimeout delays
 */

import type { Transaction, SpendSummary, CategoryBreakdown, Department } from '../types/index';
import {
  mockTransactions,
  getMockSummary,
  getMockCategoryBreakdown,
  getMockDepartments,
} from '../data/mockTransactions';

const API_DELAY = 500; // milliseconds

/**
 * Fetches list of all transactions
 * Simulates network delay with 500ms setTimeout
 */
export async function fetchTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, API_DELAY);
  });
}

/**
 * Fetches spend summary metrics
 * Simulates network delay with 500ms setTimeout
 */
export async function fetchSummary(): Promise<SpendSummary> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary = getMockSummary(mockTransactions);
      resolve(summary);
    }, API_DELAY);
  });
}

/**
 * Fetches category breakdown
 * Simulates network delay with 500ms setTimeout
 */
export async function fetchCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const breakdown = getMockCategoryBreakdown(mockTransactions);
      resolve(breakdown);
    }, API_DELAY);
  });
}

/**
 * Fetches departments list
 * Simulates network delay with 500ms setTimeout
 */
export async function fetchDepartments(): Promise<Department[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const departments = getMockDepartments();
      resolve(departments);
    }, API_DELAY);
  });
}
