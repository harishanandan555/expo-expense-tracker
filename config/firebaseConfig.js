import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

let auth, db;

try {
    const firebaseConfig = {
        apiKey: "AIzaSyCvjrEtBCHSWP9OUhR-LEjbUfpjba292bA",
        authDomain: "expenseapp-cdcfe.firebaseapp.com",
        projectId: "expenseapp-cdcfe",
        storageBucket: "expenseapp-cdcfe.appspot.com",
        messagingSenderId: "622095554406",
        appId: "1:622095554406:web:9f649374024f5f907d9aa7",
        measurementId: "G-GVV2HS4M08",
    };

    const app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully:", app);

    if (Platform.OS === 'web') {
        auth = getAuth(app);
    } else {
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }

    db = getFirestore(app);

    console.log("Firebase Auth:", auth);
    console.log("Firestore DB:", db);

} catch (error) {
    console.error("Error initializing Firebase/Firestore:", error);
}

export { auth, db };