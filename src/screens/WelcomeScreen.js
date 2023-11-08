// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { globalStyles } from '../styles';

const WelcomeScreen = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate('Log In');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome to Expense Tracker</Text>
      <Text style={globalStyles.subtitle}>Track and manage your expenses effortlessly.</Text>
      <Button title="Get Started" onPress={navigateToLogin} color={globalStyles.button.backgroundColor} />
    </View>
  );
};

export default WelcomeScreen;
