import { 
  format, 
  subDays,
  subQuarters,
  subYears,
  subMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  startOfDay,
  endOfDay,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfWeek,
  endOfWeek
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
  let config: DateRangeConfig;

  switch (range) {
    case 'last-week':
      config = {
        start: startOfDay(subDays(today, 6)),
        end: today,
        formatInterval: (date) => format(date, 'EEE, MMM d'),
        getIntervals: (start, end) => eachDayOfInterval({ start, end })
      };
      break;
    case 'last-month':
      config = {
        start: startOfDay(subDays(today, 27)), // 4 weeks
        end: today,
        formatInterval: (date) => format(date, 'MMM d'),
        getIntervals: (start, end) => eachWeekOfInterval({ start, end })
      };
      break;
    case 'last-quarter':
      config = {
        start: startOfMonth(subMonths(today, 2)),
        end: today,
        formatInterval: (date) => {
          return format(date, 'MMM yyyy');
        },
        getIntervals: (start, end) => eachMonthOfInterval({ start, end })
      };
      break;
    case 'last-year':
      config = {
        start: startOfQuarter(subQuarters(today, 3)),
        end: today,
        formatInterval: (date) => {
          return `Q${format(date, 'Q yyyy')}`;
        },
        getIntervals: (start, end) => eachQuarterOfInterval({ start, end })
      };
      break;
    default:
      throw new Error(`Invalid date range: ${range}`);
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
    
    if (dateRange === 'last-month') {
      intervalStart = startOfWeek(interval);
      intervalEnd = endOfWeek(interval);
    } else if (dateRange === 'last-quarter') {
      intervalStart = startOfMonth(interval);
      intervalEnd = endOfMonth(interval);
    } else if (dateRange === 'last-year') {
      intervalStart = startOfQuarter(interval);
      intervalEnd = endOfQuarter(interval);
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