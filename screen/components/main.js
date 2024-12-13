import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../themeContext';
import Header from './header';
import Footer from './footer';
import DashboardScreen from './dashboard';
import TransactionScreen from './transaction';
import SettingScreen from './Setting';

export default function MainScreen() {
  const { theme, toggleTheme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  // const [currentScreen, setCurrentScreen] = useState('Settings');

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen theme={theme} setCurrentScreen={setCurrentScreen}/>;
      case 'Transactions':
        return <TransactionScreen theme={theme} />;
      case 'Settings':
        return <SettingScreen theme={theme} />;
      default:
        return <DashboardScreen theme={theme} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Status Bar */}
      <StatusBar
        barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Header isDarkMode={theme.text === '#ffffff'} toggleTheme={toggleTheme} />
      </View>

      {/* Body Section */}
      <View style={styles.body}>{renderCurrentScreen()}</View>

      {/* Footer Section */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <Footer theme={theme} setCurrentScreen={setCurrentScreen} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // position:'absolute',
    top: 0,
    left: '10',
    right: 10,
    zIndex: 10,
    height: '10%',
  },
  body: {
    flex: 1,
    height: '80%',
  },
  footer: {
    height: '8%',
  },
});