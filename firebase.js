import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase Config object
const firebaseConfig = {
  apiKey: "AIzaSyBha6mMtoCvncZRSF8gRN9A8IEUQn9q01U",
  authDomain: "expense-tracker-9e7fe.firebaseapp.com",
  projectId: "expense-tracker-9e7fe",
  storageBucket: "expense-tracker-9e7fe.appspot.com",
  messagingSenderId: "421563005646",
  appId: "1:421563005646:android:00e4dc18e6555951562e9f",
};

// Initialize Firebase app
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the already-initialized app
}

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
