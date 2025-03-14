/*
  # Initial Database Setup for Expense Tracker

  1. Tables
    - expenses
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - amount (numeric)
      - category (text)
      - description (text)
      - date (timestamptz)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on expenses table
    - Add policies for authenticated users to:
      - Read their own expenses
      - Create new expenses
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  description text,
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);