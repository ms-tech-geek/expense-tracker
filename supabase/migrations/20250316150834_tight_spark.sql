/*
  # Add expense dates tracking

  1. Changes
    - Add `updated_at` column to track last modification time
    - Add trigger to automatically update `updated_at` timestamp
    - Rename existing `date` column to `expense_date` for clarity

  2. Security
    - Maintain existing RLS policies
*/

-- Rename date column to expense_date for clarity
ALTER TABLE expenses RENAME COLUMN date TO expense_date;

-- Add updated_at column
ALTER TABLE expenses ADD COLUMN updated_at timestamptz DEFAULT now();

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();