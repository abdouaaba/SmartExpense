// screens/ExpenseListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ExpenseListScreen = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const userId = auth().currentUser.uid;

    const unsubscribe = firestore()
      .collection('entries')
      .where('user_id', '==', userId)
      .orderBy('date', 'desc')
      .onSnapshot((querySnapshot) => {
        const entriesData = [];

        querySnapshot.forEach((doc) => {
          entriesData.push({ id: doc.id, ...doc.data() });
        });

        setEntries(entriesData);
      });

    return () => {
      // Cleanup listener
      unsubscribe();
    };
  }, []);

  const handleDeleteEntry = (entryId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firestore().collection('entries').doc(entryId).delete();
            } catch (error) {
              console.error('Error deleting entry:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>

      {entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.entryItem}>
              <Text style={styles.labelText}>{`Type: ${item.type}`}</Text>
              <Text style={styles.labelText}>{`Amount: ${item.amount.toFixed(2)} MAD`}</Text>
              <Text style={styles.labelText}>{`Date: ${item.date.toDate().toLocaleDateString()}`}</Text>
              <Text style={styles.labelText}>{`Category: ${item.category ? item.category.name : 'N/A'}`}</Text>
              <Text style={styles.labelText}>{`Notes: ${item.notes || 'N/A'}`}</Text>
              {/* Add a delete button */}
              <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No entries found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  entryItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
    paddingBottom: 10,
  },

  labelText: {
    color: 'black',
  },

  deleteButton: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },
});

export default ExpenseListScreen;
