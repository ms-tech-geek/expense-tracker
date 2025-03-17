export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  parent_id?: string;
  created_at: string;
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
  timeData: {
    labels: string[];
    data: number[];
  };
  categoryData: {
    labels: string[];
    data: number[];
    colors: string[];
  };
}

export type DateRange = 
  | 'last-week'
  | 'last-month'
  | 'last-quarter'

export interface DateRangeOption {
  label: string;
  value: DateRange;
}