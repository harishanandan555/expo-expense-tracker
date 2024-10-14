// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './screen/landing';
import SignInPage from './screen/auth/signin'; // Dashboard screen
import DashboardScreen from './screen/components/dashboard';
import NewIncomeScreen from './screen/components/NewIncome';
import NewExpenseScreen from './screen/components/NewExpense';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="landing">
        <Stack.Screen name="signin"  options={{ headerShown: false }} component={SignInPage} />
        <Stack.Screen name="landing"  options={{ headerShown: false }} component={Landing} />
        <Stack.Screen name="dashboard"   options={{ headerShown: false }} component={DashboardScreen} />
        <Stack.Screen name ="NewIncome" options={{ headerShown: false }} component={NewIncomeScreen}/>
        <Stack.Screen name ="NewExpense"  options={{ headerShown: false }} component={NewExpenseScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
