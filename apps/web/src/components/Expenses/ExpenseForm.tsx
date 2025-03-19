import React, { useState, useEffect } from 'react';
import { Plus, Save, X, AlertCircle } from 'lucide-react';
import { Expense, Category } from '../../types';

interface ValidationErrors {
  amount?: string;
  category?: string;
  expenseDate?: string;
}

const MAX_AMOUNT = 10000000; // 1 crore INR

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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0]
  );

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
      setExpenseDate(new Date(initialExpense.expense_date).toISOString().split('T')[0]);
    }
  }, [initialExpense]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Amount validation
    const amountValue = parseFloat(amount);
    if (!amount.trim()) {
      errors.amount = 'Amount is required';
    } else if (isNaN(amountValue) || amountValue <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (amountValue > MAX_AMOUNT) {
      errors.amount = 'Amount cannot exceed ₹1 crore';
    }
    
    // Category validation
    if (!category) {
      errors.category = 'Please select a category';
    }
    
    // Date validation
    const selectedDate = new Date(expenseDate);
    const today = new Date();
    if (selectedDate > today) {
      errors.expenseDate = 'Date cannot be in the future';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description,
      expense_date: new Date(expenseDate).toISOString(),
    };

    try {
      if (initialExpense) {
        await onSubmit({ ...expenseData, id: initialExpense.id });
      } else {
        await onSubmit(expenseData);
      }
      
      setAmount('');
      setCategory('');
      setDescription('');
      setValidationErrors({});
      onSuccess?.();
    } catch (error) {
      setValidationErrors({
        amount: error instanceof Error ? error.message : 'Failed to save expense'
      });
    }
  };

  const handleInputChange = (field: 'amount' | 'category' | 'description' | 'expenseDate', value: string) => {
    switch (field) {
      case 'amount':
        setAmount(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'expenseDate':
        setExpenseDate(value);
        break;
    }
    setValidationErrors({});
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
            autoComplete="off"
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
              validationErrors.amount
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="0.00"
          />
          {validationErrors.amount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.amount}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <div className="mt-2">
          <input
            type="date"
            name="expenseDate"
            id="expenseDate"
            required
            value={expenseDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleInputChange('expenseDate', e.target.value)}
            className={`shadow-sm block w-full sm:text-sm rounded-md ${
              validationErrors.expenseDate
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {validationErrors.expenseDate && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.expenseDate}
            </p>
          )}
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
          onChange={(e) => handleInputChange('category', e.target.value)}
          className={`mt-2 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
            validationErrors.category
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }`}
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
        {validationErrors.category && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {validationErrors.category}
          </p>
        )}
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
            onChange={(e) => handleInputChange('description', e.target.value)}
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