import React, { useState, useCallback } from 'react';
import type { Transaction, Category, Status } from '../types/index';
import type { Filters } from '../hooks/useTransactionFilters';
import { exportTransactionsToCsv } from '../utils/exportCsv';

/**
 * Array of valid category values
 */
const CATEGORIES: Category[] = ['Travel', 'SaaS', 'Meals', 'Office', 'Marketing', 'Other'];

/**
 * Array of valid status values
 */
const STATUSES: Status[] = ['approved', 'pending', 'flagged'];

/**
 * Props for the TransactionFilters component
 */
interface TransactionFiltersProps {
  /** Current filter state */
  filters: Filters;
  /** Callback to update filters */
  onFiltersChange: (filters: Filters) => void;
  /** Callback to toggle a category */
  onToggleCategory: (category: Category) => void;
  /** Callback to toggle a status */
  onToggleStatus: (status: Status) => void;
  /** Callback to clear all filters */
  onClearFilters: () => void;
  /** Count of active filters */
  activeFilterCount: number;
  /** Filtered transactions to export */
  filteredTransactions?: Transaction[];
}

/**
 * Search icon component
 */
const SearchIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

/**
 * Download icon component
 */
const DownloadIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

/**
 * Category filter dropdown component
 */
interface CategoryDropdownProps {
  selectedCategories: Category[];
  onToggleCategory: (category: Category) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategories,
  onToggleCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center gap-2"
      >
        Category
        {selectedCategories.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {selectedCategories.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="p-3 space-y-2">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Status filter chips component
 */
interface StatusFilterProps {
  selectedStatuses: Status[];
  onToggleStatus: (status: Status) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatuses, onToggleStatus }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-gray-700">Status:</span>
      {STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => onToggleStatus(status)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedStatuses.includes(status)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
};

/**
 * TransactionFilters component for filtering transactions
 * Provides search, category filter, status filter, and date range controls
 */
const TransactionFiltersInternal: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  onToggleCategory,
  onToggleStatus,
  onClearFilters,
  activeFilterCount,
  filteredTransactions = [],
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExportCsv = useCallback(async () => {
    // Wrapped in useCallback to prevent new function reference on every filter change.
    // If export button is memoized or tracked as dependency elsewhere, this prevents
    // unnecessary re-renders or re-calculation of dependent effects.
    if (filteredTransactions.length === 0) {
      return;
    }

    try {
      setIsDownloading(true);
      // Small delay to show the downloading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      exportTransactionsToCsv(filteredTransactions, 'transactions');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export transactions. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [filteredTransactions]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search merchant or cardholder..."
          value={filters.searchText}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              searchText: e.target.value,
            })
          }
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Category Dropdown */}
        <CategoryDropdown
          selectedCategories={filters.selectedCategories}
          onToggleCategory={onToggleCategory}
        />

        {/* Status Chips */}
        <StatusFilter selectedStatuses={filters.selectedStatuses} onToggleStatus={onToggleStatus} />

        {/* Date Range Inputs */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                startDate: e.target.value || null,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start date"
          />
          <span className="text-gray-500 text-sm">to</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                endDate: e.target.value || null,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Active Filters Badge and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-200">
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Active filters:</span>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {activeFilterCount}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={isDownloading || filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Export CSV'}
          </button>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Memoized TransactionFilters prevents re-renders when parent Dashboard updates
 * filter state. Without memoization, all child filter controls (dropdowns, chips,
 * input fields) re-render even when only one filter changes, causing janky UI.
 */
export const TransactionFilters = React.memo(TransactionFiltersInternal);

export default TransactionFilters;
