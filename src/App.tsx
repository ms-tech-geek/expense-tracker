import React, { useState, useEffect, useCallback } from 'react';
import { Wallet } from 'lucide-react';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { AuthForm } from './components/AuthForm';
import { Expense } from './types';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState(supabase.auth.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      return;
    }

    setExpenses(data || []);
  };

  const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
    .from('expenses')
    .insert([{
      ...newExpense,
      user_id: user.id
    }])
    .select()
    .single();

    if (error) {
      console.error('Error adding expense:', error);
      return;
    }

    setExpenses((prev) => [data, ...prev]);
  };

  const summary = {
    total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    byCategory: expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>),
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center space-x-2">
          <Wallet className="w-8 h-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="ml-auto text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <ExpenseForm onSubmit={addExpense} />
        
        {expenses.length > 0 && (
          <>
            <div className="mt-8">
              <ExpenseSummary summary={summary} />
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h2>
              <ExpenseList expenses={expenses} />
            </div>
          </>
        )}

        {expenses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No expenses yet. Add your first expense above!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
