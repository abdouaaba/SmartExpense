import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ExpenseEntryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('Expense');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [categories, setCategories] = useState([
    { id: "Food", name: 'Food', color: '#FF6347' },
    { id: "Transportation", name: 'Transportation', color: '#1E90FF' },
    { id: "Shopping", name: 'Shopping', color: '#8A2BE2' },
    { id: "Utilities", name: 'Utilities', color: '#32CD32' },
    { id: "Other", name: 'Other', color: '#808080' },
  ]);

  const handleExpenseEntry = async (values) => {
    try {
      const { amount, notes } = values;
      const userId = auth().currentUser.uid;

      await firestore().collection('entries').add({
        amount: parseFloat(amount),
        category: selectedCategory,
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


  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  return (
    <View style={styles.container}>

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

            {/* Radio buttons for Type */}
            <View style={styles.radioContainer}>
              <Text style={styles.Labeltitle}>Type</Text>
              <View style={styles.radioButtons}>
                <TouchableOpacity
                  style={[styles.radio, selectedType === 'Expense' && styles.selectedRadio]}
                  onPress={() => setSelectedType('Expense')}
                ></TouchableOpacity>
                <Text style={styles.RadioText}>Expense</Text>
                <TouchableOpacity
                  style={[styles.radio, selectedType === 'Income' && styles.selectedRadio]}
                  onPress={() => setSelectedType('Income')}
                ></TouchableOpacity>
                <Text style={styles.RadioText}>Income</Text>
              </View>
            </View>

            <Text style={styles.Labeltitle}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
              onChangeText={handleChange('amount')}
              value={values.amount}
            />
            <Text style={styles.error}>{errors.amount}</Text>


            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <Text style={styles.Labeltitle}>Date</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  editable={false}
                  value={selectedDate.toLocaleDateString()}
                />
                <TouchableOpacity style={styles.SelectButton} onPress={showDatePickerModal}>
                  <Text style={styles.ButtonText}>Select Date</Text>
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Category Input */}
            <View style={styles.inputCatContainer}>
              <Text style={styles.Labeltitle}>Category</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  editable={false}
                  value={selectedCategory ? selectedCategory.name : ''}
                />
                <TouchableOpacity style={styles.SelectButton} onPress={() => setShowCategoryPicker(true)}>
                  <Text style={styles.ButtonText}>Categories</Text>
                </TouchableOpacity>
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={showCategoryPicker}
                onRequestClose={() => setShowCategoryPicker(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {categories.map((category) => (
                      <TouchableHighlight
                        key={category.id}
                        style={styles.categoryItem}
                        onPress={() => handleCategorySelection(category)}
                        underlayColor="#3498db"
                      >
                        <Text style={styles.categoryText}>{category.name}</Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                </View>
              </Modal>
            </View>


            <Text style={styles.Labeltitle}>Notes</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              onChangeText={handleChange('notes')}
              value={values.notes}
            />
            <Text style={styles.error}>{errors.notes}</Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.SubmitText}>SUBMIT</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 0.5)',
  },

  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 16,
    width: '80%',
  },
  
  categoryText: {
    fontSize: 16,
    color: 'black',
  },

  SelectButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
    backgroundColor: '#3498db',
    width: '25%',
  },

  ButtonText: {
    color: 'white',
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'absolute',
    marginBottom: 10,
  },

  container: {
    padding: 10,
  },

  Labeltitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#3498db',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },

  pickerContainer: {
    marginBottom: 10,
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


  radioContainer: {
    marginBottom: 10,
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 30,
  },
  RadioText:{
    color: 'black',
    fontSize: 16,
  },
  
  selectedRadio: {
    backgroundColor: '#3498db',

  },
  SubmitText:{
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  submitButton:{
    backgroundColor: '#3498db',
    height: 35,
  },

});

export default ExpenseEntryScreen;