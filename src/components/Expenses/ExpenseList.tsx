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
                <div className="flex items-center space-x-1 ml-2 shrink-0">
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
              <div className="flex items-center mt-0.5 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span className="truncate">
                  {getTimestamp(expense).isUpdated ? 'Updated' : 'Added'}: {getTimestamp(expense).text}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}