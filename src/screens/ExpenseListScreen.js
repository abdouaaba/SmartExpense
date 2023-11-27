// screens/ExpenseListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ExpenseListScreen = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const userId = auth().currentUser.uid;

    const unsubscribe = firestore()
      .collection('expenses')
      .where('user_id', '==', userId)
      .orderBy('date', 'desc')
      .onSnapshot((querySnapshot) => {
        const expensesData = [];

        querySnapshot.forEach((doc) => {
          expensesData.push({ id: doc.id, ...doc.data() });
        });

        setExpenses(expensesData);
      });

    return () => {
      // Cleanup listener
      unsubscribe();
    };
  }, []);

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firestore().collection('expenses').doc(expenseId).delete();
            } catch (error) {
              console.error('Error deleting expense:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense List</Text>
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text>{`Amount: ${item.amount.toFixed(2)} MAD`}</Text>
              <Text>{`Date: ${item.date.toDate().toLocaleDateString()}`}</Text>
              <Text>{`Category: ${item.category_id}`}</Text>
              <Text>{`Notes: ${item.notes || 'N/A'}`}</Text>
              {/* Add a delete button */}
              <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No expenses found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  expenseItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingBottom: 10,
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default ExpenseListScreen;
