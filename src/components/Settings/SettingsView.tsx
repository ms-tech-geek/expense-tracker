import React from 'react';
import { AlertTriangle, UserX } from 'lucide-react';
import { DataDeletionForm } from './DataDeletionForm';
import { useCategories } from '../../hooks/useCategories';

interface SettingsViewProps {
  onDeleteAccount: () => void;
  deleteAccountLoading: boolean;
}

export function SettingsView({ onDeleteAccount, deleteAccountLoading }: SettingsViewProps) {
  const { categories } = useCategories();

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="font-medium text-gray-900">Data Management</h3>

        <div className="border-t pt-4 space-y-6">
          <DataDeletionForm categories={categories} />
          <p className="mt-2 text-gray-600">You can request data deletion in any of these ways:</p>
          <div className="mt-2 space-y-2 text-sm text-gray-500">
            <p className="flex items-start">
              <span className="font-medium mr-2">1.</span>
              Use the form above to request deletion of specific data
            </p>
            <p className="flex items-start">
              <span className="font-medium mr-2">2.</span>
              Visit{' '}
              <a
                href="https://expense-tracker-ms-tech-geek.netlify.app/delete-data"
                className="text-indigo-600 hover:text-indigo-700"
              >
                our data deletion page
              </a>
            </p>
            <p className="flex items-start">
              <span className="font-medium mr-2">3.</span>
              Email{' '}
              <a
                href="mailto:mayanksethi.apps@gmail.com?subject=Data%20Deletion%20Request"
                className="text-indigo-600 hover:text-indigo-700"
              >
                mayanksethi.apps@gmail.com
              </a>
            </p>
          </div>

          <div className="flex items-start space-x-4 text-left pt-4 border-t">
            <div className="p-2 bg-red-50 rounded-full">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="mt-1 text-sm text-gray-500">
                You can request account deletion in any of these ways:
              </p>
              <div className="mt-2 space-y-2 text-sm text-gray-500">
                <p className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  Use the button below to instantly delete your account and all associated data
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  Visit{' '}
                  <a
                    href="https://expense-tracker-ms-tech-geek.netlify.app/delete-account"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    our account deletion page
                  </a>
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  Email{' '}
                  <a
                    href="mailto:mayanksethi.apps@gmail.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20account%20with%20email:"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    mayanksethi.apps@gmail.com
                  </a>
                </p>
              </div>
              <button
                onClick={onDeleteAccount}
                disabled={deleteAccountLoading}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteAccountLoading ? 'Deleting Account...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
