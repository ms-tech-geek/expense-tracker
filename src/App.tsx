import React, { useState, useEffect } from 'react';
import { Wallet, Plus, BarChart, List, LogOut, PieChart } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { AuthForm } from './components/AuthForm';
import { Expense } from './types';
import { categories } from './data/categories';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'add' | 'summary'>('list');

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
      const cat = categories.find(c => c.id === exp.category);
      if (cat) {
        acc[cat.id] = (acc[cat.id] || 0) + exp.amount;
      }
      return acc;
    }, {} as Record<string, number>),
    weekly: getWeeklyData(expenses),
    monthly: getMonthlyData(expenses),
    categoryData: getCategoryData(expenses),
  };

  function getWeeklyData(expenses: Expense[]) {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    const days = eachDayOfInterval({ start, end });
    
    const labels = days.map(day => format(day, 'EEE'));
    const data = days.map(day => {
      return expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return format(expDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    return { labels, data };
  }

  function getMonthlyData(expenses: Expense[]) {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const weeks = eachWeekOfInterval({ start, end });
    
    const labels = weeks.map(week => `Week ${format(week, 'w')}`);
    const data = weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      return expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= weekStart && expDate <= weekEnd;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    return { labels, data };
  }

  function getCategoryData(expenses: Expense[]) {
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedCategories.map(([id]) => 
        categories.find(c => c.id === id)?.name || id
      ),
      data: sortedCategories.map(([, amount]) => amount)
    };
  }

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between">
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
          onClick={() => supabase.auth.signOut()}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="h-full">
          {activeView === 'list' && (
            <div className="h-full">
              {expenses.length > 0 ? (
                <ExpenseList 
                  expenses={expenses} 
                  onEdit={(expense) => {
                    setEditingExpense(expense);
                    setActiveView('add');
                  }}
                  onDelete={deleteExpense}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Wallet className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No expenses yet. Add your first expense!</p>
                </div>
              )}
            </div>
          )}

          {activeView === 'add' && (
            <div className="p-4">
              <ExpenseForm 
                onSubmit={editingExpense ? updateExpense : addExpense}
                initialExpense={editingExpense}
                onCancel={() => {
                  setEditingExpense(null);
                  setActiveView('list');
                }}
                onSuccess={() => setActiveView('list')}
              />
            </div>
          )}

          {activeView === 'summary' && (
            <div className="p-4">
              <ExpenseSummary summary={summary} />
            </div>
          )}
        </div>
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
        <div className="grid grid-cols-3 h-16">
          <button
            onClick={() => setActiveView('list')}
            className={`flex flex-col items-center justify-center ${
              activeView === 'list' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <List className="w-6 h-6" />
            <span className="text-xs mt-1">Expenses</span>
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setActiveView('add');
            }}
            className={`flex flex-col items-center justify-center ${
              activeView === 'add' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs mt-1">Add</span>
          </button>
          <button
            onClick={() => setActiveView('summary')}
            className={`flex flex-col items-center justify-center ${
              activeView === 'summary' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <PieChart className="w-6 h-6" />
            <span className="text-xs mt-1">Summary</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;