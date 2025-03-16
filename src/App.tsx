import React, { useState, useEffect } from 'react';
import { Wallet, Plus, List, LogOut, PieChart, Settings, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
// import { CategoryForm } from './components/CategoryForm';
import { AuthForm } from './components/AuthForm';
import { Expense, Category } from './types';

// Default categories with hierarchy
const DEFAULT_CATEGORIES: Category[] = [
  // Housing
  { id: 'housing', user_id: '', name: 'Housing', icon: 'Home', color: 'text-blue-600', created_at: '' },
  { id: 'rent', user_id: '', name: 'Rent', icon: 'Key', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'mortgage', user_id: '', name: 'Mortgage', icon: 'Building', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'property_tax', user_id: '', name: 'Property Taxes', icon: 'FileText', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'utilities', user_id: '', name: 'Utilities', icon: 'Zap', color: 'text-blue-500', created_at: '', parent_id: 'housing' },
  { id: 'home_maintenance', user_id: '', name: 'Home Maintenance', icon: 'Tool', color: 'text-blue-500', created_at: '', parent_id: 'housing' },

  // Transportation
  { id: 'transport', user_id: '', name: 'Transportation', icon: 'Car', color: 'text-green-600', created_at: '' },
  { id: 'car_payment', user_id: '', name: 'Car Payments', icon: 'Car', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'fuel', user_id: '', name: 'Fuel', icon: 'Fuel', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'public_transport', user_id: '', name: 'Public Transport', icon: 'Train', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'car_maintenance', user_id: '', name: 'Repairs & Maintenance', icon: 'Wrench', color: 'text-green-500', created_at: '', parent_id: 'transport' },
  { id: 'parking', user_id: '', name: 'Parking Fees', icon: 'ParkingCircle', color: 'text-green-500', created_at: '', parent_id: 'transport' },

  // Food
  { id: 'food', user_id: '', name: 'Food', icon: 'Utensils', color: 'text-orange-500', created_at: '' },
  { id: 'groceries', user_id: '', name: 'Groceries', icon: 'ShoppingCart', color: 'text-orange-500', created_at: '', parent_id: 'food' },
  { id: 'dining', user_id: '', name: 'Dining Out', icon: 'Utensils', color: 'text-orange-500', created_at: '', parent_id: 'food' },
  { id: 'coffee', user_id: '', name: 'Coffee Shops/Snacks', icon: 'Coffee', color: 'text-orange-500', created_at: '', parent_id: 'food' },

  // Health & Wellness
  { id: 'health', user_id: '', name: 'Health & Wellness', icon: 'Heart', color: 'text-red-500', created_at: '' },
  { id: 'health_insurance', user_id: '', name: 'Health Insurance', icon: 'Shield', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'doctor', user_id: '', name: 'Doctor Visits', icon: 'Stethoscope', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'medications', user_id: '', name: 'Medications', icon: 'Pill', color: 'text-red-500', created_at: '', parent_id: 'health' },
  { id: 'gym', user_id: '', name: 'Gym Memberships', icon: 'Dumbbell', color: 'text-red-500', created_at: '', parent_id: 'health' },

  // Personal Care
  { id: 'personal', user_id: '', name: 'Personal Care', icon: 'Scissors', color: 'text-pink-500', created_at: '' },
  { id: 'grooming', user_id: '', name: 'Haircuts/Grooming', icon: 'Scissors', color: 'text-pink-500', created_at: '', parent_id: 'personal' },
  { id: 'cosmetics', user_id: '', name: 'Skincare/Cosmetics', icon: 'Sparkles', color: 'text-pink-500', created_at: '', parent_id: 'personal' },

  // Entertainment
  { id: 'entertainment', user_id: '', name: 'Entertainment', icon: 'Film', color: 'text-purple-500', created_at: '' },
  { id: 'streaming', user_id: '', name: 'Streaming Services', icon: 'Play', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },
  { id: 'events', user_id: '', name: 'Movies/Concerts', icon: 'Film', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },
  { id: 'sports', user_id: '', name: 'Sports Events', icon: 'Trophy', color: 'text-purple-500', created_at: '', parent_id: 'entertainment' },

  // Travel
  { id: 'travel', user_id: '', name: 'Travel', icon: 'Plane', color: 'text-cyan-500', created_at: '' },
  { id: 'flights', user_id: '', name: 'Flights', icon: 'Plane', color: 'text-cyan-500', created_at: '', parent_id: 'travel' },
  { id: 'hotels', user_id: '', name: 'Accommodation', icon: 'Hotel', color: 'text-cyan-500', created_at: '', parent_id: 'travel' },
  { id: 'travel_food', user_id: '', name: 'Travel Meals', icon: 'UtensilsCrossed', color: 'text-cyan-500', created_at: '', parent_id: 'travel' },

  // Subscriptions
  { id: 'subscriptions', user_id: '', name: 'Subscriptions', icon: 'Repeat', color: 'text-indigo-500', created_at: '' },
  { id: 'software', user_id: '', name: 'Software Tools', icon: 'Laptop', color: 'text-indigo-500', created_at: '', parent_id: 'subscriptions' },
  { id: 'professional', user_id: '', name: 'Professional Fees', icon: 'FileText', color: 'text-indigo-500', created_at: '', parent_id: 'subscriptions' },

  // Education
  { id: 'education', user_id: '', name: 'Childcare & Education', icon: 'GraduationCap', color: 'text-yellow-500', created_at: '' },
  { id: 'school_fees', user_id: '', name: 'School Fees', icon: 'GraduationCap', color: 'text-yellow-500', created_at: '', parent_id: 'education' },
  { id: 'school_supplies', user_id: '', name: 'School Supplies', icon: 'Book', color: 'text-yellow-500', created_at: '', parent_id: 'education' },
  { id: 'babysitting', user_id: '', name: 'Babysitting', icon: 'Users', color: 'text-yellow-500', created_at: '', parent_id: 'education' },

  // Pets
  { id: 'pets', user_id: '', name: 'Pets', icon: 'PawPrint', color: 'text-amber-500', created_at: '' },
  { id: 'pet_supplies', user_id: '', name: 'Pet Food & Supplies', icon: 'ShoppingBag', color: 'text-amber-500', created_at: '', parent_id: 'pets' },
  { id: 'vet', user_id: '', name: 'Vet Visits', icon: 'Stethoscope', color: 'text-amber-500', created_at: '', parent_id: 'pets' },

  // Savings & Investments
  { id: 'savings', user_id: '', name: 'Savings & Investments', icon: 'TrendingUp', color: 'text-emerald-500', created_at: '' },
  { id: 'emergency', user_id: '', name: 'Emergency Fund', icon: 'Shield', color: 'text-emerald-500', created_at: '', parent_id: 'savings' },
  { id: 'investments', user_id: '', name: 'Investments', icon: 'TrendingUp', color: 'text-emerald-500', created_at: '', parent_id: 'savings' },

  // Debt Repayment
  { id: 'debt', user_id: '', name: 'Debt Repayment', icon: 'CreditCard', color: 'text-rose-500', created_at: '' },
  { id: 'credit_card', user_id: '', name: 'Credit Card Payments', icon: 'CreditCard', color: 'text-rose-500', created_at: '', parent_id: 'debt' },
  { id: 'loans', user_id: '', name: 'Loan Payments', icon: 'Landmark', color: 'text-rose-500', created_at: '', parent_id: 'debt' },

  // Gifts & Donations
  { id: 'gifts', user_id: '', name: 'Gifts & Donations', icon: 'Gift', color: 'text-red-400', created_at: '' },
  { id: 'gift_giving', user_id: '', name: 'Gifts', icon: 'Gift', color: 'text-red-400', created_at: '', parent_id: 'gifts' },
  { id: 'charity', user_id: '', name: 'Charity', icon: 'Heart', color: 'text-red-400', created_at: '', parent_id: 'gifts' },

  // Work Expenses
  { id: 'work', user_id: '', name: 'Work Expenses', icon: 'Briefcase', color: 'text-gray-600', created_at: '' },
  { id: 'office_supplies', user_id: '', name: 'Office Supplies', icon: 'PenTool', color: 'text-gray-600', created_at: '', parent_id: 'work' },
  { id: 'equipment', user_id: '', name: 'Work Equipment', icon: 'Monitor', color: 'text-gray-600', created_at: '', parent_id: 'work' },

  // Clothing
  { id: 'clothing', user_id: '', name: 'Clothing', icon: 'Shirt', color: 'text-violet-500', created_at: '' },
  { id: 'work_clothes', user_id: '', name: 'Work Clothes', icon: 'Shirt', color: 'text-violet-500', created_at: '', parent_id: 'clothing' },
  { id: 'dry_cleaning', user_id: '', name: 'Dry Cleaning', icon: 'Shirt', color: 'text-violet-500', created_at: '', parent_id: 'clothing' }
];

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'add' | 'summary' | 'settings'>('list');
  const [clearDataLoading, setClearDataLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

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

  const handleClearData = async () => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to clear all expense data? This action cannot be undone.')) {
      return;
    }
    
    setClearDataLoading(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setExpenses([]);
      alert('All expense data has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    } finally {
      setClearDataLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (signOutLoading) return;
    
    setSignOutLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setSignOutLoading(false);
    }
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
          onClick={handleSignOut}
          disabled={signOutLoading}
          className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className={`w-5 h-5 ${signOutLoading ? 'animate-pulse' : ''}`} />
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

          {activeView === 'settings' && (
            <div className="p-4 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              
              <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <h3 className="font-medium text-gray-900">Data Management</h3>
                
                <div className="border-t pt-4">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="p-2 bg-red-50 rounded-full">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Clear All Expense Data</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        This will permanently delete all your expense records. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleClearData}
                        disabled={clearDataLoading}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {clearDataLoading ? 'Clearing...' : 'Clear All Data'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
            onClick={() => setActiveView('settings')}
            className={`flex flex-col items-center justify-center ${
              activeView === 'settings' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;