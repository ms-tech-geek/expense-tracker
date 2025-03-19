import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@expense-tracker/shared';

import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ title: 'Expenses' }}
              />
              <Stack.Screen 
                name="AddExpense" 
                component={AddExpenseScreen}
                options={({ route }) => ({
                  title: route.params?.initialExpense ? 'Edit Expense' : 'Add Expense'
                })}
              />
              <Stack.Screen 
                name="Analytics" 
                component={AnalyticsScreen}
                options={{ title: 'Analytics' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}