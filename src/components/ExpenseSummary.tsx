import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
import { ExpenseSummary as Summary } from '../types';
import { categories } from '../data/categories';

interface ExpenseSummaryProps {
  summary: Summary;
}

export function ExpenseSummary({ summary }: ExpenseSummaryProps) {
  return (
    <div className="space-y-6">
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