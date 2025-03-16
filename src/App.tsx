import React, { useState, useEffect } from 'react';
import { Wallet, Plus, BarChart, List, LogOut, PieChart, Settings, Pencil, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { CategoryForm } from './components/CategoryForm';
import { AuthForm } from './components/AuthForm';
import { Expense, Category } from './types';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'add' | 'summary' | 'categories'>('list');

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
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading categories:', error);
      return;
    }

    setCategories(data || []);
  };

  const addCategory = async (category: Partial<Category>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...category,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A category with this name already exists');
      }
      throw error;
    }

    setCategories(prev => [...prev, data]);
  };

  const updateCategory = async (category: Partial<Category>) => {
    if (!category.id) return;

    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        icon: category.icon,
        color: category.color
      })
      .eq('id', category.id);

    if (error) {
      if (error.code === '23505') {
        throw new Error('A category with this name already exists');
      }
      throw error;
    }

    setCategories(prev => 
      prev.map(c => c.id === category.id ? { ...c, ...category } : c)
    );
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return;
    }

    setCategories(prev => prev.filter(c => c.id !== id));
  };

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
                  categories={categories}
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
                categories={categories}
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
              <ExpenseSummary summary={summary} categories={categories} />
            </div>
          )}

          {activeView === 'categories' && (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                <button
                  onClick={() => setEditingCategory({ id: '', user_id: '', name: '', icon: 'ShoppingCart', color: 'text-indigo-500', created_at: '' })}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Category
                </button>
              </div>

              {!editingCategory ? (
                <div className="grid gap-4">
                  {categories.map((category) => {
                    const IconComponent = Icons[category.icon as keyof typeof Icons];
                    return (
                      <div
                        key={category.id}
                        className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-50 rounded-full">
                            {IconComponent && (
                              <IconComponent className={`w-5 h-5 ${category.color}`} />
                            )}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this category?')) {
                                deleteCategory(category.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <CategoryForm
                  onSubmit={editingCategory ? updateCategory : addCategory}
                  initialCategory={editingCategory}
                  onCancel={() => setEditingCategory(null)}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
        <div className="grid grid-cols-4 h-16">
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
          <button
            onClick={() => {
              setEditingCategory(null);
              setActiveView('categories');
            }}
            className={`flex flex-col items-center justify-center ${
              activeView === 'categories' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Categories</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;