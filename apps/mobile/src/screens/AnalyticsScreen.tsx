import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useExpenses, useCategories } from '@expense-tracker/shared';
import { useAuth } from '@expense-tracker/shared';
import { ExpenseSummary } from '../components/ExpenseSummary';
import type { DateRange } from '@expense-tracker/shared';

export function AnalyticsScreen() {
  const { user } = useAuth();
  const { expenses } = useExpenses(user?.id);
  const { categories } = useCategories();
  const [dateRange, setDateRange] = useState<DateRange>('last-week');

  return (
    <View style={styles.container}>
      <ExpenseSummary
        expenses={expenses}
        categories={categories}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});