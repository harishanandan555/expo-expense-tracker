// App.js
import React from 'react';
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

import Constants from 'expo-constants';
console.log(Constants.manifest);


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="landing">
        <Stack.Screen name="landing" options={{ headerShown: false }} component={Landing} />
        <Stack.Screen name="signin" options={{ headerShown: false }} component={SignInPage} />
        <Stack.Screen name="main" options={{ headerShown: false }} component={MainTabNavigator} />
        {/* <Stack.Screen name="dashboard"   options={{ headerShown: false }} component={DashboardScreen} /> */}
        <Stack.Screen name="NewIncome" options={{ headerShown: false }} component={NewIncomeScreen}/>
        <Stack.Screen name="NewExpense"  options={{ headerShown: false }} component={NewExpenseScreen}/>
        <Stack.Screen name="PhoneAuthentication" options={{headerShown: false}} component={PhoneAuth}/>
        <Stack.Screen name="EmailAuthentication" options={{headerShown: false}} component={EmailAuth}/>
        {/* <Stack.Screen name="Transaction" option={{headerShown: false }} component={TransactionScreen}/>  */}
        {/* <Stack.Screen name="Setting" option={{headerShown: false }} component={SettingScreen}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// const ScreenContainer = ({ children }) => (
//   <View style={styles.screenContainer}>{children}</View>
// );

function MainTabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Determine which icon to show based on the route name
          if (route.name === 'Dashboard') {
            iconName = 'dashboard'; // Material icon name for Dashboard
          } else if (route.name === 'Transactions') {
            iconName = 'attach-money'; // Material icon name for Transactions
          } else if (route.name === 'Settings') {
            iconName = 'settings'; // Material icon name for Settings
          }

          // Return the icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Transactions" component={TransactionScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />
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
  // screenContainer: {
  //   flex: 1,
  //   backgroundColor: '#000', 
  // },
});
