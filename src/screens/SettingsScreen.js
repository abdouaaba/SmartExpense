// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Switch, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';

const SettingsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [privacySetting, setPrivacySetting] = useState('Public');
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleToggleDarkMode = () => {
    setIsDarkModeEnabled(!isDarkModeEnabled);
  };
  const handleChangeLanguage = () => {

  };

  const savePassword = async (values) => {
    try {
      const { currentPassword, newPassword } = values;
      const user = auth().currentUser;

      // Reauthenticate the user before changing the password
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);

      // Change the user's password
      await user.updatePassword(newPassword);

      toggleModal();
      console.log('Password saved successfully');
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const ChangePassword = () => {
    setModalContent(
      <View>
        <Formik
          initialValues={{ currentPassword: '', newPassword: '' }}
          validationSchema={yup.object().shape({
            currentPassword: yup.string().required('Current password is required'),
            newPassword: yup.string().required('New password is required'),
          })}
          onSubmit={savePassword}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <Text style={styles.text}>Enter Current Password:</Text>
              <TextInput
                style={styles.text}
                value={values.currentPassword}
                onChangeText={handleChange('currentPassword')}
                secureTextEntry
                placeholder="Current Password"
                placeholderTextColor={'#a1a7aa'}
              />
              <Text style={styles.error}>{errors.currentPassword}</Text>

              <Text style={styles.text}>Enter New Password:</Text>
              <TextInput
                style={styles.text}
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                secureTextEntry
                placeholder="New Password"
                placeholderTextColor={'#a1a7aa'}
              />
              <Text style={styles.error}>{errors.newPassword}</Text>
              <Button title="Save" onPress={handleSubmit} />
              
            </>
          )}
          
        </Formik>
        
      </View>
    );
    toggleModal();
  };

  const UpdateProfile = () => {

  };

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleChangePrivacySetting = () => {

  };

  const handleToggleTwoFactorAuth = () => {
    setIsTwoFactorAuthEnabled(!isTwoFactorAuthEnabled);
  };

  const handleClearLocalData = () => {

  };

  const handleDataSyncSettings = () => {

  };


  return (
    <View style={styles.container}>

      {/* User Account Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>User Account Settings</Text>
        <TouchableOpacity style={styles.Button} onPress={UpdateProfile}>
              <Text style={styles.ButtonText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.Button} onPress={ChangePassword}>
              <Text style={styles.ButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* App Preferences */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>App Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text>Dark Mode</Text>
          <Switch value={isDarkModeEnabled} onValueChange={handleToggleDarkMode} />
        </View>

        <TouchableOpacity style={styles.Button} onPress={handleChangeLanguage}>
              <Text style={styles.ButtonText}>Change Language</Text>
        </TouchableOpacity>

        <View style={styles.preferenceItem}>
          <Text>Notifications</Text>
          <Switch value={isNotificationsEnabled} onValueChange={handleToggleNotifications} />
        </View>
      </View>

      {/* Privacy and Security */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>Privacy and Security</Text>
        <TouchableOpacity style={styles.Button} onPress={handleChangePrivacySetting}>
              <Text style={styles.ButtonText}>Privacy Settings</Text>
        </TouchableOpacity>

        <View style={styles.preferenceItem}>
          <Text>Two-factor Authentication</Text>
          <Switch value={isTwoFactorAuthEnabled} onValueChange={handleToggleTwoFactorAuth} />
        </View>

      </View>

      {/* Data Management */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>Data Management</Text>
        <TouchableOpacity style={styles.Button} onPress={handleClearLocalData}>
              <Text style={styles.ButtonText}>Clear Local Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.Button} onPress={handleDataSyncSettings}>
              <Text style={styles.ButtonText}>Data Sync Settings</Text>
        </TouchableOpacity>

      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>{modalContent}</View>
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  text: {
    fontSize: 16,
    color: 'black',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },

  Button:{
    backgroundColor: '#3498db',
    padding: 8,
    marginTop: 5,
    height: 40,
  },
  ButtonText:{
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default SettingsScreen;

