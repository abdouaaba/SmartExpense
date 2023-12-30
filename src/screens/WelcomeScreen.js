// screens/WelcomeScreen.js

// import { globalStyles } from '../styles';
import React from 'react';
import { View, Text, StyleSheet, Button, ImageBackground } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate('Log In');
  };

  return (
    <ImageBackground
      source={require('./images/bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to{'\n'}Expense Tracker</Text>
        <Text style={styles.subtitle}>Track and manage your expenses effortlessly!</Text>
        <Button
          title="Get Started"
          onPress={navigateToLogin}
          color={styles.button.backgroundColor}
        />
      </View>
    </ImageBackground>
  );
};

export const colors = {
  primary: '#3498db', // Blue
  text: '#333',
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default WelcomeScreen;
