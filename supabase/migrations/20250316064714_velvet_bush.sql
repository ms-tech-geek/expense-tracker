/*
  # Add custom categories support

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for users to manage their own categories
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can create their own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default categories for all authenticated users
INSERT INTO categories (user_id, name, icon, color)
SELECT 
  id as user_id,
  c.name,
  c.icon,
  c.color
FROM auth.users
CROSS JOIN (
  VALUES 
    ('Restaurant Dining', 'Utensils', 'text-orange-500'),
    ('Groceries', 'ShoppingCart', 'text-green-500'),
    ('Transport', 'Car', 'text-blue-500'),
    ('Entertainment', 'Film', 'text-purple-500'),
    ('Utilities', 'Zap', 'text-amber-500')
) as c(name, icon, color)
ON CONFLICT DO NOTHING;