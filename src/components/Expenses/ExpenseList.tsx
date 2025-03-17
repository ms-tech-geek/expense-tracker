import React from 'react';
import { Expense, Category } from '../../types';
import * as Icons from 'lucide-react';
import { Pencil, Trash2, Info, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { ExpenseSearch, SearchFilters } from './ExpenseSearch';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  categories: Category[];
}

export function ExpenseList({ expenses, onEdit, onDelete, categories }: ExpenseListProps) {
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>({
    query: '',
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const [sortConfig, setSortConfig] = React.useState<{
    key: 'expense_date' | 'amount';
    direction: 'asc' | 'desc';
  }>({
    key: 'expense_date',
    direction: 'desc'
  });

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      const matchesQuery = !searchFilters.query || 
        expense.description?.toLowerCase().includes(searchFilters.query.toLowerCase());
      
      const matchesCategory = !searchFilters.category || 
        expense.category === searchFilters.category;
      
      const matchesDateRange = (!searchFilters.startDate || 
        new Date(expense.expense_date) >= new Date(searchFilters.startDate)) &&
        (!searchFilters.endDate || 
        new Date(expense.expense_date) <= new Date(searchFilters.endDate));
      
      const matchesAmountRange = (!searchFilters.minAmount || 
        expense.amount >= parseFloat(searchFilters.minAmount)) &&
        (!searchFilters.maxAmount || 
        expense.amount <= parseFloat(searchFilters.maxAmount));
      
      return matchesQuery && matchesCategory && matchesDateRange && matchesAmountRange;
    });
  }, [expenses, searchFilters]);

  const sortedExpenses = React.useMemo(() => {
    const sorted = [...filteredExpenses];
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
  }, [filteredExpenses, sortConfig]);

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
      <ExpenseSearch
        filters={searchFilters}
        onFilterChange={setSearchFilters}
        categories={categories}
        onReset={() => setSearchFilters({
          query: '',
          category: '',
          startDate: '',
          endDate: '',
          minAmount: '',
          maxAmount: ''
        })}
      />

      <div className="bg-white px-4 py-2 flex items-center justify-between border-b">
        <h2 className="text-sm font-medium text-gray-700">Expenses</h2>
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => handleSort('expense_date')}
            className={`group flex items-center gap-1 ${
              sortConfig.key === 'expense_date' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <span className="group-hover:text-indigo-600 transition-colors">Date</span>
            {sortConfig.key === 'expense_date' ? (
              sortConfig.direction === 'asc' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : null}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleSort('amount')}
            className={`group flex items-center gap-1 ${
              sortConfig.key === 'amount' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <span className="group-hover:text-indigo-600 transition-colors">Amount</span>
            {sortConfig.key === 'amount' ? (
              sortConfig.direction === 'asc' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : null}
          </button>
        </div>
      </div>
      {sortedExpenses.length > 0 ? (
        sortedExpenses.map((expense) => (
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
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {expenses.length === 0 
              ? "No expenses yet. Add your first expense!"
              : "No expenses match your search criteria."}
          </p>
        </div>
      )}
    </div>
  );
}