import { ExpenseCategory } from '../types';

export const categories: ExpenseCategory[] = [
  { id: 'food', name: 'Food & Dining', icon: 'utensils', color: 'text-orange-500' },
  { id: 'transport', name: 'Transportation', icon: 'car', color: 'text-blue-500' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: 'text-pink-500' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'receipt', color: 'text-purple-500' },
  { id: 'entertainment', name: 'Entertainment', icon: 'tv', color: 'text-yellow-500' },
  { id: 'health', name: 'Healthcare', icon: 'heart', color: 'text-red-500' },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: 'text-gray-500' },
];