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
          className="bg-white p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-gray-100/50 rounded-xl shadow-sm">
              {getCategoryIcon(expense.category)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900">
                  {categories.find((c) => c.id === expense.category)?.name}
                </p>
                <span className="text-sm text-gray-500">•</span>
                <p className="text-sm text-gray-500">
                  {formatDate(expense.expense_date)}
                </p>
              </div>
              {expense.description && (
                <p className="text-sm text-gray-500">{expense.description}</p>
              )}
              {/* Timestamp info */}
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {getTimestamp(expense).isUpdated ? 'Updated' : 'Added'}: {getTimestamp(expense).text}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right min-w-[100px]">
              <p className="text-lg font-semibold text-gray-900">
                ₹{expense.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  onEdit(expense);
                }}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
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
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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