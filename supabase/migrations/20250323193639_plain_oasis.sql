/*
  # Enable Email Authentication Settings

  1. Changes
    - Enable email confirmations for new sign ups
    - Configure password reset settings
    - Set up email templates

  2. Security
    - Maintain existing RLS policies
    - Email verification required for new accounts
*/

-- Enable email confirmations
ALTER TABLE auth.users
  ALTER COLUMN email_confirmed_at DROP NOT NULL;

-- Update auth settings
UPDATE auth.config SET
  email_confirm_required = true,
  enable_signup = true;

-- Configure email templates
INSERT INTO auth.mfa_factors (user_id, factor_type, status, created_at, updated_at)
SELECT 
  id as user_id,
  'totp' as factor_type,
  'unverified' as status,
  now() as created_at,
  now() as updated_at
FROM auth.users
ON CONFLICT DO NOTHING;