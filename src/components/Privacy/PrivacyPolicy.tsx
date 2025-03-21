import React from 'react';
import { Wallet, Shield, Eye, Lock, Database, Trash2, Mail } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-full">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-sm text-gray-600">Privacy Policy</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Introduction</h3>
                <p className="mt-2 text-gray-600">
                  We are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, and safeguard your data when you use our Expense 
                  Tracker application.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Eye className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Information We Collect</h3>
                <ul className="mt-2 text-gray-600 list-disc list-inside space-y-2">
                  <li>Email address (for authentication)</li>
                  <li>Expense data (amount, category, date, description)</li>
                  <li>Usage data (app interactions and preferences)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Database className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">How We Use Your Information</h3>
                <ul className="mt-2 text-gray-600 list-disc list-inside space-y-2">
                  <li>To provide and maintain the Expense Tracker service</li>
                  <li>To authenticate your account and protect your data</li>
                  <li>To improve our application and user experience</li>
                  <li>To communicate important updates and changes</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Lock className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Security</h3>
                <p className="mt-2 text-gray-600">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="mt-2 text-gray-600 list-disc list-inside space-y-2">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure authentication mechanisms</li>
                  <li>Regular security audits and updates</li>
                  <li>Strict access controls and data isolation</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Trash2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Deletion</h3>
                <p className="mt-2 text-gray-600">
                  You can request deletion of your account and associated data at any time through the app's settings. 
                  Upon deletion, all your personal information and expense data will be permanently removed from our systems.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
                <p className="mt-2 text-gray-600">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  <br />
                  <a href="mailto:mayanksethi.apps@gmail.com" className="text-indigo-600 hover:text-indigo-700">
                    mayanksethi.apps@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Children's Privacy</h3>
            <p className="mt-2 text-gray-600">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe that your child has 
              provided us with personal information, please contact us so that we can take necessary actions.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Changes to This Policy</h3>
            <p className="mt-2 text-gray-600">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}