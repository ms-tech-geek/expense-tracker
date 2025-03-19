import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@expense-tracker/shared';
import { SettingsView } from '../components/SettingsView';

export function SettingsScreen() {
  const { handleDeleteAccount } = useAuth();

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteAccount({
            onError: (error) => Alert.alert('Error', error.message)
          })
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SettingsView onDeleteAccount={confirmDeleteAccount} />
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