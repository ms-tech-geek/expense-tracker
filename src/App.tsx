import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { useCategories } from './hooks/useCategories';
import { Header, Navigation } from './components/Layout';
import { SettingsView } from './components/Settings';
import { ExpenseForm, ExpenseList, ExpenseSummary } from './components/Expenses';
import { AuthForm } from './components/Auth';
import { calculateExpenseSummary } from './utils/expenseCalculations';
import { supabase } from './lib/supabase';

function App() {
  const { user, loading, signOutLoading, handleSignOut } = useAuth();
  const { expenses, addExpense, updateExpense, deleteExpense, setExpenses } = useExpenses(user?.id);
  const { categories } = useCategories();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'add' | 'summary' | 'settings'>('list');
  const [clearDataLoading, setClearDataLoading] = useState(false);

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

  const summary = calculateExpenseSummary(expenses, categories);

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
      <Header onSignOut={handleSignOut} signOutLoading={signOutLoading} />

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

          {activeView === 'settings' && <SettingsView onClearData={handleClearData} clearDataLoading={clearDataLoading} />}
        </div>
      </main>

      <Navigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}

export default App;