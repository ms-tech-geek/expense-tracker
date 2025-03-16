import React from 'react';
import { categories } from '../data/categories';
import { Expense } from '../types';
import * as Icons from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
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
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
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
          <div className="text-right">
            <p className="font-medium text-gray-900">
              ₹{expense.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}