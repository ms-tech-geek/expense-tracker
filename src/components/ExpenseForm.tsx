import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Expense, Category } from '../types';

interface GroupedCategories {
  [key: string]: {
    parent: Category;
    children: Category[];
  };
}

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  initialExpense: Expense | null;
  onCancel: () => void;
  onSuccess?: () => void;
  categories: Category[];
}

export function ExpenseForm({ onSubmit, initialExpense, onCancel, onSuccess, categories }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const groupedCategories = categories.reduce((acc: GroupedCategories, cat) => {
    if (!cat.parent_id) {
      // This is a parent category
      if (!acc[cat.id]) {
        acc[cat.id] = {
          parent: cat,
          children: []
        };
      }
    } else {
      // This is a child category
      if (acc[cat.parent_id]) {
        acc[cat.parent_id].children.push(cat);
      }
    }
    return acc;
  }, {});

  useEffect(() => {
    if (initialExpense) {
      setAmount(initialExpense.amount.toString());
      setCategory(initialExpense.category);
      setDescription(initialExpense.description || '');
    }
  }, [initialExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description,
      date: initialExpense?.date || new Date().toISOString(),
    };

    if (initialExpense) {
      onSubmit({ ...expenseData, id: initialExpense.id });
    } else {
      onSubmit(expenseData);
    }

    setAmount('');
    setCategory('');
    setDescription('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialExpense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        {initialExpense && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-2 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a category</option>
          {Object.values(groupedCategories).map(({ parent, children }) => (
            <optgroup key={parent.id} label={parent.name}>
              {children.map((child) => (
                <option
                  key={child.id}
                  value={child.id}
                  disabled={!child.parent_id} // Disable parent categories
                >
                  {child.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Lunch with colleagues"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialExpense ? (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </>
        )}
      </button>
    </form>
  );
}