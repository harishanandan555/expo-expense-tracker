import React, { useState, useEffect } from 'react'; 
import { SQLiteProvider } from 'expo-sqlite/next';
import { ActivityIndicator, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Landing from './screen/landing';
import SignInPage from './screen/auth/signin';
import DashboardScreen from './screen/components/dashboard';
import NewIncomeScreen from './screen/components/NewIncome';
import NewExpenseScreen from './screen/components/NewExpense';

const loadDatabase = async () => {
  const dbName = 'myExpenseDB.db';
  const dbAsset = require("./assets/myExpenseDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

const Stack = createStackNavigator();

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading Database...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <React.Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text>Loading Database...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName="myExpenseDB.db" useSuspense>
          <Stack.Navigator initialRouteName="landing">
            <Stack.Screen name="signin" options={{ headerShown: false }} component={SignInPage} />
            <Stack.Screen name="landing" options={{ headerShown: false }} component={Landing} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} component={DashboardScreen} />
            <Stack.Screen name="NewIncome" options={{ headerShown: false }} component={NewIncomeScreen} />
            <Stack.Screen name="NewExpense" options={{ headerShown: false }} component={NewExpenseScreen} />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
  );
}
