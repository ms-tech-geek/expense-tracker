import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '@expense-tracker/shared';

interface SettingsViewProps {
  onDeleteAccount: () => void;
}

export function SettingsView({ onDeleteAccount }: SettingsViewProps) {
  const { handleSignOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: handleSignOut,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={confirmSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={onDeleteAccount}
        >
          <Text style={[styles.buttonText, styles.dangerButtonText]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: '#fee2e2',
  },
  dangerButtonText: {
    color: '#dc2626',
  },
});