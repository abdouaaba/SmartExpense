// screens/AuthScreens/SignupScreen.js
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { globalStyles } from '../../styles';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate('Log In');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const handleSignup = async (values) => {
    const { email, username, password } = values;

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      created_at = new Date();
      
      await firestore().collection('users').doc(userCredential.user.uid).set({
        username,
        email,
        created_at,
      });

      console.log('User account created & signed in!');
      navigateToHome();
    } catch(error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        alert('Email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        console.log('Email address is invalid!');
      }

      console.error(error);
    }
  };


  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Sign Up</Text>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={yup.object().shape({
          email: yup.string().email('Invalid email').required('Email is required'),
          username: yup.string().required('Username is required'),
          password: yup.string().required('Password is required'),
          confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        })}
        onSubmit={handleSignup}
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
              placeholder="Username"
              onChangeText={handleChange('username')}
              value={values.username}
            />
            <Text style={globalStyles.error}>{errors.username}</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            <Text style={globalStyles.error}>{errors.password}</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              value={values.confirmPassword}
            />
            <Text style={globalStyles.error}>{errors.confirmPassword}</Text>
            <Button
              title="Sign Up"
              onPress={handleSubmit}
              color={globalStyles.button.backgroundColor}
            />
          </>
        )}
      </Formik>
      <Text style={globalStyles.linkText}>
        Already have an account?{' '}
        <Text style={globalStyles.linkText} onPress={navigateToLogin}>
          Login
        </Text>
      </Text>
    </View>
  );
};

export default SignupScreen;