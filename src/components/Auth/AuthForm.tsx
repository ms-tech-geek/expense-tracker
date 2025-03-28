import React, { useState } from 'react';
import { LogIn, UserPlus, Wallet, AlertCircle, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (!isLogin && password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!isLogin && !/(?=.*[a-z])(?=.*[0-9])/.test(password)) {
      errors.password = 'Password must contain both letters and numbers';
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(null);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    setError(null);
    setValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess(false);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        });
        if (error) throw error;
        setResetSuccess(true);
        setEmail('');
        setError('Check your email for password reset instructions');
        return;
      } else if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Please check your email to confirm your account before signing in');
          }
          throw error;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            data: {
              redirect_to: '/dashboard',
            },
          },
        });
        if (error) {
          if (error.message.includes('password')) {
            throw new Error('Password is too weak. Please use at least 6 characters');
          }
          throw error;
        }
        if (data.user) {
          setError('Success! Please check your email to confirm your account before signing in.');
          setEmail('');
          setPassword('');
          return;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode: 'login' | 'signup' | 'forgot') => {
    setIsLogin(mode === 'login');
    setIsForgotPassword(mode === 'forgot');
    setError(null);
    setResetSuccess(false);
    setValidationErrors({});
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Expense Tracker</h1>
          <p className="mt-2 text-sm text-gray-600">by Ms Tech Geek</p>
        </div>

        <div className="bg-white px-6 py-8 rounded-xl shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-900">
            {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                autoComplete="email"
                onChange={e => handleInputChange('email', e.target.value)}
                className={`mt-1 block w-full rounded-lg shadow-sm 
                  ${
                    validationErrors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                placeholder="you@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={6}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className={`mt-1 block w-full rounded-lg shadow-sm 
                  ${
                    validationErrors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="••••••"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.password}
                  </p>
                )}
                {isLogin && (
                  <div className="mt-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Must contain at least 6 characters with letters and numbers
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600 flex-1">{error}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center">
                <Mail className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-600 flex-1">
                  Password reset instructions have been sent to your email.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isForgotPassword
                    ? 'Sending Reset Link...'
                    : isLogin
                      ? 'Signing in...'
                      : 'Creating account...'}
                </div>
              ) : isForgotPassword ? (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {isForgotPassword
                  ? 'Remember your password?'
                  : isLogin
                    ? 'New to Expense Tracker?'
                    : 'Already have an account?'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                handleModeChange(isForgotPassword ? 'login' : isLogin ? 'signup' : 'login')
              }
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isForgotPassword
                ? 'Back to Sign In'
                : isLogin
                  ? 'Create an account'
                  : 'Sign in to your account'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
            <span>By using Expense Tracker, you agree to our</span>
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
