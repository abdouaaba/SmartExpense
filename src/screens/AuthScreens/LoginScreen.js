// screens/AuthScreens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { globalStyles } from '../../styles';

const LoginScreen = ({ navigation }) => {
  const navigateToSignup = () => {
    navigation.navigate('Sign Up');
  };

  const handleLogin = (values) => {
    // login logic
    console.log('Login:', values);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={yup.object().shape({
          email: yup.string().email('Invalid email').required('Email is required'),
          password: yup.string().required('Password is required'),
        })}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              value={values.email}
            />
            <Text style={globalStyles.error}>{errors.email}</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            <Text style={globalStyles.error}>{errors.password}</Text>
            <Button
              title="Login"
              onPress={handleSubmit}
              color={globalStyles.button.backgroundColor}
            />
          </>
        )}
      </Formik>
      <Text style={globalStyles.linkText}>
        Don't have an account?{' '}
        <Text style={globalStyles.linkText} onPress={navigateToSignup}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
