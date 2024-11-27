// import React, { useState, useEffect } from 'react';
// import { ActivityIndicator, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Landing from './screen/landing';
// import SignInPage from './screen/auth/signin';
// import DashboardScreen from './screen/components/dashboard';
// import NewIncomeScreen from './screen/components/NewIncome';
// import NewExpenseScreen from './screen/components/NewExpense';
// import TransactionScreen from './screen/components/transaction';
// import SettingScreen from './screen/components/Setting';
// import { StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import PhoneAuth from './screen/auth/phoneAuth';
// import EmailAuth from './screen/auth/emailAuth';

// // import ThemeProvider, { useTheme } from './context/ThemeContext';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     // <ThemeProvider>
//       <NavigationContainer>
//         {/* main */}
//         <Stack.Navigator initialRouteName="signin">

//           {/* <Stack.Screen name="landing" options={{ headerShown: false }} component={Landing} /> */}

//           <Stack.Screen name="signin" options={{ headerShown: false }} component={SignInPage} />
//           <Stack.Screen name="main" options={{ headerShown: false }} component={FooterNavigator} />

//           <Stack.Screen name="NewIncome" options={{ headerShown: false }} component={NewIncomeScreen} initialParams={{ email: '' }} /> 
//           <Stack.Screen name="NewExpense" options={{ headerShown: false }} component={NewExpenseScreen} />
//           <Stack.Screen name="PhoneAuthentication" options={{ headerShown: false }} component={PhoneAuth} />
//           <Stack.Screen name="EmailAuthentication" options={{ headerShown: false }} component={EmailAuth} />

//         </Stack.Navigator>
//         {/* main */}
//       </NavigationContainer>
//     // </ThemeProvider>
//   );
// }


// //Footer==============================================
// function FooterNavigator({ route }) {

//   const email = route.params?.email;

//   // const { isDarkMode } = useTheme();

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarStyle: styles.footer,
//         tabBarLabelStyle: styles.footerLabel,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === 'Dashboard') iconName = 'dashboard';
//           else if (route.name === 'Transactions') iconName = 'attach-money';
//           else if (route.name === 'Settings') iconName = 'settings';
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} initialParams={{ email }} />
//       <Tab.Screen name="Transactions" component={TransactionScreen} options={{ headerShown: false }} initialParams={{ email }} />
//       <Tab.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} initialParams={{ email }} />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   footer: {
//     backgroundColor: '#000', // Footer container background
//     borderTopWidth: 1, // Adds a top border to the footer
//     borderTopColor: '#ccc', // Light gray border color
//     height: 60, // Footer height
//     paddingBottom: 10, // Adds padding at the bottom
//   },
//   footerLabel: {
//     fontSize: 12, // Footer label font size
//   },
// });









import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './themeContext';
import SignInPage from './screen/auth/signin';
import MainScreen from './screen/components/main';
import NewIncomeScreen from './screen/components/NewIncome';
import NewExpenseScreen from './screen/components/NewExpense';
import PhoneAuth from './screen/auth/phoneAuth';
import EmailAuth from './screen/auth/emailAuth';


const Stack = createStackNavigator();

export default function App() {
  return (

    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          
          <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown: false }} />
          <Stack.Screen name="main" component={MainScreen} options={{ headerShown: false }} />

           <Stack.Screen name="NewIncome" options={{ headerShown: false }} component={NewIncomeScreen} initialParams={{ email: '' }} /> 
           <Stack.Screen name="NewExpense" options={{ headerShown: false }} component={NewExpenseScreen} />
           <Stack.Screen name="PhoneAuthentication" options={{ headerShown: false }} component={PhoneAuth} />
           <Stack.Screen name="EmailAuthentication" options={{ headerShown: false }} component={EmailAuth} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>

  );
}