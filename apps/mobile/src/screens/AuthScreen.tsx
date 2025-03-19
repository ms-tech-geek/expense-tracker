import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthForm } from '../components/AuthForm';

export function AuthScreen() {
  return (
    <View style={styles.container}>
      <AuthForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});