import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ExpenseEntryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('expense');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categories, setCategories] = useState([
    { id: "food", name: 'Food', color: '#FF6347' },
    { id: "transportation", name: 'Transportation', color: '#1E90FF' },
    { id: "shopping", name: 'Shopping', color: '#8A2BE2' },
    { id: "utilities", name: 'Utilities', color: '#32CD32' },
    { id: "other", name: 'Other', color: '#808080' },
  ]);

  const handleExpenseEntry = async (values) => {
    try {
      const { amount, notes } = values;
      const userId = auth().currentUser.uid;

      await firestore().collection('entries').add({
        amount: parseFloat(amount),
        category_id: selectedCategory,
        date: selectedDate,
        notes: notes,
        type: selectedType,
        user_id: userId,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Expense entry error:', error);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Entry</Text>
      <Formik
        initialValues={{ amount: '', notes: '' }}
        validationSchema={yup.object().shape({
          amount: yup.number().required('Amount is required').positive('Amount must be positive'),
          notes: yup.string(),
        })}
        onSubmit={handleExpenseEntry}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              onChangeText={handleChange('amount')}
              value={values.amount}
            />
            <Text style={styles.error}>{errors.amount}</Text>

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerLabel}>Date</Text>
              <Button title="Select Date" onPress={showDatePickerModal} />
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <Text>{selectedDate.toLocaleDateString()}</Text>
            </View>

            {/* Dropdown for Category */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Category</Text>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.error}>{errors.category}</Text>

            {/* Radio buttons for Type */}
            <View style={styles.radioContainer}>
              <Text style={styles.inputLabel}>Type</Text>
              <TouchableOpacity
                style={[styles.radio, selectedType === 'expense' && styles.selectedRadio]}
                onPress={() => setSelectedType('expense')}
              >
              </TouchableOpacity>
              <Text>Expense</Text>
              <TouchableOpacity
                style={[styles.radio, selectedType === 'income' && styles.selectedRadio]}
                onPress={() => setSelectedType('income')}
              >
              </TouchableOpacity>
              <Text>Income</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Notes"
              onChangeText={handleChange('notes')}
              value={values.notes}
            />
            <Text style={styles.error}>{errors.notes}</Text>
            <Button title="Submit" onPress={handleSubmit} />
          </>
        )}
      </Formik>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },

  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },

  datePickerContainer: {
    marginBottom: 10,
  },
  datePickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },

  radioContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    marginRight: 10,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 10,
  },
  
  selectedRadio: {
    backgroundColor: 'black',
  },
});

export default ExpenseEntryScreen;
