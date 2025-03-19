import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExpenseForm } from '../components/ExpenseForm';
import { useExpenses } from '@expense-tracker/shared';
import { useAuth } from '@expense-tracker/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

export function AddExpenseScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { addExpense, updateExpense } = useExpenses(user?.id);
  const initialExpense = route.params?.initialExpense;

  return (
    <View style={styles.container}>
      <ExpenseForm
        initialExpense={initialExpense}
        onSubmit={async (expense) => {
          if (initialExpense) {
            await updateExpense({ ...expense, id: initialExpense.id });
          } else {
            await addExpense(expense);
          }
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