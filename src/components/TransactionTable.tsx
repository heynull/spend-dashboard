import React, { useReducer, useMemo, useCallback } from 'react';
import type { Transaction, Status, Category } from '../types/index';

/**
 * Example usage with filtering:
 * ```
 * const { filteredTransactions, filters, ... } = useTransactionFilters(mockTransactions);
 * return (
 *   <>
 *     <TransactionFilters {...filterProps} />
 *     <TransactionTable transactions={filteredTransactions} />
 *   </>
 * );
 * ```
 */

/**
 * Props for the TransactionTable component
 */
interface TransactionTableProps {
  /** Array of transactions to display (can be filtered via useTransactionFilters hook) */
  transactions: Transaction[];
}

/**
 * State for table sorting and pagination
 */
interface TableState {
  /** Column to sort by */
  sortBy: keyof Transaction | null;
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Current page (0-indexed) */
  currentPage: number;
}

/**
 * Action types for table state management
 */
type TableAction =
  | {
      type: 'SORT';
      column: keyof Transaction;
    }
  | {
      type: 'NEXT_PAGE';
      maxPage: number;
    }
  | {
      type: 'PREV_PAGE';
    };

/**
 * Reducer for managing table state
 */
function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'SORT': {
      // Toggle sort direction if clicking the same column, otherwise reset to ascending
      if (state.sortBy === action.column && state.sortDirection === 'asc') {
        return {
          ...state,
          sortDirection: 'desc',
        };
      }
      if (state.sortBy === action.column && state.sortDirection === 'desc') {
        return {
          ...state,
          sortBy: null,
          sortDirection: 'asc',
        };
      }
      return {
        ...state,
        sortBy: action.column,
        sortDirection: 'asc',
        currentPage: 0,
      };
    }
    case 'NEXT_PAGE':
      return {
        ...state,
        currentPage: Math.min(state.currentPage + 1, action.maxPage),
      };
    case 'PREV_PAGE':
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 0),
      };
    default:
      return state;
  }
}

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
 * Formats an ISO date string to "MMM DD, YYYY" format
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
 * Status badge component
 */
interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = 'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium min-w-[72px]';

  switch (status) {
    case 'approved':
      return (
        <span className={`${baseClasses} bg-green-100 text-green-700`}>
          Approved
        </span>
      );
    case 'pending':
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
          Pending
        </span>
      );
    case 'flagged':
      return (
        <span className={`${baseClasses} bg-red-100 text-red-700`}>
          Flagged
        </span>
      );
    default:
      return <span className={baseClasses}>{status}</span>;
  }
};

/**
 * Sort indicator component (up/down arrow)
 */
interface SortIndicatorProps {
  isActive: boolean;
  direction: 'asc' | 'desc' | null;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ isActive, direction }) => {
  if (!isActive) {
    return <span className="inline-block w-4 h-4 opacity-0" />;
  }

  return (
    <svg
      className="inline-block w-4 h-4 ml-1"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {direction === 'asc' ? (
        <path
          fillRule="evenodd"
          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
};

/**
 * Sortable column header component
 */
interface ColumnHeaderProps {
  label: string;
  sortKey: keyof Transaction;
  isActive: boolean;
  direction: 'asc' | 'desc' | null;
  onClick: (column: keyof Transaction) => void;
  width?: string;
  align?: 'left' | 'center';
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  label,
  sortKey,
  isActive,
  direction,
  onClick,
  width = 'w-auto',
  align = 'left',
}) => (
  <th className={`px-0 py-0 ${align === 'center' ? 'text-center' : 'text-left'} ${width}`}>
    <button
      onClick={() => onClick(sortKey)}
      className={`w-full flex items-center gap-1 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer ${align === 'center' ? 'justify-center' : ''}`}
    >
      {label}
      <SortIndicator isActive={isActive} direction={direction} />
    </button>
  </th>
);

/**
 * TransactionTable component that displays transactions with sorting and pagination
 */
const TransactionTableInternal: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [state, dispatch] = useReducer(tableReducer, {
    sortBy: null,
    sortDirection: 'asc',
    currentPage: 0,
  });

  const ROWS_PER_PAGE = 15;

  // Memoize sorted transactions
  const sortedTransactions = useMemo(() => {
    if (!state.sortBy) {
      return transactions;
    }

    return [...transactions].sort((a, b) => {
      const aValue = a[state.sortBy!];
      const bValue = b[state.sortBy!];

      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return state.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return state.sortDirection === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  }, [transactions, state.sortBy, state.sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedTransactions.length / ROWS_PER_PAGE);
  const startIndex = state.currentPage * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, sortedTransactions.length);
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handleSort = useCallback((column: keyof Transaction) => {
    // Wrapped in useCallback to prevent new function reference on every render.
    // Child ColumnHeader components use this directly as onClick handler,
    // so memoization prevents unnecessary re-renders of those headers.
    dispatch({ type: 'SORT', column });
  }, []);

  const handleNextPage = useCallback(() => {
    // Wrapped in useCallback to maintain stable reference for pagination button.
    // Prevents button re-render when parent re-renders due to other state changes.
    dispatch({ type: 'NEXT_PAGE', maxPage: totalPages - 1 });
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    // Wrapped in useCallback to maintain stable reference for pagination button.
    // Prevents button re-render when parent re-renders due to other state changes.
    dispatch({ type: 'PREV_PAGE' });
  }, []);

  // Handle empty state
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <ColumnHeader
                label="Date"
                sortKey="date"
                isActive={state.sortBy === 'date'}
                direction={state.sortBy === 'date' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-28"
                align="center"
              />
              <ColumnHeader
                label="Merchant"
                sortKey="merchant"
                isActive={state.sortBy === 'merchant'}
                direction={state.sortBy === 'merchant' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-36"
                align="left"
              />
              <ColumnHeader
                label="Cardholder"
                sortKey="cardholderName"
                isActive={state.sortBy === 'cardholderName'}
                direction={state.sortBy === 'cardholderName' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-32"
                align="center"
              />
              <ColumnHeader
                label="Department"
                sortKey="department"
                isActive={state.sortBy === 'department'}
                direction={state.sortBy === 'department' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-28"
                align="center"
              />
              <ColumnHeader
                label="Category"
                sortKey="category"
                isActive={state.sortBy === 'category'}
                direction={state.sortBy === 'category' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-24"
                align="center"
              />
              <ColumnHeader
                label="Amount"
                sortKey="amount"
                isActive={state.sortBy === 'amount'}
                direction={state.sortBy === 'amount' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-24"
                align="center"
              />
              <ColumnHeader
                label="Status"
                sortKey="status"
                isActive={state.sortBy === 'status'}
                direction={state.sortBy === 'status' ? state.sortDirection : null}
                onClick={handleSort}
                width="w-24"
                align="center"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`hover:bg-gray-50 transition-colors ${
                  transaction.status === 'flagged'
                    ? 'border-l-2 border-red-400'
                    : 'border-l-2 border-transparent'
                }`}
              >
                <td className="w-28 px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-center">
                  {formatDate(transaction.date)}
                </td>
                <td className="w-36 px-4 py-3 text-sm text-gray-900 font-medium truncate text-left" title={transaction.merchant}>
                  {transaction.merchant}
                </td>
                <td className="w-32 px-4 py-3 text-sm text-gray-600 truncate text-center" title={transaction.cardholderName}>
                  {transaction.cardholderName}
                </td>
                <td className="w-28 px-4 py-3 text-sm text-gray-600 truncate text-center" title={transaction.department}>
                  {transaction.department}
                </td>
                <td className="w-24 px-4 py-3 text-sm text-gray-600 text-center">
                  {transaction.category}
                </td>
                <td className="w-24 px-4 py-3 text-sm font-semibold text-gray-900 text-center">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="w-24 px-4 py-3 text-sm text-center">
                  <StatusBadge status={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <p className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-semibold">
            {transactions.length === 0 ? 0 : startIndex + 1}–{endIndex}
          </span>{' '}
          of <span className="font-semibold">{transactions.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={state.currentPage === 0}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 font-medium">
            Page {state.currentPage + 1} of {totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={state.currentPage >= totalPages - 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Memoized TransactionTable prevents re-renders when parent component updates
 * but transaction list hasn't changed. This is critical because parent Dashboard
 * re-renders frequently from filter state changes, but sorted/paginated view
 * should only update when actual transaction data changes.
 */
export const TransactionTable = React.memo(TransactionTableInternal);

export default TransactionTable;
