import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { ThemeProvider } from './themeContext';
import SignInPage from './screen/auth/signin';
import MainScreen from './screen/components/main';
import NewIncomeScreen from './screen/components/NewIncome';
import NewExpenseScreen from './screen/components/NewExpense';
import PhoneAuth from './screen/auth/phoneAuth';
import EmailAuth from './screen/auth/emailAuth';
import { auth, db } from './config/firebaseConfig';
import TransactionHistoryModal from './screen/components/TransactionHistory';
import EditTransactionModal from './screen/components/EditTransaction';

const Stack = createStackNavigator();

export default function App() {

	console.log("Firebase Auth initialized:", auth ? "Success" : "Failed");
	console.log("Firestore DB initialized:", db ? "Success" : "Failed");

	return (
		<ThemeProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="SignIn">
					{/* <Stack.Navigator initialRouteName="Main"> */}
					<Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown: false }} />
					<Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
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