import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);
console.log("Firebase connection initialized.");

export { db };