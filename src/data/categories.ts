import { ExpenseCategory } from '../types';

export const categories: ExpenseCategory[] = [
  // Food & Dining
  { id: 'restaurant', name: 'Restaurant Dining', icon: 'utensils', color: 'text-orange-500' },
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: 'text-green-500' },
  { id: 'takeout', name: 'Food Delivery', icon: 'package', color: 'text-amber-500' },
  
  // Transportation
  { id: 'fuel', name: 'Fuel', icon: 'fuel', color: 'text-red-500' },
  { id: 'public_transport', name: 'Public Transport', icon: 'train', color: 'text-blue-500' },
  { id: 'taxi', name: 'Taxi & Ride Share', icon: 'car', color: 'text-yellow-500' },
  
  // Housing & Utilities
  { id: 'rent', name: 'Rent/EMI', icon: 'home', color: 'text-purple-500' },
  { id: 'utilities', name: 'Utilities', icon: 'zap', color: 'text-amber-500' },
  { id: 'maintenance', name: 'Home Maintenance', icon: 'tool', color: 'text-gray-500' },
  
  // Shopping
  { id: 'clothing', name: 'Clothing', icon: 'shirt', color: 'text-pink-500' },
  { id: 'electronics', name: 'Electronics', icon: 'smartphone', color: 'text-indigo-500' },
  { id: 'household', name: 'Household Items', icon: 'shopping-bag', color: 'text-teal-500' },
  
  // Health & Wellness
  { id: 'medical', name: 'Medical/Healthcare', icon: 'stethoscope', color: 'text-red-500' },
  { id: 'pharmacy', name: 'Pharmacy', icon: 'pill', color: 'text-emerald-500' },
  { id: 'fitness', name: 'Fitness & Sports', icon: 'dumbbell', color: 'text-cyan-500' },
  
  // Entertainment & Leisure
  { id: 'movies', name: 'Movies & Shows', icon: 'film', color: 'text-rose-500' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'tv', color: 'text-violet-500' },
  { id: 'hobbies', name: 'Hobbies', icon: 'palette', color: 'text-fuchsia-500' },
  
  // Education
  { id: 'education', name: 'Education', icon: 'graduation-cap', color: 'text-blue-600' },
  { id: 'books', name: 'Books & Supplies', icon: 'book-open', color: 'text-yellow-600' },
  
  // Personal Care
  { id: 'salon', name: 'Salon & Grooming', icon: 'scissors', color: 'text-pink-600' },
  { id: 'personal_care', name: 'Personal Care', icon: 'sparkles', color: 'text-purple-600' },
  
  // Miscellaneous
  { id: 'gifts', name: 'Gifts & Donations', icon: 'gift', color: 'text-red-400' },
  { id: 'pets', name: 'Pet Expenses', icon: 'paw-print', color: 'text-amber-600' },
  { id: 'other', name: 'Other', icon: 'more-horizontal', color: 'text-gray-500' },
];