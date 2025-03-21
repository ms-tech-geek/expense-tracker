import React from 'react';
import { Wallet, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DataDeletion() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-full">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-sm text-gray-600">Data Deletion Request</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-3 text-gray-900">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold">Request Data Deletion</h2>
          </div>

          <div className="prose prose-sm">
            <p>
              You can request deletion of specific data from your account. Here are your options:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">Option 1: Delete through the App</h3>
                <p className="mt-2">
                  If you're logged in to the app, you can request data deletion through Settings:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Go to Settings in the app</li>
                  <li>Find "Request Data Deletion"</li>
                  <li>Choose what data you want to delete:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>All expenses</li>
                      <li>Expenses from a specific date range</li>
                      <li>Expenses from specific categories</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">Option 2: Email Request</h3>
                <p className="mt-2">
                  Send an email to request data deletion:
                </p>
                <a 
                  href="mailto:mayanksethi.apps@gmail.com?subject=Data%20Deletion%20Request&body=Please%20specify%20what%20data%20you%20would%20like%20to%20delete%20(all%20expenses%2C%20specific%20date%20range%2C%20or%20specific%20categories).%0A%0AEmail%20address%3A%20"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Deletion Request
                </a>
                <p className="mt-2 text-sm text-gray-500">
                  Please include your registered email address and specify what data you want to delete.
                </p>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Important notes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Data deletion requests are processed within 24 hours</li>
                <li>Deleted data cannot be recovered</li>
                <li>Your account will remain active unless you specifically request account deletion</li>
                <li>You can continue using the app after data deletion</li>
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