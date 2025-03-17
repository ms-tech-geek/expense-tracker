import React from 'react';
import { BarChart, TrendingUp, Calendar, PieChart, ChevronDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ExpenseSummary as Summary, Category, DateRange, DateRangeOption } from '../../types';
import { DATE_RANGE_OPTIONS } from '../../utils/expenseCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ExpenseSummaryProps {
  summary: Summary;
  categories: Category[];
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  customDateRange: { start: Date | null; end: Date | null };
  onCustomDateRangeChange: (start: Date | null, end: Date | null) => void;
}

export function ExpenseSummary({ 
  summary, 
  categories, 
  dateRange, 
  onDateRangeChange,
  customDateRange,
  onCustomDateRangeChange
}: ExpenseSummaryProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const handleDateRangeSelect = (range: DateRange) => {
    onDateRangeChange(range);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">Total Expenses</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          ₹{summary.total.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-gray-900">Expense Trends</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <span>{DATE_RANGE_OPTIONS.find(opt => opt.value === dateRange)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDatePickerOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                {DATE_RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDateRangeSelect(option.value)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      dateRange === option.value
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {dateRange === 'custom' && (
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customDateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  onCustomDateRangeChange(date, customDateRange.end);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customDateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  onCustomDateRangeChange(customDateRange.start, date);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}
        <div className="h-48">
          <Bar
            data={{
              labels: summary.timeData.labels,
              datasets: [
                {
                  label: 'Expenses',
                  data: summary.timeData.data,
                  backgroundColor: 'rgba(99, 102, 241, 0.5)',
                  borderColor: 'rgb(99, 102, 241)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `₹${value}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">Top Categories</h3>
        </div>
        <div className="h-64">
          <Pie
            data={{
              labels: summary.categoryData.labels,
              datasets: [
                {
                  data: summary.categoryData.data,
                  backgroundColor: [
                    '#f97316', // orange-500
                    '#22c55e', // green-500
                    '#f59e0b', // amber-500
                    '#ef4444', // red-500
                    '#3b82f6', // blue-500
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 12,
                    color: '#4b5563', // text-gray-600
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">By Category</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(summary.byCategory).map(([categoryId, amount]) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return null;
            
            return (
              <div key={categoryId} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="font-medium">₹{amount.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}