import React from 'react';
import type { SpendSummary } from '../types/index';

/**
 * Props for the SummaryCards component
 */
interface SummaryCardsProps {
  /** The spend summary data to display */
  summary: SpendSummary;
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
 * Trend indicator component showing directional change
 */
interface TrendIndicatorProps {
  percentChange: number;
  hasInsufficientPriorData?: boolean;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ percentChange, hasInsufficientPriorData }) => {
  const isNegative = percentChange < 0;
  const isPositive = percentChange > 0;
  
  // Format percent change with cap indicator
  const displayPercent = Math.abs(percentChange);
  const displayValue = Math.abs(percentChange) >= 999 ? '+999' : displayPercent;

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {isPositive && (
        <>
          <svg
            className="w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12 5.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L13 9.414V17a1 1 0 11-2 0V9.414l-2.293 2.293a1 1 0 11-1.414-1.414l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-red-600">{displayValue}%</span>
        </>
      )}
      {isNegative && (
        <>
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12 15.707a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 10.586V3a1 1 0 112 0v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-green-600">{displayValue}%</span>
        </>
      )}
      {percentChange === 0 && (
        <span className="text-gray-600">—</span>
      )}
    </div>
  );
};

/**
 * Individual metric card component
 */
interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtitle, trend }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {trend && <div>{trend}</div>}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

/**
 * SummaryCards component that displays key spend metrics
 * Renders 4 responsive metric cards: total spend, transaction count, top category, and period change
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formattedTotal = formatCurrency(summary.totalSpend);
  const changeDirection = summary.percentChange < 0 ? 'decrease' : 'increase';
  const changeSubtitle = summary.hasInsufficientPriorData ? 'Insufficient prior data' : `Spend ${changeDirection}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Spend Card */}
      <MetricCard
        label="Total Spend"
        value={formattedTotal}
        subtitle={`${summary.transactionCount} transactions`}
      />

      {/* Transaction Count Card */}
      <MetricCard
        label="Transaction Count"
        value={summary.transactionCount}
        subtitle="All statuses included"
      />

      {/* Top Category Card */}
      <MetricCard
        label="Top Category"
        value={summary.topCategory}
        subtitle="By spending amount"
      />

      {/* Change Card */}
      <MetricCard
        label="vs Last Period"
        value={<TrendIndicator percentChange={summary.percentChange} hasInsufficientPriorData={summary.hasInsufficientPriorData} />}
        subtitle={changeSubtitle}
      />
    </div>
  );
};

export default SummaryCards;
