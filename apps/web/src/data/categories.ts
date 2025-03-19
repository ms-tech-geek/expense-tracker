import { Category } from '../types';

// Default categories with hierarchy
export const DEFAULT_CATEGORIES: Category[] = [
  // Housing
  { id: 'housing', user_id: '', name: 'Housing', icon: 'Home', color: 'text-blue-600', created_at: '' },
  { id: 'rent', user_id: '', name: 'Rent', icon: 'Key', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'mortgage', user_id: '', name: 'Mortgage', icon: 'Building', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'utilities', user_id: '', name: 'Utilities', icon: 'Zap', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'home_maintenance', user_id: '', name: 'Home Maintenance', icon: 'Tool', color: 'text-blue-500', created_at: '', parent_id: 'housing' },

  // Transportation
  { id: 'transport', user_id: '', name: 'Transportation', icon: 'Car', color: 'text-green-600', created_at: '' },
  { id: 'fuel', user_id: '', name: 'Fuel', icon: 'Fuel', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'public_transport', user_id: '', name: 'Public Transport', icon: 'Train', color: 'text-green-500', created_at: '', parent_id: 'transport' },

  // Food
  { id: 'food', user_id: '', name: 'Food', icon: 'Utensils', color: 'text-orange-500', created_at: '' },
  { id: 'groceries', user_id: '', name: 'Groceries', icon: 'ShoppingCart', color: 'text-orange-500', created_at: '', parent_id: 'food' },
  { id: 'dining', user_id: '', name: 'Dining Out', icon: 'Utensils', color: 'text-orange-500', created_at: '', parent_id: 'food' },

  // Health
  { id: 'health', user_id: '', name: 'Health & Wellness', icon: 'Heart', color: 'text-red-500', created_at: '' },
  { id: 'doctor', user_id: '', name: 'Doctor Visits', icon: 'Stethoscope', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'medications', user_id: '', name: 'Medications', icon: 'Pill', color: 'text-red-500', created_at: '', parent_id: 'health' },

  // Entertainment
  { id: 'entertainment', user_id: '', name: 'Entertainment', icon: 'Film', color: 'text-purple-500', created_at: '' },
  { id: 'streaming', user_id: '', name: 'Streaming Services', icon: 'Play', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },
  { id: 'events', user_id: '', name: 'Movies/Concerts', icon: 'Film', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' }
];