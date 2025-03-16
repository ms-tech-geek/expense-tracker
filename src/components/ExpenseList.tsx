import React from 'react';
import { Expense, Category } from '../types';
import * as Icons from 'lucide-react';
import { Pencil, Trash2, Settings } from 'lucide-react';

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
      day: 'numeric',
    });
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
          className="bg-white p-4 flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-50 rounded-full">
              {getCategoryIcon(expense.category)}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {categories.find((c) => c.id === expense.category)?.name}
              </p>
              {expense.description && (
                <p className="text-sm text-gray-500">{expense.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ₹{expense.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onEdit(expense);
                }}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
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
                className="text-gray-400 hover:text-red-600 transition-colors"
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