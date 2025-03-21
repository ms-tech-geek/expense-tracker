/*
  # Add Data Deletion Requests

  1. New Tables
    - `data_deletion_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `request_type` (text) - Type of data to delete
      - `status` (text) - Status of the request
      - `created_at` (timestamptz)
      - `processed_at` (timestamptz)

  2. Security
    - Enable RLS on data_deletion_requests table
    - Add policies for users to manage their own requests
*/

CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('all_expenses', 'date_range', 'category')),
  date_from timestamptz,
  date_to timestamptz,
  category_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT valid_date_range CHECK (
    (request_type != 'date_range') OR 
    (date_from IS NOT NULL AND date_to IS NOT NULL AND date_from <= date_to)
  ),
  CONSTRAINT valid_category CHECK (
    (request_type != 'category') OR 
    (category_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can create their own deletion requests"
  ON data_deletion_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own deletion requests"
  ON data_deletion_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);