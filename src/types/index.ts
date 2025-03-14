export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export type ExpenseCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
}