import React, { useState } from 'react';
import { AlertTriangle, Calendar, Tag, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';

interface DataDeletionFormProps {
  categories: Category[];
}

type DeletionType = 'all_expenses' | 'date_range' | 'category';

export function DataDeletionForm({ categories }: DataDeletionFormProps) {
  const [deletionType, setDeletionType] = useState<DeletionType>('all_expenses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const requestData: any = {
        request_type: deletionType,
      };

      if (deletionType === 'date_range') {
        requestData.date_from = new Date(dateFrom).toISOString();
        requestData.date_to = new Date(dateTo).toISOString();
      } else if (deletionType === 'category') {
        requestData.category_id = categoryId;
      }

      const { error } = await supabase
        .from('data_deletion_requests')
        .insert([requestData]);

      if (error) throw error;

      setSuccess(true);
      setDeletionType('all_expenses');
      setDateFrom('');
      setDateTo('');
      setCategoryId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit deletion request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start space-x-4 text-left">
      <div className="p-2 bg-red-50 rounded-full">
        <AlertTriangle className="w-5 h-5 text-red-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">Request Data Deletion</h4>
        <p className="mt-1 text-sm text-gray-500">
          Select what data you'd like to delete. This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              What would you like to delete?
            </label>
            <select
              value={deletionType}
              onChange={(e) => setDeletionType(e.target.value as DeletionType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all_expenses">All Expenses</option>
              <option value="date_range">Expenses in Date Range</option>
              <option value="category">Expenses in Category</option>
            </select>
          </div>

          {deletionType === 'date_range' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {deletionType === 'category' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Category
              </label>
              <div className="mt-1 relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-sm text-green-600">
                Your deletion request has been submitted and will be processed within 24 hours.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Request...
              </>
            ) : (
              'Submit Deletion Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}