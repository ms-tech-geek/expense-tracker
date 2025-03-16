export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
  weekly: {
    labels: string[];
    data: number[];
  };
  monthly: {
    labels: string[];
    data: number[];
  };
  categoryData: {
    labels: string[];
    data: number[];
    colors: string[];
  };
}