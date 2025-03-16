import React from 'react';
import { BarChart, TrendingUp, Calendar, PieChart } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ExpenseSummary as Summary } from '../types';
import { categories } from '../data/categories';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ExpenseSummaryProps {
  summary: Summary;
}

export function ExpenseSummary({ summary }: ExpenseSummaryProps) {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">Total Expenses</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          ₹{summary.total.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">This Week</h3>
        </div>
        <div className="h-48">
          <Bar
            data={{
              labels: summary.weekly.labels,
              datasets: [
                {
                  label: 'Daily Expenses',
                  data: summary.weekly.data,
                  backgroundColor: 'rgba(99, 102, 241, 0.5)',
                  borderColor: 'rgb(99, 102, 241)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `₹${value}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">This Month</h3>
        </div>
        <div className="h-48">
          <Bar
            data={{
              labels: summary.monthly.labels,
              datasets: [
                {
                  label: 'Weekly Expenses',
                  data: summary.monthly.data,
                  backgroundColor: 'rgba(99, 102, 241, 0.5)',
                  borderColor: 'rgb(99, 102, 241)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `₹${value}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">Top Categories</h3>
        </div>
        <div className="h-64">
          <Pie
            data={{
              labels: summary.categoryData.labels,
              datasets: [
                {
                  data: summary.categoryData.data,
                  backgroundColor: [
                    '#f97316', // orange-500
                    '#22c55e', // green-500
                    '#f59e0b', // amber-500
                    '#ef4444', // red-500
                    '#3b82f6', // blue-500
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 12,
                    color: '#4b5563', // text-gray-600
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 -mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900">By Category</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(summary.byCategory).map(([categoryId, amount]) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return null;
            
            return (
              <div key={categoryId} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="font-medium">₹{amount.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}