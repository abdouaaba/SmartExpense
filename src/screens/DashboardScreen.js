// screens/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles';

const DashboardScreen = () => {
  // For now, let's use placeholder data
  const totalSpending = 500;
  const budget = 1000;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Spending: ${totalSpending}</Text>
        <Text style={styles.summaryText}>Budget: ${budget}</Text>
      </View>
      {/* Add more components for additional dashboard features */}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: globalStyles.button.backgroundColor,
    padding: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DashboardScreen;
