// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/AuthScreens/LoginScreen';
import SignupScreen from './screens/AuthScreens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import ExpenseEntryScreen from './screens/ExpenseEntryScreen';
import ExpenseListScreen from './screens/ExpenseListScreen';
import CategoryManagementScreen from './screens/CategoryManagementScreen';
import InsightsScreen from './screens/InsightsScreen';
import SearchFilterScreen from './screens/SearchFilterScreen';
import SettingsScreen from './screens/SettingsScreen';
import LogoutScreen from './screens/LogoutScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Log In" component={LoginScreen} />
        <Stack.Screen name="Sign Up" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Expense Entry" component={ExpenseEntryScreen} />
        <Stack.Screen name="Expense List" component={ExpenseListScreen} />
        <Stack.Screen name="Category Management" component={CategoryManagementScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
        <Stack.Screen name="Search Filter" component={SearchFilterScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Logout" component={LogoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
