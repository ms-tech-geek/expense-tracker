import React from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../../types';

export interface SearchFilters {
  query: string;
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

interface ExpenseSearchProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  categories: Category[];
  onReset: () => void;
}

export function ExpenseSearch({ filters, onFilterChange, categories, onReset }: ExpenseSearchProps) {
  const handleChange = (field: keyof SearchFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Search Expenses</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by description..."
              value={filters.query}
              onChange={(e) => handleChange('query', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              !category.parent_id && (
                <optgroup key={category.id} label={category.name}>
                  {categories
                    .filter(c => c.parent_id === category.id)
                    .map(subCategory => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))
                  }
                </optgroup>
              )
            ))}
          </select>
        </div>

        <div>
          <input
            type="date"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>

        <div>
          <input
            type="date"
            placeholder="End Date"
            value={filters.endDate}
            min={filters.startDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={(e) => handleChange('minAmount', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Max Amount"
            value={filters.maxAmount}
            min={filters.minAmount}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      </div>
    </div>
  );
}