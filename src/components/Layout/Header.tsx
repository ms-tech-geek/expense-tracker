import React from 'react';
import { Wallet, LogOut } from 'lucide-react';

interface HeaderProps {
  onSignOut: () => void;
  signOutLoading: boolean;
}

export function Header({ onSignOut, signOutLoading }: HeaderProps) {
  return (
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
        onClick={onSignOut}
        disabled={signOutLoading}
        className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogOut className={`w-5 h-5 ${signOutLoading ? 'animate-pulse' : ''}`} />
      </button>
    </header>
  );
}
