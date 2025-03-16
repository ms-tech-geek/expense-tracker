/*
  # Add category hierarchy and update default categories

  1. Changes
    - Add parent_id column to categories table for hierarchy
    - Update RLS policies to maintain hierarchy access
    - Add new comprehensive set of categories with parent-child relationships

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only access their own categories
*/

-- Add parent_id column
ALTER TABLE categories
ADD COLUMN parent_id uuid REFERENCES categories(id);

-- Update RLS policies to handle parent-child relationships
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
CREATE POLICY "Users can view their own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Clear existing categories to prepare for new hierarchy
DELETE FROM categories;

-- Function to insert categories with parent references
CREATE OR REPLACE FUNCTION insert_categories_for_user(user_uuid uuid)
RETURNS void AS $$
DECLARE
  housing_id uuid;
  transport_id uuid;
  food_id uuid;
  health_id uuid;
  personal_care_id uuid;
  entertainment_id uuid;
  travel_id uuid;
  subscriptions_id uuid;
  education_id uuid;
  pets_id uuid;
  savings_id uuid;
  debt_id uuid;
  gifts_id uuid;
  work_id uuid;
  clothing_id uuid;
BEGIN
  -- Main Categories
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Housing', 'Home', 'text-blue-600') RETURNING id INTO housing_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Transportation', 'Car', 'text-green-600') RETURNING id INTO transport_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Food', 'Utensils', 'text-orange-500') RETURNING id INTO food_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Health & Wellness', 'Heart', 'text-red-500') RETURNING id INTO health_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Personal Care', 'Scissors', 'text-pink-500') RETURNING id INTO personal_care_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Entertainment', 'Film', 'text-purple-500') RETURNING id INTO entertainment_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Travel', 'Plane', 'text-cyan-500') RETURNING id INTO travel_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Subscriptions', 'Repeat', 'text-indigo-500') RETURNING id INTO subscriptions_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Childcare & Education', 'GraduationCap', 'text-yellow-500') RETURNING id INTO education_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Pets', 'PawPrint', 'text-amber-500') RETURNING id INTO pets_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Savings & Investments', 'TrendingUp', 'text-emerald-500') RETURNING id INTO savings_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Debt Repayment', 'CreditCard', 'text-rose-500') RETURNING id INTO debt_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Gifts & Donations', 'Gift', 'text-red-400') RETURNING id INTO gifts_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Work Expenses', 'Briefcase', 'text-gray-600') RETURNING id INTO work_id;
  INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (gen_random_uuid(), user_uuid, 'Clothing', 'Shirt', 'text-violet-500') RETURNING id INTO clothing_id;

  -- Subcategories
  -- Housing
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Rent', 'Key', 'text-blue-500', housing_id),
    (user_uuid, 'Mortgage', 'Building', 'text-blue-500', housing_id),
    (user_uuid, 'Property Taxes', 'FileText', 'text-blue-500', housing_id),
    (user_uuid, 'Utilities', 'Zap', 'text-blue-500', housing_id),
    (user_uuid, 'Home Maintenance', 'Tool', 'text-blue-500', housing_id);

  -- Transportation
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Car Payments', 'Car', 'text-green-500', transport_id),
    (user_uuid, 'Fuel', 'Fuel', 'text-green-500', transport_id),
    (user_uuid, 'Public Transport', 'Train', 'text-green-500', transport_id),
    (user_uuid, 'Repairs & Maintenance', 'Wrench', 'text-green-500', transport_id),
    (user_uuid, 'Parking Fees', 'ParkingCircle', 'text-green-500', transport_id);

  -- Food
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Groceries', 'ShoppingCart', 'text-orange-500', food_id),
    (user_uuid, 'Dining Out', 'Utensils', 'text-orange-500', food_id),
    (user_uuid, 'Coffee Shops/Snacks', 'Coffee', 'text-orange-500', food_id);

  -- Health & Wellness
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Health Insurance', 'Shield', 'text-red-500', health_id),
    (user_uuid, 'Doctor Visits', 'Stethoscope', 'text-red-500', health_id),
    (user_uuid, 'Medications', 'Pill', 'text-red-500', health_id),
    (user_uuid, 'Gym Memberships', 'Dumbbell', 'text-red-500', health_id);

  -- Personal Care
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Haircuts/Grooming', 'Scissors', 'text-pink-500', personal_care_id),
    (user_uuid, 'Skincare/Cosmetics', 'Sparkles', 'text-pink-500', personal_care_id);

  -- Entertainment
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Streaming Services', 'Play', 'text-purple-500', entertainment_id),
    (user_uuid, 'Movies/Concerts', 'Film', 'text-purple-500', entertainment_id),
    (user_uuid, 'Sports Events', 'Trophy', 'text-purple-500', entertainment_id);

  -- Travel
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Flights', 'Plane', 'text-cyan-500', travel_id),
    (user_uuid, 'Accommodation', 'Hotel', 'text-cyan-500', travel_id),
    (user_uuid, 'Travel Meals', 'UtensilsCrossed', 'text-cyan-500', travel_id);

  -- Subscriptions
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Software Tools', 'Laptop', 'text-indigo-500', subscriptions_id),
    (user_uuid, 'Professional Fees', 'FileText', 'text-indigo-500', subscriptions_id);

  -- Education
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'School Fees', 'GraduationCap', 'text-yellow-500', education_id),
    (user_uuid, 'School Supplies', 'Book', 'text-yellow-500', education_id),
    (user_uuid, 'Babysitting', 'Users', 'text-yellow-500', education_id);

  -- Pets
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Pet Food & Supplies', 'ShoppingBag', 'text-amber-500', pets_id),
    (user_uuid, 'Vet Visits', 'Stethoscope', 'text-amber-500', pets_id);

  -- Savings & Investments
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Emergency Fund', 'Shield', 'text-emerald-500', savings_id),
    (user_uuid, 'Investments', 'TrendingUp', 'text-emerald-500', savings_id);

  -- Debt Repayment
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Credit Card Payments', 'CreditCard', 'text-rose-500', debt_id),
    (user_uuid, 'Loan Payments', 'Landmark', 'text-rose-500', debt_id);

  -- Gifts & Donations
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Gifts', 'Gift', 'text-red-400', gifts_id),
    (user_uuid, 'Charity', 'Heart', 'text-red-400', gifts_id);

  -- Work Expenses
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Office Supplies', 'PenTool', 'text-gray-600', work_id),
    (user_uuid, 'Work Equipment', 'Monitor', 'text-gray-600', work_id);

  -- Clothing
  INSERT INTO categories (user_id, name, icon, color, parent_id) VALUES
    (user_uuid, 'Work Clothes', 'Shirt', 'text-violet-500', clothing_id),
    (user_uuid, 'Dry Cleaning', 'Shirt', 'text-violet-500', clothing_id);
END;
$$ LANGUAGE plpgsql;

-- Insert categories for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM insert_categories_for_user(user_record.id);
  END LOOP;
END $$;