import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExpenses } from '@expense-tracker/shared';
import { ExpenseList } from '../components/ExpenseList';
import { useAuth } from '@expense-tracker/shared';

export function HomeScreen() {
  const { user } = useAuth();
  const { expenses } = useExpenses(user?.id);

  return (
    <View style={styles.container}>
      <ExpenseList expenses={expenses} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});