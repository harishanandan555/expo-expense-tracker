import React, { useState, useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite/next';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Landing from './screen/landing';
import SignInPage from './screen/auth/signin';
import DashboardScreen from './screen/components/dashboard';
import NewIncomeScreen from './screen/components/NewIncome';
import NewExpenseScreen from './screen/components/NewExpense';
import TransactionScreen from './screen/components/transaction';
import SettingScreen from './screen/components/Setting';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PhoneAuth from './screen/auth/phoneAuth';
import EmailAuth from './screen/auth/emailAuth';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  
 

  return (
  
        <NavigationContainer>

          {/* testing settingScreen */}
          {/* <Stack.Navigator initialRouteName="Settings">
            <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingScreen} />
          </Stack.Navigator> */}
          {/* testing settingScreen */}

          {/* main */}
          <Stack.Navigator initialRouteName="signin">
            <Stack.Screen name="landing" options={{ headerShown: false }} component={Landing} />
            <Stack.Screen name="signin" options={{ headerShown: false }} component={SignInPage} />
            <Stack.Screen name="main" options={{ headerShown: false }} component={MainTabNavigator} />
            <Stack.Screen
              name="NewIncome"
              options={{ headerShown: false }}
              component={NewIncomeScreen}
              initialParams={{ email: '' }} // Provide default value; updated in MainTabNavigator
            />
            <Stack.Screen name="NewExpense" options={{ headerShown: false }} component={NewExpenseScreen} />
            <Stack.Screen name="PhoneAuthentication" options={{ headerShown: false }} component={PhoneAuth} />
            <Stack.Screen name="EmailAuthentication" options={{ headerShown: false }} component={EmailAuth} />
          </Stack.Navigator>
          {/* main */}

        </NavigationContainer>
      
      
  );
}



function MainTabNavigator({ route }) {
  const email = route.params?.email;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Transactions') iconName = 'attach-money';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
        initialParams={{ email }} // Pass email to Dashboard
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{ headerShown: false }}
        initialParams={{ email }} // Pass email to Transactions
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
    paddingBottom: 10,
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  tabLabel: {
    color: '#fff',
    fontSize: 12,
  },
});
