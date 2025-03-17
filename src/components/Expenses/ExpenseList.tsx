import React from 'react';
import { Expense, Category } from '../../types';
import * as Icons from 'lucide-react';
import { Pencil, Trash2, Clock } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  categories: Category[];
}

export function ExpenseList({ expenses, onEdit, onDelete, categories }: ExpenseListProps) {
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
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between w-full sm:w-auto">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100/50 rounded-xl shadow-sm shrink-0">
                {getCategoryIcon(expense.category)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {categories.find((c) => c.id === expense.category)?.name}
                </p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <p className="text-sm text-gray-500">
                    {formatDate(expense.expense_date)}
                  </p>
                </div>
                {expense.description && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">{expense.description}</p>
                )}
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="truncate">
                    {getTimestamp(expense).isUpdated ? 'Updated' : 'Added'}: {getTimestamp(expense).text}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 mt-4 sm:mt-0">
            <div className="hidden sm:block text-right">
              <p className="text-lg font-semibold text-gray-900">
                ₹{expense.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  onEdit(expense);
                }}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Edit expense"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this expense?')) {
                    onDelete(expense.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Delete expense"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}