import React, { useEffect, useState } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { ThemeProvider } from './themeContext';
import SignInPage from './screen/auth/signin';
import MainScreen from './screen/components/main';
import NewIncomeScreen from './screen/components/NewIncome';
import NewExpenseScreen from './screen/components/NewExpense';
import PhoneAuth from './screen/auth/phoneAuth';
import EmailAuth from './screen/auth/emailAuth';
import TransactionHistoryModal from './screen/components/TransactionHistory';
import EditTransactionModal from './screen/components/EditTransaction';
import { auth } from './config/firebaseConfig';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null); // Declare a state for userId

	

	
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check if userToken exists in AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');

        // Ensure token is valid and has not expired (6 months expiration)
        const expirationTime = new Date(tokenExpiration);
        const currentTime = new Date();

        // If token is valid and the expiration time is within the valid period (6 months)
        if (userToken && expirationTime > currentTime) {
          console.log('Valid session found. Redirecting to Main.');

          // Retrieve user info from AsyncStorage
          const userInfo = await AsyncStorage.getItem('userData');
          const parsedUserInfo = JSON.parse(userInfo);
          setUserInfo(parsedUserInfo); // Set userInfo to state

          // Get userId from Firebase Authentication
          const currentUserId = auth.currentUser?.uid;
          setUserId(currentUserId); // Set userId to state

          setInitialRoute('Main');
        } else {
          console.log('No valid session found. Redirecting to SignIn.');
          // Clear any expired session data
          await AsyncStorage.clear();
          setInitialRoute('SignIn');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setInitialRoute('SignIn');
      }
    };

    checkLoginStatus();
  }, []);

  const refreshToken = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const tokenResult = await user.getIdTokenResult(true); // Force token refresh
        const { token, expirationTime } = tokenResult;

        // Save refreshed token and expiration in AsyncStorage (6 months expiration)
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('tokenExpiration', new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toString()); // 6 months expiration

        console.log('Token refreshed successfully.');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  useEffect(() => {
    // Refresh token periodically (every 1 hour)
    const intervalId = setInterval(refreshToken, 60 * 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (!initialRoute) {
    // Render a splash/loading screen until we determine the initial route
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown: false }} />
          <Stack.Screen 
            name="Main" 
            component={MainScreen} 
            options={{ headerShown: false }} 
            initialParams={{ userId }} // Passing the userId to MainScreen
          />
          <Stack.Screen name="NewIncome" options={{ headerShown: false }} component={NewIncomeScreen} />
          <Stack.Screen name="NewExpense" options={{ headerShown: false }} component={NewExpenseScreen} />
          <Stack.Screen name="PhoneAuthentication" options={{ headerShown: false }} component={PhoneAuth} />
          <Stack.Screen name="EmailAuthentication" options={{ headerShown: false }} component={EmailAuth} />
          <Stack.Screen name="TransactionHistory" options={{ headerShown: false }} component={TransactionHistoryModal} />
          <Stack.Screen name="EditTransaction" options={{ headerShown: false }} component={EditTransactionModal} />
        </Stack.Navigator>
        <Toast
          position="top"
          topOffset={20}
          visibilityTime={4000}
          style={{
            zIndex: 9999,
            elevation: 10,
          }}
        />
      </NavigationContainer>
    </ThemeProvider>
  );
}
