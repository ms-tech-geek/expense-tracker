import { 
  format, 
  subDays,
  subMonths,
  subQuarters,
  subYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfDay,
  endOfDay,
  isWithinInterval
} from 'date-fns';
import { Expense, Category, ExpenseSummary, DateRange } from '../types';

export const DATE_RANGE_OPTIONS = [
  { label: 'Last Week', value: 'last-week' },
  { label: 'Last Month', value: 'last-month' },
  { label: 'Last Quarter', value: 'last-quarter' },
  { label: 'Last Year', value: 'last-year' },
  { label: 'Custom Range', value: 'custom' }
];

interface DateRangeConfig {
  start: Date;
  end: Date;
  formatInterval: (date: Date) => string;
  getIntervals: (start: Date, end: Date) => Date[];
}

function getDateRangeConfig(range: DateRange, customStart?: Date, customEnd?: Date): DateRangeConfig {
  const end = endOfDay(new Date());
  let start: Date;
  let formatInterval: (date: Date) => string;
  let getIntervals: (start: Date, end: Date) => Date[];

  const today = endOfDay(new Date());

  switch (range) {
    case 'last-week':
      start = startOfDay(subDays(end, 6));
      formatInterval = (date) => format(date, 'EEE');
      getIntervals = eachDayOfInterval;
      break;
    case 'last-month':
      start = startOfDay(subDays(end, 29));
      formatInterval = (date) => format(date, 'MMM d');
      getIntervals = (start, end) => eachWeekOfInterval({ start, end });
      break;
    case 'last-quarter':
      start = startOfDay(subQuarters(end, 1));
      formatInterval = (date) => format(date, 'MMM');
      getIntervals = (start, end) => eachMonthOfInterval({ start, end });
      break;
    case 'last-year':
      start = startOfDay(subYears(end, 1));
      formatInterval = (date) => format(date, 'MMM');
      getIntervals = (start, end) => eachMonthOfInterval({ start, end });
      break;
    case 'custom':
      // Default to last 7 days if no custom dates are provided
      start = startOfDay(customStart || subDays(today, 6));
      end = endOfDay(customEnd || today);
      formatInterval = (date) => format(date, 'MMM d');
      getIntervals = (start, end) => {
        const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return dayDiff <= 31 
          ? eachDayOfInterval({ start, end })
          : eachWeekOfInterval({ start, end });
      };
      break;
  }

  return { start, end, formatInterval, getIntervals };
}

export function calculateExpenseSummary(
  expenses: Expense[], 
  categories: Category[],
  dateRange: DateRange,
  customStart?: Date,
  customEnd?: Date
): ExpenseSummary {
  const { start, end, formatInterval, getIntervals } = getDateRangeConfig(dateRange, customStart, customEnd);
  
  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.expense_date);
    return isWithinInterval(expDate, { start, end });
  });

  return {
    total: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    byCategory: filteredExpenses.reduce((acc, exp) => {
      const cat = categories.find(c => c.id === exp.category);
      if (cat) {
        acc[cat.id] = (acc[cat.id] || 0) + exp.amount;
      }
      return acc;
    }, {} as Record<string, number>),
    timeData: getTimeSeriesData(filteredExpenses, start, end, formatInterval, getIntervals),
    categoryData: getCategoryData(filteredExpenses, categories),
  };
}

function getTimeSeriesData(
  expenses: Expense[],
  start: Date,
  end: Date,
  formatInterval: (date: Date) => string,
  getIntervals: (start: Date, end: Date) => Date[]
) {
  const intervals = getIntervals(start, end);
  
  const labels = intervals.map(interval => formatInterval(interval));
  const data = intervals.map(intervalStart => {
    const intervalEnd = new Date(intervalStart);
    intervalEnd.setHours(23, 59, 59, 999);

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.expense_date);
        return expDate >= intervalStart && expDate <= intervalEnd;
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