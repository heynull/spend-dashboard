import type { Category, Status, Transaction, CategoryBreakdown, Department, SpendSummary } from '../types'

/**
 * Generates a deterministic date based on transaction ID to ensure
 * proper distribution across 12 months:
 * - Last 30 days: TXN 001-025 (25 transactions)
 * - Last 90 days: TXN 026-050 (25 transactions, overlapping with above)
 * - Last 365 days: TXN 051-060 (10 transactions spread across year before last 90 days)
 */
function getTransactionDate(txnIdNumber: number): string {
  const now = new Date(2026, 2, 19); // March 19, 2026 (current date in context)
  let date: Date;

  if (txnIdNumber <= 25) {
    // Last 30 days - spread evenly
    const daysAgo = Math.floor((txnIdNumber - 1) * (30 / 25));
    date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  } else if (txnIdNumber <= 50) {
    // Days 31-90 - spread evenly across this range
    const offsetInRange = txnIdNumber - 25;
    const daysAgo = 30 + Math.floor(offsetInRange * (60 / 25));
    date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  } else {
    // Days 91-365 - spread across the earlier part of the year
    const offsetInRange = txnIdNumber - 50;
    const daysAgo = 90 + Math.floor(offsetInRange * (275 / 10));
    date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  }

  return date.toISOString().split('T')[0];
}

/**
 * Mock transaction data for a SaaS company
 */
export const mockTransactions: Transaction[] = [
  // SaaS Tools
  {
    id: 'TXN001',
    date: '2026-01-01',
    merchant: 'Slack',
    category: 'SaaS',
    amount: 19900,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN002',
    date: '2026-01-01',
    merchant: 'Notion',
    category: 'SaaS',
    amount: 12900,
    status: 'approved',
    cardholderName: 'Marcus Johnson',
    department: 'Product',
  },
  {
    id: 'TXN003',
    date: '2026-01-01',
    merchant: 'GitHub Enterprise',
    category: 'SaaS',
    amount: 29900,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN004',
    date: '2026-01-01',
    merchant: 'Figma',
    category: 'SaaS',
    amount: 15000,
    status: 'approved',
    cardholderName: 'Alex Rivera',
    department: 'Design',
  },
  {
    id: 'TXN005',
    date: '2026-01-01',
    merchant: 'Jira Cloud',
    category: 'SaaS',
    amount: 45000,
    status: 'approved',
    cardholderName: 'Marcus Johnson',
    department: 'Engineering',
  },
  {
    id: 'TXN006',
    date: '2026-01-01',
    merchant: 'Intercom',
    category: 'Marketing',
    amount: 89900,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN007',
    date: '2026-01-01',
    merchant: 'Segment',
    category: 'SaaS',
    amount: 125000,
    status: 'pending',
    cardholderName: 'David Park',
    department: 'Data',
  },
  {
    id: 'TXN008',
    date: '2026-01-01',
    merchant: 'Mixpanel',
    category: 'SaaS',
    amount: 85000,
    status: 'approved',
    cardholderName: 'David Park',
    department: 'Data',
  },
  {
    id: 'TXN009',
    date: '2026-01-01',
    merchant: 'Hubspot',
    category: 'Marketing',
    amount: 95000,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN010',
    date: '2026-01-01',
    merchant: 'Adobe Creative Cloud',
    category: 'SaaS',
    amount: 64900,
    status: 'approved',
    cardholderName: 'Alex Rivera',
    department: 'Design',
  },

  // Cloud Infrastructure
  {
    id: 'TXN011',
    date: '2026-01-01',
    merchant: 'AWS',
    category: 'SaaS',
    amount: 450000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN012',
    date: '2026-01-01',
    merchant: 'Google Cloud',
    category: 'SaaS',
    amount: 285000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN013',
    date: '2026-01-01',
    merchant: 'Datadog',
    category: 'SaaS',
    amount: 125000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },

  // Travel
  {
    id: 'TXN014',
    date: '2026-01-01',
    merchant: 'Delta Airlines',
    category: 'Travel',
    amount: 289900,
    status: 'approved',
    cardholderName: 'Michael Torres',
    department: 'Sales',
  },
  {
    id: 'TXN015',
    date: '2026-01-01',
    merchant: 'United Airlines',
    category: 'Travel',
    amount: 325000,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Sales',
  },
  {
    id: 'TXN016',
    date: '2026-01-01',
    merchant: 'Southwest Airlines',
    category: 'Travel',
    amount: 195000,
    status: 'approved',
    cardholderName: 'Michael Torres',
    department: 'Sales',
  },
  {
    id: 'TXN017',
    date: '2026-01-01',
    merchant: 'Marriott Hotels',
    category: 'Travel',
    amount: 425000,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Sales',
  },
  {
    id: 'TXN018',
    date: '2026-01-01',
    merchant: 'Hilton Hotels',
    category: 'Travel',
    amount: 365000,
    status: 'pending',
    cardholderName: 'Michael Torres',
    department: 'Sales',
  },
  {
    id: 'TXN019',
    date: '2026-01-01',
    merchant: 'Airbnb',
    category: 'Travel',
    amount: 285000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN020',
    date: '2026-01-01',
    merchant: 'Uber',
    category: 'Travel',
    amount: 45000,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Sales',
  },

  // Meals
  {
    id: 'TXN021',
    date: '2026-01-01',
    merchant: 'Starbucks',
    category: 'Meals',
    amount: 1200,
    status: 'approved',
    cardholderName: 'Marcus Johnson',
    department: 'Product',
  },
  {
    id: 'TXN022',
    date: '2026-01-01',
    merchant: 'OpenTable - The French Laundry',
    category: 'Meals',
    amount: 125000,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN023',
    date: '2026-01-01',
    merchant: 'DoorDash',
    category: 'Meals',
    amount: 8500,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN024',
    date: '2026-01-01',
    merchant: 'Sweetgreen',
    category: 'Meals',
    amount: 2800,
    status: 'approved',
    cardholderName: 'Alex Rivera',
    department: 'Design',
  },
  {
    id: 'TXN025',
    date: '2026-01-01',
    merchant: 'Shake Shack',
    category: 'Meals',
    amount: 3200,
    status: 'approved',
    cardholderName: 'David Park',
    department: 'Data',
  },
  {
    id: 'TXN026',
    date: '2026-01-01',
    merchant: 'Chipotle',
    category: 'Meals',
    amount: 1500,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN027',
    date: '2026-01-01',
    merchant: 'Uber Eats - Italian Kitchen',
    category: 'Meals',
    amount: 5600,
    status: 'flagged',
    cardholderName: 'Marcus Johnson',
    department: 'Product',
  },

  // Office
  {
    id: 'TXN028',
    date: '2026-01-01',
    merchant: 'WeWork',
    category: 'Office',
    amount: 850000,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },
  {
    id: 'TXN029',
    date: '2026-01-01',
    merchant: 'Staples',
    category: 'Office',
    amount: 12500,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },
  {
    id: 'TXN030',
    date: '2026-01-01',
    merchant: 'Herman Miller Furniture',
    category: 'Office',
    amount: 450000,
    status: 'pending',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },

  // Marketing
  {
    id: 'TXN031',
    date: '2026-01-01',
    merchant: 'Google Ads',
    category: 'Marketing',
    amount: 250000,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN032',
    date: '2026-01-01',
    merchant: 'Facebook Ads',
    category: 'Marketing',
    amount: 180000,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN033',
    date: '2026-01-01',
    merchant: 'LinkedIn Ads',
    category: 'Marketing',
    amount: 95000,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN034',
    date: '2026-01-01',
    merchant: 'TechCrunch Sponsorship',
    category: 'Marketing',
    amount: 840000,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN035',
    date: '2026-01-01',
    merchant: 'Design Agency Fee',
    category: 'Marketing',
    amount: 350000,
    status: 'approved',
    cardholderName: 'Alex Rivera',
    department: 'Marketing',
  },

  // Additional SaaS subscriptions
  {
    id: 'TXN036',
    date: '2026-01-01',
    merchant: 'Zoom',
    category: 'SaaS',
    amount: 31900,
    status: 'approved',
    cardholderName: 'Marcus Johnson',
    department: 'Operations',
  },
  {
    id: 'TXN037',
    date: '2026-01-01',
    merchant: 'Asana',
    category: 'SaaS',
    amount: 22500,
    status: 'approved',
    cardholderName: 'Marcus Johnson',
    department: 'Product',
  },
  {
    id: 'TXN038',
    date: '2026-01-01',
    merchant: 'Monday.com',
    category: 'SaaS',
    amount: 18900,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },
  {
    id: 'TXN039',
    date: '2026-01-01',
    merchant: 'Loom',
    category: 'SaaS',
    amount: 12500,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN040',
    date: '2026-01-01',
    merchant: 'Auth0',
    category: 'SaaS',
    amount: 45000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },

  // Travel expenses (continued)
  {
    id: 'TXN041',
    date: '2026-01-01',
    merchant: 'Lyft',
    category: 'Travel',
    amount: 28900,
    status: 'approved',
    cardholderName: 'Michael Torres',
    department: 'Sales',
  },
  {
    id: 'TXN042',
    date: '2026-01-01',
    merchant: 'Expedia',
    category: 'Travel',
    amount: 195000,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Sales',
  },

  // Meals (continued)
  {
    id: 'TXN043',
    date: '2026-01-01',
    merchant: 'Grubhub',
    category: 'Meals',
    amount: 6200,
    status: 'approved',
    cardholderName: 'David Park',
    department: 'Engineering',
  },
  {
    id: 'TXN044',
    date: '2026-01-01',
    merchant: 'Postmates',
    category: 'Meals',
    amount: 4500,
    status: 'approved',
    cardholderName: 'Alex Rivera',
    department: 'Design',
  },
  {
    id: 'TXN045',
    date: '2026-01-01',
    merchant: 'Blue Bottle Coffee',
    category: 'Meals',
    amount: 850,
    status: 'approved',
    cardholderName: 'Marcus Johnson',
    department: 'Product',
  },

  // Other
  {
    id: 'TXN046',
    date: '2026-01-01',
    merchant: 'FedEx',
    category: 'Other',
    amount: 18500,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },
  {
    id: 'TXN047',
    date: '2026-01-01',
    merchant: 'UPS',
    category: 'Other',
    amount: 12300,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },
  {
    id: 'TXN048',
    date: '2026-01-01',
    merchant: 'Amazon Business',
    category: 'Office',
    amount: 8900,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Operations',
  },

  // Additional SaaS (continued)
  {
    id: 'TXN049',
    date: '2026-01-01',
    merchant: 'Calendly',
    category: 'SaaS',
    amount: 9900,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Sales',
  },
  {
    id: 'TXN050',
    date: '2026-01-01',
    merchant: 'Stripe',
    category: 'SaaS',
    amount: 0,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN051',
    date: '2026-01-01',
    merchant: 'Mailchimp',
    category: 'Marketing',
    amount: 35900,
    status: 'approved',
    cardholderName: 'Emily Wong',
    department: 'Marketing',
  },
  {
    id: 'TXN052',
    date: '2026-01-01',
    merchant: 'Twilio',
    category: 'SaaS',
    amount: 125000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN053',
    date: '2026-01-01',
    merchant: 'SendGrid',
    category: 'SaaS',
    amount: 95000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN054',
    date: '2026-01-01',
    merchant: 'PagerDuty',
    category: 'SaaS',
    amount: 42000,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN055',
    date: '2026-01-01',
    merchant: 'Sentry',
    category: 'SaaS',
    amount: 29900,
    status: 'approved',
    cardholderName: 'Sarah Chen',
    department: 'Engineering',
  },
  {
    id: 'TXN056',
    date: '2026-01-01',
    merchant: 'Atlassian Cloud',
    category: 'SaaS',
    amount: 35000,
    status: 'flagged',
    cardholderName: 'Marcus Johnson',
    department: 'Engineering',
  },
  {
    id: 'TXN057',
    date: '2026-01-01',
    merchant: 'Freshbooks',
    category: 'SaaS',
    amount: 28900,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Finance',
  },
  {
    id: 'TXN058',
    date: '2026-01-01',
    merchant: 'Xero',
    category: 'SaaS',
    amount: 39900,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Finance',
  },
  {
    id: 'TXN059',
    date: '2026-01-01',
    merchant: 'QuickBooks Online',
    category: 'SaaS',
    amount: 42900,
    status: 'pending',
    cardholderName: 'Jennifer Lee',
    department: 'Finance',
  },
  {
    id: 'TXN060',
    date: '2026-01-01',
    merchant: 'Bill.com',
    category: 'SaaS',
    amount: 55000,
    status: 'approved',
    cardholderName: 'Jennifer Lee',
    department: 'Finance',
  },
].map((txn): Transaction => {
  // Extract transaction number from ID (e.g., 'TXN001' -> 1)
  const txnNumber = parseInt(txn.id.replace('TXN', ''), 10);
  return {
    id: txn.id,
    date: getTransactionDate(txnNumber),
    merchant: txn.merchant,
    category: txn.category as Category,
    amount: txn.amount,
    status: txn.status as Status,
    cardholderName: txn.cardholderName,
    department: txn.department,
  };
});

/**
 * Computes a SpendSummary from the provided transactions
 */
export function getMockSummary(
  transactions: Transaction[] = mockTransactions,
  previousPeriodTransactions: Transaction[] = []
): SpendSummary {
  const totalSpend = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const transactionCount = transactions.length;

  // Find top category
  const categoryTotals: Record<Category, number> = {
    'Travel': 0,
    'SaaS': 0,
    'Meals': 0,
    'Office': 0,
    'Marketing': 0,
    'Other': 0,
  };

  transactions.forEach((txn) => {
    categoryTotals[txn.category] += txn.amount;
  });

  let topCategory: Category = 'SaaS';
  let maxAmount = 0;
  
  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = category as Category;
    }
  });

  // Calculate percent change comparing current period to previous period
  let percentChange = 0;
  let hasInsufficientPriorData = false;
  
  if (previousPeriodTransactions.length > 0) {
    const previousPeriodSpend = previousPeriodTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    // Guard: if previous period spend is 0 or less than 10% of current period, return 0
    if (previousPeriodSpend === 0 || previousPeriodSpend < (totalSpend * 0.1)) {
      percentChange = 0;
      hasInsufficientPriorData = true;
    } else {
      const rawChange = ((totalSpend - previousPeriodSpend) / previousPeriodSpend) * 100;
      
      // Cap at 999% maximum
      if (Math.abs(rawChange) > 999) {
        percentChange = rawChange > 0 ? 999 : -999;
        hasInsufficientPriorData = true;
      } else {
        percentChange = Math.round(rawChange);
      }
    }
  }

  return {
    totalSpend,
    transactionCount,
    topCategory,
    percentChange,
    hasInsufficientPriorData,
  };
}

/**
 * Returns a CategoryBreakdown array for the provided transactions
 */
export function getMockCategoryBreakdown(
  transactions: Transaction[] = mockTransactions
): CategoryBreakdown[] {
  const categoryTotals: Record<Category, { amount: number; count: number }> = {
    'Travel': { amount: 0, count: 0 },
    'SaaS': { amount: 0, count: 0 },
    'Meals': { amount: 0, count: 0 },
    'Office': { amount: 0, count: 0 },
    'Marketing': { amount: 0, count: 0 },
    'Other': { amount: 0, count: 0 },
  };

  transactions.forEach((txn) => {
    categoryTotals[txn.category].amount += txn.amount;
    categoryTotals[txn.category].count += 1;
  });

  const totalSpend = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  return Object.entries(categoryTotals).map(([category, { amount, count }]) => ({
    category: category as Category,
    amount,
    percentage: totalSpend > 0 ? Math.round((amount / totalSpend) * 1000) / 10 : 0,
    transactionCount: count,
  }));
}

/**
 * Returns mock departments with realistic budgets and spending
 */
export function getMockDepartments(): Department[] {
  return [
    {
      id: 'DEPT001',
      name: 'Engineering',
      budget: 5000000, // $50,000
      spent: 3245000, // $32,450
    },
    {
      id: 'DEPT002',
      name: 'Marketing',
      budget: 2000000, // $20,000
      spent: 1758900, // $17,589
    },
    {
      id: 'DEPT003',
      name: 'Sales',
      budget: 1500000, // $15,000
      spent: 1289000, // $12,890
    },
    {
      id: 'DEPT004',
      name: 'Operations',
      budget: 1200000, // $12,000
      spent: 945000, // $9,450
    },
    {
      id: 'DEPT005',
      name: 'Product',
      budget: 800000, // $8,000
      spent: 625000, // $6,250
    },
  ];
}

