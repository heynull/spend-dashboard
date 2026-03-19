import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CategoryBreakdown, Category } from '../types/index';

/**
 * Props for the SpendBreakdownChart component
 */
interface SpendBreakdownChartProps {
  /** Array of category breakdown data to display */
  data: CategoryBreakdown[];
}

/**
 * Color mapping for transaction categories
 * Provides consistent colors across the application
 */
const CATEGORY_COLORS: Record<Category, string> = {
  'Travel': '#3B82F6', // Blue
  'SaaS': '#8B5CF6', // Purple
  'Meals': '#F59E0B', // Amber
  'Office': '#10B981', // Emerald
  'Marketing': '#EF4444', // Red
  'Other': '#6B7280', // Gray
};

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
 * Custom tooltip component for the pie chart
 */
const CustomTooltip = ({ active, payload }: { 
  active?: boolean; 
  payload?: Array<{ name: string; value: number; payload: CategoryBreakdown }>;
}) => {
  if (!active || !payload?.length) return null;
  
  const data = payload[0].payload as CategoryBreakdown;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg">
      <p className="font-semibold text-gray-900 text-sm">{data.category}</p>
      <p className="text-blue-600 font-medium text-sm">
        {formatCurrency(data.amount)}
      </p>
      <p className="text-gray-500 text-xs mt-1">{data.percentage.toFixed(1)}% of total</p>
    </div>
  );
};

/**
 * Renders legend with detailed information (amount and percentage)
 * This is a separate component to show alongside the chart
 */
interface DetailedLegendProps {
  data: CategoryBreakdown[];
}

const DetailedLegend: React.FC<DetailedLegendProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <div key={item.category} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
            />
            <span className="text-sm font-medium text-gray-700 truncate">
              {item.category}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(item.amount)}
            </span>
            <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * SpendBreakdownChart component that displays spending by category
 * Shows a donut chart with custom colors, tooltip, and detailed legend
 */
export const SpendBreakdownChart: React.FC<SpendBreakdownChartProps> = ({ data }) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No spend data available</p>
      </div>
    );
  }

  // Memoize data transformation to prevent unnecessary Recharts re-renders.
  // chartData and colors arrays are recreated on every render without useMemo,
  // causing Recharts PieChart to recalculate paths/angles even when data hasn't
  // changed. This is expensive for large category lists.
  const { chartData, colors } = useMemo(() => {
    // Prepare data for Recharts
    const transformedChartData = data.map((item) => ({
      name: item.category,
      value: item.amount,
      ...item,
    }));

    // Get colors for each data entry
    const transformedColors = transformedChartData.map(
      (item) => CATEGORY_COLORS[item.category as Category]
    );

    return { chartData: transformedChartData, colors: transformedColors };
  }, [data]);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spend by Category</h3>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart */}
        <div className="w-full flex-1 min-h-64">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Breakdown</h4>
          <DetailedLegend data={data} />
        </div>
      </div>
    </div>
  );
};

export default SpendBreakdownChart;
