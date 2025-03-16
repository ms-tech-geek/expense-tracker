import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Expense } from '../types';

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadExpenses();
    }
  }, [userId]);

  const loadExpenses = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      return;
    }

    setExpenses(data || []);
    setLoading(false);
  };

  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        ...newExpense,
        user_id: userId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      return;
    }

    setExpenses((prev) => [data, ...prev]);
  };

  const updateExpense = async (expense: Expense) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date
      })
      .eq('id', expense.id);

    if (error) {
      console.error('Error updating expense:', error);
      return;
    }

    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      return;
    }

    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    setExpenses
  };
}