import React from 'react';
import { Search, X } from 'lucide-react';

interface ExpenseSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onReset: () => void;
}

export function ExpenseSearch({ query, onQueryChange, onReset }: ExpenseSearchProps) {
  return (
    <div className="bg-white px-4 py-2 flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search expenses by category, amount, date, or description..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {query && (
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center p-2"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
