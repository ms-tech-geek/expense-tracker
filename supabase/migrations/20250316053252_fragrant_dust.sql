/*
  # Add Delete Policy for Expenses

  1. Changes
    - Add policy to allow users to delete their own expenses
    - Add policy to allow users to update their own expenses

  2. Security
    - Users can only delete/update expenses they own
*/

CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);