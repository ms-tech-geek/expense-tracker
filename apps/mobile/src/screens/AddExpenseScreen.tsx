import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExpenseForm } from '../components/ExpenseForm';
import { useExpenses } from '@expense-tracker/shared';
import { useAuth } from '@expense-tracker/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

export function AddExpenseScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { addExpense } = useExpenses(user?.id);

  return (
    <View style={styles.container}>
      <ExpenseForm
        onSubmit={async (expense) => {
          await addExpense(expense);
          navigation.goBack();
        }}
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