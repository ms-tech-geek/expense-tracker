import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Category } from '../types';

const COLORS = [
  { id: 'text-red-500', name: 'Red' },
  { id: 'text-orange-500', name: 'Orange' },
  { id: 'text-amber-500', name: 'Amber' },
  { id: 'text-yellow-500', name: 'Yellow' },
  { id: 'text-green-500', name: 'Green' },
  { id: 'text-emerald-500', name: 'Emerald' },
  { id: 'text-teal-500', name: 'Teal' },
  { id: 'text-cyan-500', name: 'Cyan' },
  { id: 'text-blue-500', name: 'Blue' },
  { id: 'text-indigo-500', name: 'Indigo' },
  { id: 'text-violet-500', name: 'Violet' },
  { id: 'text-purple-500', name: 'Purple' },
  { id: 'text-fuchsia-500', name: 'Fuchsia' },
  { id: 'text-pink-500', name: 'Pink' },
  { id: 'text-rose-500', name: 'Rose' },
];

const ICONS = [
  'ShoppingCart', 'CreditCard', 'Wallet', 'DollarSign',
  'Car', 'Bus', 'Train', 'Plane',
  'Home', 'Building', 'Hotel', 'Warehouse',
  'Utensils', 'Coffee', 'Pizza', 'Beer',
  'ShoppingBag', 'Shirt', 'Smartphone', 'Laptop',
  'Stethoscope', 'Pill', 'Heart', 'Activity',
  'Film', 'Tv', 'Music', 'Gamepad',
  'Book', 'GraduationCap', 'Library', 'PenTool',
  'Gift', 'Package', 'Tag', 'Tags',
  'Zap', 'Phone', 'Wifi', 'Globe',
];

interface CategoryFormProps {
  onSubmit: (category: Partial<Category>) => Promise<void>;
  initialCategory?: Category;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, initialCategory, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialCategory?.name || '');
  const [icon, setIcon] = useState(initialCategory?.icon || ICONS[0]);
  const [color, setColor] = useState(initialCategory?.color || COLORS[0].id);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      await onSubmit({
        id: initialCategory?.id,
        name: name.trim(),
        icon,
        color,
      });
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialCategory ? 'Edit Category' : 'New Category'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Groceries"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>
        <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
          {ICONS.map((iconName) => {
            const IconComponent = Icons[iconName as keyof typeof Icons];
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setIcon(iconName)}
                className={`p-2 rounded-md ${
                  icon === iconName
                    ? 'bg-indigo-50 ring-2 ring-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${color}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((colorOption) => (
            <button
              key={colorOption.id}
              type="button"
              onClick={() => setColor(colorOption.id)}
              className={`p-2 rounded-md ${
                color === colorOption.id
                  ? 'ring-2 ring-indigo-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-full h-6 rounded ${colorOption.id.replace('text-', 'bg-')}`} />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Save className="w-5 h-5 mr-2" />
        {initialCategory ? 'Save Changes' : 'Create Category'}
      </button>
    </form>
  );
}