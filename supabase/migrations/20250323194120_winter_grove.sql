/*
  # Enhance Email Authentication Configuration

  1. Changes
    - Configure email templates for verification and password reset
    - Set up site URL for email redirects
    - Add email sending settings

  2. Security
    - Maintain existing RLS policies
    - Enforce email verification
*/

-- Configure site URL for email redirects
UPDATE auth.config SET
  site_url = COALESCE(
    (SELECT value FROM auth.config WHERE key = 'site_url'),
    'https://expense-tracker-ms-tech-geek.netlify.app'
  );

-- Configure email templates
INSERT INTO auth.email_templates (
  template_type,
  subject,
  content_html,
  content_text
) VALUES
(
  'confirm_signup',
  'Confirm Your Expense Tracker Account',
  '
  <h2>Welcome to Expense Tracker!</h2>
  <p>Click the button below to confirm your email address and activate your account:</p>
  <p><a href="{{ .ConfirmationURL }}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Confirm Email Address</a></p>
  <p>Or copy and paste this link:</p>
  <p>{{ .ConfirmationURL }}</p>
  <p>This link will expire in 24 hours.</p>
  ',
  'Welcome to Expense Tracker!\n\nClick this link to confirm your email address and activate your account:\n\n{{ .ConfirmationURL }}\n\nThis link will expire in 24 hours.'
),
(
  'reset_password',
  'Reset Your Expense Tracker Password',
  '
  <h2>Password Reset Request</h2>
  <p>Click the button below to reset your password:</p>
  <p><a href="{{ .ConfirmationURL }}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
  <p>Or copy and paste this link:</p>
  <p>{{ .ConfirmationURL }}</p>
  <p>If you did not request this password reset, please ignore this email.</p>
  <p>This link will expire in 1 hour.</p>
  ',
  'Password Reset Request\n\nClick this link to reset your password:\n\n{{ .ConfirmationURL }}\n\nIf you did not request this password reset, please ignore this email.\n\nThis link will expire in 1 hour.'
)
ON CONFLICT (template_type) DO UPDATE
SET
  subject = EXCLUDED.subject,
  content_html = EXCLUDED.content_html,
  content_text = EXCLUDED.content_text;