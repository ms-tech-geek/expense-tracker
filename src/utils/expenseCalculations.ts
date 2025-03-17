import { 
  format, 
  subDays,
  subQuarters,
  subYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfDay,
  endOfDay,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear
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
  const today = endOfDay(new Date());
  let end = today;
  let start = startOfDay(subDays(today, 6)); // default to last week

  let config: DateRangeConfig = {
    start,
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
        end: today,
        formatInterval: (date) => format(date, 'MMM d'),
        getIntervals: (start, end) => {
          const days = eachDayOfInterval({ start, end });
          return days.map(day => startOfDay(day));
        }
      };
      break;
    case 'last-quarter':
      config = {
        start: startOfQuarter(subQuarters(today, 1)),
        end: endOfQuarter(today),
        formatInterval: (date) => format(date, 'MMM'),
        getIntervals: (start, end) => eachMonthOfInterval({ start, end })
      };
      break;
    case 'last-year':
      config = {
        start: startOfYear(subYears(today, 1)),
        end: endOfYear(today),
        formatInterval: (date) => format(date, 'MMM'),
        getIntervals: (start, end) => eachMonthOfInterval({ start, end })
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
    timeData: getTimeSeriesData(filteredExpenses, start, end, formatInterval, getIntervals, dateRange),
    categoryData: getCategoryData(filteredExpenses, categories),
  };
}

function getTimeSeriesData(
  expenses: Expense[],
  start: Date,
  end: Date,
  formatInterval: (date: Date) => string,
  getIntervals: (start: Date, end: Date) => Date[],
  dateRange: DateRange
) {
  const intervals = getIntervals(start, end);
  
  const labels = intervals.map(interval => formatInterval(interval));
  const data = intervals.map(interval => {
    let intervalStart: Date;
    let intervalEnd: Date;

    if (dateRange === 'last-quarter' || dateRange === 'last-year') {
      intervalStart = startOfMonth(interval);
      intervalEnd = endOfMonth(interval);
    } else {
      intervalStart = startOfDay(interval);
      intervalEnd = endOfDay(interval);
    }
    
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