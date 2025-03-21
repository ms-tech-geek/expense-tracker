import React from 'react';
import { Wallet, UserX, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DeleteAccount() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-full">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-sm text-gray-600">Account Deletion</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-3 text-gray-900">
            <UserX className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold">Delete Your Account</h2>
          </div>

          <div className="prose prose-sm">
            <p>
              We're sorry to see you go. You have several options to delete your account and associated data:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">Option 1: Delete through the App</h3>
                <p className="mt-2">
                  If you're logged in to the app, you can delete your account instantly through Settings:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Go to Settings in the app</li>
                  <li>Scroll to "Delete Account"</li>
                  <li>Click the "Delete Account" button</li>
                </ol>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">Option 2: Email Request</h3>
                <p className="mt-2">
                  Send an email to request account deletion:
                </p>
                <a 
                  href="mailto:mayanksethi.apps@gmail.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20account%20with%20email:"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Deletion Request
                </a>
                <p className="mt-2 text-sm text-gray-500">
                  Please include your registered email address in the request.
                </p>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                After deletion:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All your personal information will be permanently deleted</li>
                <li>All your expense data will be removed</li>
                <li>This action cannot be undone</li>
                <li>You'll need to create a new account if you want to use the app again</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to App
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}