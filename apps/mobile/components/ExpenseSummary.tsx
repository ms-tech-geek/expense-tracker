import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VictoryPie, VictoryBar } from 'victory-native';
import { Expense, Category, DateRange } from '@expense-tracker/shared';
import { calculateExpenseSummary, DATE_RANGE_OPTIONS } from '@expense-tracker/shared';

interface ExpenseSummaryProps {
  expenses: Expense[];
  categories: Category[];
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function ExpenseSummary({
  expenses,
  categories,
  dateRange,
  onDateRangeChange,
}: ExpenseSummaryProps) {
  const summary = calculateExpenseSummary(expenses, categories, dateRange);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Expenses</Text>
        <Text style={styles.totalAmount}>₹{summary.total.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Category Distribution</Text>
        <View style={styles.chartContainer}>
          <VictoryPie
            data={summary.categoryData.data.map((value, index) => ({
              x: summary.categoryData.labels[index],
              y: value,
            }))}
            width={300}
            height={300}
            colorScale={[
              '#f97316',
              '#22c55e',
              '#f59e0b',
              '#ef4444',
              '#3b82f6',
            ]}
            style={{
              labels: {
                fill: '#374151',
                fontSize: 12,
              },
            }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expense Trends</Text>
        <View style={styles.chartContainer}>
          <VictoryBar
            data={summary.timeData.data.map((value, index) => ({
              x: summary.timeData.labels[index],
              y: value,
            }))}
            width={300}
            height={200}
            style={{
              data: { fill: '#4f46e5' },
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
});