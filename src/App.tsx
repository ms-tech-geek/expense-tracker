import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { useCategories } from './hooks/useCategories';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Header, Navigation } from './components/Layout';
import { SettingsView } from './components/Settings';
import { ExpenseForm, ExpenseList, ExpenseSummary } from './components/Expenses';
import { AuthForm, DeleteAccount } from './components/Auth';
import { PrivacyPolicy } from './components/Privacy';
import { calculateExpenseSummary } from './utils/expenseCalculations';
import { supabase } from './lib/supabase';
import { AlertCircle } from 'lucide-react';

function useAppState() {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'add' | 'summary' | 'settings'>('list');
  const [dateRange, setDateRange] = useState<DateRange>('last-week');
  const [clearDataLoading, setClearDataLoading] = useState(false);
  return { 
    editingExpense, 
    setEditingExpense, 
    activeView, 
    setActiveView, 
    dateRange,
    setDateRange,
    clearDataLoading, 
    setClearDataLoading 
  };
}

function App() {
  const { user, loading, signOutLoading, refreshError, deleteAccountLoading, handleSignOut, handleDeleteAccount } = useAuth();
  const { 
    editingExpense, 
    setEditingExpense, 
    activeView, 
    setActiveView,
    dateRange,
    setDateRange,
    clearDataLoading, 
    setClearDataLoading 
  } = useAppState();
  const { expenses, addExpense, updateExpense, deleteExpense, setExpenses } = useExpenses(user?.id);
  const { categories } = useCategories();

  const MainApp = () => (
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
              <ExpenseSummary 
                summary={summary} 
                categories={categories}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <SettingsView
              onClearData={handleClearData}
              clearDataLoading={clearDataLoading}
              onDeleteAccount={() => handleDeleteAccount({
                onError: (error) => alert(error.message)
              })}
              deleteAccountLoading={deleteAccountLoading}
            />
          )}
        </div>
      </main>

      <Navigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );

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

  const summary = calculateExpenseSummary(
    expenses, 
    categories, 
    dateRange
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white">
        <div className="animate-pulse text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (refreshError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full space-y-4 text-center">
          <div className="flex justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Session Expired</h2>
          <p className="text-gray-600">Your session has expired. Please sign in again to continue.</p>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route
          path="/*"
          element={
            !user ? (
              <AuthForm />
            ) : (
              <MainApp />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;