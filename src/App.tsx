import React, { useState, useEffect } from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { AuthForm } from './components/AuthForm';
import { Expense } from './types';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setEditingExpense(null);
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

  const summary = {
    total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    byCategory: expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white">
        <div className="animate-pulse text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-full">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-sm text-gray-600">by Ms Tech Geek</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg p-4">
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-8 space-y-6">
        <ExpenseForm 
          onSubmit={editingExpense ? updateExpense : addExpense}
          initialExpense={editingExpense}
          onCancel={() => setEditingExpense(null)}
        />
        
        {expenses.length > 0 && (
          <>
            <div className="mt-8">
              <ExpenseSummary summary={summary} />
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h2>
              <ExpenseList 
                expenses={expenses} 
                onEdit={setEditingExpense}
                onDelete={deleteExpense}
              />
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