import React from 'react';
import { List, Plus, PieChart, Settings } from 'lucide-react';

interface NavigationProps {
  activeView: 'list' | 'add' | 'summary' | 'settings';
  onViewChange: (view: 'list' | 'add' | 'summary' | 'settings') => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
      <div className="grid grid-cols-4 h-16">
        <NavButton
          icon={<List className="w-6 h-6" />}
          label="Expenses"
          isActive={activeView === 'list'}
          onClick={() => onViewChange('list')}
        />
        <NavButton
          icon={<Plus className="w-6 h-6" />}
          label="Add"
          isActive={activeView === 'add'}
          onClick={() => onViewChange('add')}
        />
        <NavButton
          icon={<PieChart className="w-6 h-6" />}
          label="Summary"
          isActive={activeView === 'summary'}
          onClick={() => onViewChange('summary')}
        />
        <NavButton
          icon={<Settings className="w-6 h-6" />}
          label="Settings"
          isActive={activeView === 'settings'}
          onClick={() => onViewChange('settings')}
        />
      </div>
    </nav>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${
        isActive ? 'text-indigo-600' : 'text-gray-600'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}
