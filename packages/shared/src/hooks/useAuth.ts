import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DeleteAccountOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  useEffect(() => {
    // Initialize auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN') {
          setUser(session?.user);
          setRefreshError(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRefreshError(false);
        } else if (event === 'TOKEN_REFRESHED') {
          setRefreshError(false);
        } else if (event === 'USER_DELETED') {
          setUser(null);
          setRefreshError(false);
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (err instanceof Error && err.message.includes('refresh_token')) {
          setRefreshError(true);
          await handleSignOut();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (signOutLoading) return;
    
    setSignOutLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setRefreshError(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
    } finally {
      setSignOutLoading(false);
    }
  };

  const handleDeleteAccount = async ({ onSuccess, onError }: DeleteAccountOptions = {}) => {
    if (!user || deleteAccountLoading) return;

    if (!window.confirm('Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone.')) {
      return;
    }

    setDeleteAccountLoading(true);
    try {
      // Delete all user data
      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id);

      if (expensesError) throw expensesError;

      // Delete user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;

      onSuccess?.();
      setUser(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to delete account'));
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  return {
    user,
    loading,
    signOutLoading,
    refreshError,
    deleteAccountLoading,
    handleSignOut,
    handleDeleteAccount
  };
}