import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Expense, Category } from '@expense-tracker/shared';
import { useCategories } from '@expense-tracker/shared';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit }: ExpenseListProps) {
  const { categories } = useCategories();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() => onEdit(item)}
    >
      <View style={styles.expenseHeader}>
        <Text style={styles.categoryText}>{getCategoryName(item.category)}</Text>
        <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.dateText}>{formatDate(item.expense_date)}</Text>
        {item.description && (
          <Text style={styles.descriptionText}>{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={expenses}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No expenses yet. Add your first expense!</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  expenseItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  expenseDetails: {
    flexDirection: 'column',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});