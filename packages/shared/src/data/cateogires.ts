import { Category } from '../types';

// Default categories with hierarchy
export const DEFAULT_CATEGORIES: Category[] = [
  // Housing
  { id: 'housing', user_id: '', name: 'Housing', icon: 'Home', color: 'text-blue-600', created_at: '' },
  { id: 'rent', user_id: '', name: 'Rent', icon: 'Key', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'mortgage', user_id: '', name: 'Mortgage', icon: 'Building', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'property_tax', user_id: '', name: 'Property Taxes', icon: 'FileText', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'utilities', user_id: '', name: 'Utilities', icon: 'Zap', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'home_maintenance', user_id: '', name: 'Home Maintenance', icon: 'Tool', color: 'text-blue-500', created_at: '', parent_id: 'housing' },

  // Transportation
  { id: 'transport', user_id: '', name: 'Transportation', icon: 'Car', color: 'text-green-600', created_at: '' },
  { id: 'car_payment', user_id: '', name: 'Car Payments', icon: 'Car', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'fuel', user_id: '', name: 'Fuel', icon: 'Fuel', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'public_transport', user_id: '', name: 'Public Transport', icon: 'Train', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'car_maintenance', user_id: '', name: 'Repairs & Maintenance', icon: 'Wrench', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'parking', user_id: '', name: 'Parking Fees', icon: 'ParkingCircle', color: 'text-green-500', created_at: '', parent_id: 'transport' },

  // Food
  { id: 'food', user_id: '', name: 'Food', icon: 'Utensils', color: 'text-orange-500', created_at: '' },
  { id: 'groceries', user_id: '', name: 'Groceries', icon: 'ShoppingCart', color: 'text-orange-500', created_at: '', parent_id: 'food' },
  { id: 'dining', user_id: '', name: 'Dining Out', icon: 'Utensils', color: 'text-orange-500', created_at: '', parent_id: 'food' },
  { id: 'coffee', user_id: '', name: 'Coffee Shops/Snacks', icon: 'Coffee', color: 'text-orange-500', created_at: '', parent_id: 'food' },

  // Health & Wellness
  { id: 'health', user_id: '', name: 'Health & Wellness', icon: 'Heart', color: 'text-red-500', created_at: '' },
  { id: 'health_insurance', user_id: '', name: 'Health Insurance', icon: 'Shield', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'doctor', user_id: '', name: 'Doctor Visits', icon: 'Stethoscope', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'medications', user_id: '', name: 'Medications', icon: 'Pill', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'gym', user_id: '', name: 'Gym Memberships', icon: 'Dumbbell', color: 'text-red-500', created_at: '', parent_id: 'health' },

  // Personal Care
  { id: 'personal', user_id: '', name: 'Personal Care', icon: 'Scissors', color: 'text-pink-500', created_at: '' },
  { id: 'grooming', user_id: '', name: 'Haircuts/Grooming', icon: 'Scissors', color: 'text-pink-500', created_at: '', parent_id: 'personal' },
  { id: 'cosmetics', user_id: '', name: 'Skincare/Cosmetics', icon: 'Sparkles', color: 'text-pink-500', created_at: '', parent_id: 'personal' },

  // Entertainment
  { id: 'entertainment', user_id: '', name: 'Entertainment', icon: 'Film', color: 'text-purple-500', created_at: '' },
  { id: 'streaming', user_id: '', name: 'Streaming Services', icon: 'Play', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },
  { id: 'events', user_id: '', name: 'Movies/Concerts', icon: 'Film', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },
  { id: 'sports', user_id: '', name: 'Sports Events', icon: 'Trophy', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },

  // Travel
  { id: 'travel', user_id: '', name: 'Travel', icon: 'Plane', color: 'text-cyan-500', created_at: '' },
  { id: 'flights', user_id: '', name: 'Flights', icon: 'Plane', color: 'text-cyan-500', created_at: '', parent_id: 'travel' },
  { id: 'hotels', user_id: '', name: 'Accommodation', icon: 'Hotel', color: 'text-cyan-500', created_at: '', parent_id: 'travel' },
  { id: 'travel_food', user_id: '', name: 'Travel Meals', icon: 'UtensilsCrossed', color: 'text-cyan-500', created_at: '', parent_id: 'travel' },

  // Subscriptions
  { id: 'subscriptions', user_id: '', name: 'Subscriptions', icon: 'Repeat', color: 'text-indigo-500', created_at: '' },
  { id: 'software', user_id: '', name: 'Software Tools', icon: 'Laptop', color: 'text-indigo-500', created_at: '', parent_id: 'subscriptions' },
  { id: 'professional', user_id: '', name: 'Professional Fees', icon: 'FileText', color: 'text-indigo-500', created_at: '', parent_id: 'subscriptions' },

  // Education
  { id: 'education', user_id: '', name: 'Childcare & Education', icon: 'GraduationCap', color: 'text-yellow-500', created_at: '' },
  { id: 'school_fees', user_id: '', name: 'School Fees', icon: 'GraduationCap', color: 'text-yellow-500', created_at: '', parent_id: 'education' },
  { id: 'school_supplies', user_id: '', name: 'School Supplies', icon: 'Book', color: 'text-yellow-500', created_at: '', parent_id: 'education' },
  { id: 'babysitting', user_id: '', name: 'Babysitting', icon: 'Users', color: 'text-yellow-500', created_at: '', parent_id: 'education' },

  // Pets
  { id: 'pets', user_id: '', name: 'Pets', icon: 'PawPrint', color: 'text-amber-500', created_at: '' },
  { id: 'pet_supplies', user_id: '', name: 'Pet Food & Supplies', icon: 'ShoppingBag', color: 'text-amber-500', created_at: '', parent_id: 'pets' },
  { id: 'vet', user_id: '', name: 'Vet Visits', icon: 'Stethoscope', color: 'text-amber-500', created_at: '', parent_id: 'pets' },

  // Savings & Investments
  { id: 'savings', user_id: '', name: 'Savings & Investments', icon: 'TrendingUp', color: 'text-emerald-500', created_at: '' },
  { id: 'emergency', user_id: '', name: 'Emergency Fund', icon: 'Shield', color: 'text-emerald-500', created_at: '', parent_id: 'savings' },
  { id: 'investments', user_id: '', name: 'Investments', icon: 'TrendingUp', color: 'text-emerald-500', created_at: '', parent_id: 'savings' },

  // Debt Repayment
  { id: 'debt', user_id: '', name: 'Debt Repayment', icon: 'CreditCard', color: 'text-rose-500', created_at: '' },
  { id: 'credit_card', user_id: '', name: 'Credit Card Payments', icon: 'CreditCard', color: 'text-rose-500', created_at: '', parent_id: 'debt' },
  { id: 'loans', user_id: '', name: 'Loan Payments', icon: 'Landmark', color: 'text-rose-500', created_at: '', parent_id: 'debt' },

  // Gifts & Donations
  { id: 'gifts', user_id: '', name: 'Gifts & Donations', icon: 'Gift', color: 'text-red-400', created_at: '' },
  { id: 'gift_giving', user_id: '', name: 'Gifts', icon: 'Gift', color: 'text-red-400', created_at: '', parent_id: 'gifts' },
  { id: 'charity', user_id: '', name: 'Charity', icon: 'Heart', color: 'text-red-400', created_at: '', parent_id: 'gifts' },

  // Work Expenses
  { id: 'work', user_id: '', name: 'Work Expenses', icon: 'Briefcase', color: 'text-gray-600', created_at: '' },
  { id: 'office_supplies', user_id: '', name: 'Office Supplies', icon: 'PenTool', color: 'text-gray-600', created_at: '', parent_id: 'work' },
  { id: 'equipment', user_id: '', name: 'Work Equipment', icon: 'Monitor', color: 'text-gray-600', created_at: '', parent_id: 'work' },

  // Clothing
  { id: 'clothing', user_id: '', name: 'Clothing', icon: 'Shirt', color: 'text-violet-500', created_at: '' },
  { id: 'work_clothes', user_id: '', name: 'Work Clothes', icon: 'Shirt', color: 'text-violet-500', created_at: '', parent_id: 'clothing' },
  { id: 'dry_cleaning', user_id: '', name: 'Dry Cleaning', icon: 'Shirt', color: 'text-violet-500', created_at: '', parent_id: 'clothing' }
];