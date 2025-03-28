import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Expense } from '../types';

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    if (!userId) return;

    setError(null);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('expense_date', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      setError('Failed to load expenses. Please try again.');
      setExpenses([]);
      setLoading(false);
    } else {
      setExpenses(data || []);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadExpenses();
    }
  }, [userId, loadExpenses]);

  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    if (!userId) return;

    setError(null);
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          ...newExpense,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      throw error;
    }

    setExpenses(prev => [data, ...prev]);
  };

  const updateExpense = async (expense: Expense) => {
    setError(null);
    const { error } = await supabase
      .from('expenses')
      .update({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        expense_date: expense.expense_date,
      })
      .eq('id', expense.id);

    if (error) {
      console.error('Error updating expense:', error);
      throw error;
    }

    setExpenses(prev => prev.map(e => (e.id === expense.id ? expense : e)));
  };

  const deleteExpense = async (id: string) => {
    setError(null);
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }

    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    setExpenses,
    error,
    loadExpenses,
  };
}
