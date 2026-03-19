export type Category =
  | 'Travel'
  | 'SaaS'
  | 'Meals'
  | 'Office'
  | 'Marketing'
  | 'Other';

export type Status =
  | 'approved'
  | 'pending'
  | 'flagged';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: Category;
  amount: number;
  status: Status;
  cardholderName: string;
  department: string;
}

export interface SpendSummary {
  totalSpend: number;
  transactionCount: number;
  topCategory: Category;
  percentChange: number;
  /** Flag indicating if previous period data was insufficient (triggering the 0% return or 999% cap) */
  hasInsufficientPriorData?: boolean;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  spent: number;
}