
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
    


const firebaseConfig = {
    apiKey: "AIzaSyCvjrEtBCHSWP9OUhR-LEjbUfpjba292bA",
    authDomain: "expenseapp-cdcfe.firebaseapp.com",
    projectId: "expenseapp-cdcfe",
    storageBucket: "expenseapp-cdcfe.appspot.com",
    messagingSenderId: "622095554406",
    appId: "1:622095554406:web:9f649374024f5f907d9aa7",
    measurementId: "G-GVV2HS4M08"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };












// firebaseConfig.js
// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence} from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; 
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//     apiKey: "AIzaSyCvjrEtBCHSWP9OUhR-LEjbUfpjba292bA",
//     authDomain: "expenseapp-cdcfe.firebaseapp.com",
//     projectId: "expenseapp-cdcfe",
//     storageBucket: "expenseapp-cdcfe.appspot.com",
//     messagingSenderId: "622095554406",
//     appId: "1:622095554406:web:9f649374024f5f907d9aa7",
//     measurementId: "G-GVV2HS4M08"
// };

// const app = initializeApp(firebaseConfig);

// // Initialize Auth with persistence
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
// });

// // Initialize Firestore
// const db = getFirestore(app);

// export { auth, db };