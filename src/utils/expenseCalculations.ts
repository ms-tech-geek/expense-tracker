import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { Expense, Category, ExpenseSummary } from '../types';

export function calculateExpenseSummary(expenses: Expense[], categories: Category[]): ExpenseSummary {
  return {
    total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    byCategory: expenses.reduce((acc, exp) => {
      const cat = categories.find(c => c.id === exp.category);
      if (cat) {
        acc[cat.id] = (acc[cat.id] || 0) + exp.amount;
      }
      return acc;
    }, {} as Record<string, number>),
    weekly: getWeeklyData(expenses),
    monthly: getMonthlyData(expenses),
    categoryData: getCategoryData(expenses, categories),
  };
}

function getWeeklyData(expenses: Expense[]) {
  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());
  const days = eachDayOfInterval({ start, end });
  
  const labels = days.map(day => format(day, 'EEE'));
  const data = days.map(day => {
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.expense_date);
        return format(expDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  });

  return { labels, data };
}

function getMonthlyData(expenses: Expense[]) {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const weeks = eachWeekOfInterval({ start, end });
  
  const labels = weeks.map(week => `Week ${format(week, 'w')}`);
  const data = weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart);
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.expense_date);
        return expDate >= weekStart && expDate <= weekEnd;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  });

  return { labels, data };
}

function getCategoryData(expenses: Expense[], categories: Category[]) {
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    labels: sortedCategories.map(([id]) => 
      categories.find(c => c.id === id)?.name || id
    ),
    data: sortedCategories.map(([, amount]) => amount),
    colors: []
  };
}