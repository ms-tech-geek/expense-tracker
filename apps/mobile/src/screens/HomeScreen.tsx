import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExpenses } from '@expense-tracker/shared';
import { ExpenseList } from '../components/ExpenseList';
import { useAuth } from '@expense-tracker/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { expenses } = useExpenses(user?.id);

  return (
    <View style={styles.container}>
      <ExpenseList 
        expenses={expenses}
        onEdit={(expense) => {
          navigation.navigate('AddExpense', { initialExpense: expense });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});