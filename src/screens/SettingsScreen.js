// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [privacySetting, setPrivacySetting] = useState('Public');
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkModeEnabled(!isDarkModeEnabled);
  };
  const handleChangeLanguage = () => {

  };

  const ChangePassword = () => {

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

});

export default SettingsScreen;

