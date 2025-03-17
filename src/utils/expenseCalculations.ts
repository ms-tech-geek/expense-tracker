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
  { label: 'Last Year', value: 'last-year' }
];

interface DateRangeConfig {
  start: Date;
  end: Date;
  formatInterval: (date: Date) => string;
  getIntervals: (start: Date, end: Date) => Date[];
}

function getDateRangeConfig(range: DateRange, customStart?: Date | null, customEnd?: Date | null): DateRangeConfig {
  const end = endOfDay(new Date());
  const today = endOfDay(new Date());
  let config: DateRangeConfig = {
    start: startOfDay(subDays(today, 6)), // default to last week
    end,
    formatInterval: (date) => format(date, 'EEE'),
    getIntervals: (start, end) => {
      const days = eachDayOfInterval({ start, end });
      return days.map(day => startOfDay(day));
    }
  };

  switch (range) {
    case 'last-week':
      // Use defaults
      break;
    case 'last-month':
      config = {
        start: startOfDay(subDays(today, 29)),
        end,
        formatInterval: (date) => format(date, 'MMM d'),
        getIntervals: (start, end) => {
          const days = eachDayOfInterval({ start, end });
          return days.map(day => startOfDay(day));
        }
      };
      break;
    case 'last-quarter':
      config = {
        start: startOfDay(subQuarters(today, 1)),
        end,
        formatInterval: (date) => format(date, 'MMM'),
        getIntervals: (start, end) => eachMonthOfInterval({ start, end })
      };
      break;
    case 'last-year':
      config = {
        start: startOfDay(subYears(today, 1)),
        end,
        formatInterval: (date) => format(date, 'MMM'),
        getIntervals: (start, end) => eachMonthOfInterval({ start, end })
      };
      break;
    case 'custom':
      const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      config = {
        start: startOfDay(customStart || subDays(today, 6)),
        end: endOfDay(customEnd || today),
        formatInterval: (date) => format(date, 'MMM d'),
        getIntervals: (start, end) => {
          if (dayDiff <= 31) {
            return eachDayOfInterval({ start, end });
          } else if (dayDiff <= 90) {
            return eachWeekOfInterval({ start, end });
          } else {
            return eachMonthOfInterval({ start, end });
          }
        }
      };
      break;
  }

  return config;
}

export function calculateExpenseSummary(
  expenses: Expense[], 
  categories: Category[],
  dateRange: DateRange,
  customStart?: Date | null,
  customEnd?: Date | null
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
  const data = intervals.map((interval, index) => {
    const intervalStart = startOfDay(interval);
    const intervalEnd = index === intervals.length - 1 
      ? endOfDay(interval)
      : startOfDay(intervals[index + 1]);
    
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.expense_date);
        return isWithinInterval(expDate, { start: intervalStart, end: intervalEnd });
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