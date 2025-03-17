import React from 'react';
import { Expense, Category } from '../../types';
import * as Icons from 'lucide-react';
import { Pencil, Trash2, Info, ArrowUpDown } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  categories: Category[];
}

export function ExpenseList({ expenses, onEdit, onDelete, categories }: ExpenseListProps) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: 'expense_date' | 'amount';
    direction: 'asc' | 'desc';
  }>({
    key: 'expense_date',
    direction: 'desc'
  });

  const sortedExpenses = React.useMemo(() => {
    const sorted = [...expenses];
    sorted.sort((a, b) => {
      if (sortConfig.key === 'expense_date') {
        const dateA = new Date(a.expense_date).getTime();
        const dateB = new Date(b.expense_date).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
    return sorted;
  }, [expenses, sortConfig]);

  const handleSort = (key: 'expense_date' | 'amount') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: '2-digit',
    });
  };

  const getTimestamp = (expense: Expense) => {
    const wasUpdated = expense.updated_at !== expense.created_at;
    const date = new Date(wasUpdated ? expense.updated_at : expense.created_at);
    
    return {
      text: date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      }),
      isUpdated: wasUpdated
    };
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const IconComponent = Icons[category?.icon as keyof typeof Icons];
    return IconComponent ? <IconComponent className={`w-5 h-5 ${category?.color}`} /> : null;
  };

  return (
    <div className="divide-y divide-gray-100">
      <div className="bg-white px-4 py-3 flex justify-end space-x-2">
        <button
          onClick={() => handleSort('expense_date')}
          className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
            sortConfig.key === 'expense_date'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowUpDown className="w-4 h-4 mr-1" />
          Date {sortConfig.key === 'expense_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('amount')}
          className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
            sortConfig.key === 'amount'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowUpDown className="w-4 h-4 mr-1" />
          Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
      </div>
      {sortedExpenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white px-4 py-3 group hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-1.5 bg-gray-100/50 rounded-lg shadow-sm shrink-0">
              {getCategoryIcon(expense.category)}
            </div>
            <div className="min-w-0 flex-1 ml-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 truncate">
                  {categories.find((c) => c.id === expense.category)?.name}
                </p>
                <p className="text-base font-semibold text-gray-900 ml-3 shrink-0">
                  ₹{expense.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center space-x-2 min-w-0">
                  <p className="text-sm text-gray-500 truncate">
                    {formatDate(expense.expense_date)}
                    {expense.description && ` • ${expense.description}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-2 shrink-0">
                  <div className="relative group">
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-indigo-600 rounded-md transition-colors"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 p-2 bg-gray-800 text-xs text-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <p className="mb-1">
                        {getTimestamp(expense).isUpdated ? 'Last updated' : 'Added'}: {getTimestamp(expense).text}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1 text-gray-400 hover:text-indigo-600 rounded-md transition-colors"
                    title="Edit expense"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        onDelete(expense.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}