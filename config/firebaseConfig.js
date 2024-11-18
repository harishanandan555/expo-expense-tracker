// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
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


// import cuid from "cuid";
// // DefaultCategories insertion for Income categories
// async function insertIncomeCategories() {
// const incomeCategories = [
//     { name: "Salary", icon: "💼", type: "income" },
//     { name: "Gifts", icon: "🎁", type: "income" },
//     { name: "Education Grants", icon: "🎓", type: "income" },
//     { name: "Bonus", icon: "💰", type: "income" },
//     { name: "Commission", icon: "🧾", type: "income" },
//     { name: "Investment Income", icon: "📈", type: "income" },
//     { name: "Rental Income", icon: "🏠", type: "income" },
//     { name: "Freelance Income", icon: "💵", type: "income" },
//     { name: "Tax Refund", icon: "💸", type: "income" },
//     { name: "Gambling Winnings", icon: "🎲", type: "income" },
//     { name: "Interest Income", icon: "🪙", type: "income" },
//     { name: "Selling Income", icon: "💹", type: "income" },
//     { name: "Tips", icon: "💳", type: "income" },
//     { name: "Side Job", icon: "🛠️", type: "income" },
//     { name: "Other Income", icon: "💲", type: "income" },
// ];

// try {
//     for (const category of incomeCategories) {
//     const sanitizedName = category.name.replace(/[\/\.\#\[\]]/g, '_');
//     const categoryRef = doc(db, "DefaultCategories", sanitizedName);
//     // Add a unique 'id' field using cuid()
//     category.id = cuid();
//     await setDoc(categoryRef, category);
//     }
//     console.log("Income categories inserted successfully.");
// } catch (error) {
//     console.error("Error inserting categories:", error);
// }
// }

// insertIncomeCategories();

// // DefaultCategories insertion for Expense categories
// async function insertExpenseCategories() {
// const expenseCategories = [
//     { name: "Auto & Transport", icon: "🚗", type: "expense" },
//     { name: "Bills & Utilities", icon: "💡", type: "expense" },
//     { name: "Charity", icon: "💛", type: "expense" },
//     { name: "Clothing & Accessories", icon: "👗", type: "expense" },
//     { name: "Dining & Restaurants", icon: "🍽️", type: "expense" },
//     { name: "Education", icon: "📚", type: "expense" },
//     { name: "Entertainment", icon: "🎮", type: "expense" },
//     { name: "Fees & Charges", icon: "🏦", type: "expense" },
//     { name: "Food & Groceries", icon: "🥑", type: "expense" },
//     { name: "Health & Fitness", icon: "🏥", type: "expense" },
//     { name: "Home Improvement", icon: "🛠️", type: "expense" },
//     { name: "Household Supplies", icon: "🧴", type: "expense" },
//     { name: "Insurance", icon: "🛡️", type: "expense" },
//     { name: "Loans", icon: "💳", type: "expense" },
//     { name: "Miscellaneous", icon: "🎉", type: "expense" },
//     { name: "Personal Care", icon: "🧖", type: "expense" },
//     { name: "Pet Care", icon: "🐾", type: "expense" },
//     { name: "Rent/Mortgage", icon: "🏠", type: "expense" },
//     { name: "Shopping", icon: "🛍️", type: "expense" },
//     { name: "Subscriptions", icon: "📺", type: "expense" },
//     { name: "Taxes", icon: "🧾", type: "expense" },
//     { name: "Travel", icon: "✈️", type: "expense" },
//     { name: "Utilities", icon: "🔌", type: "expense" },
//     { name: "Other Expenses", icon: "💲", type: "expense" },
// ];

// try {
//     for (const category of expenseCategories) {
//     const sanitizedName = category.name.replace(/[\/\.\#\[\]]/g, '_');
//     const categoryRef = doc(db, "DefaultCategories", sanitizedName);
//     // Add a unique 'id' field using cuid()
//     category.id = cuid();
//     await setDoc(categoryRef, category);
//     }
//     console.log("Expense categories inserted successfully.");
// } catch (error) {
//     console.error("Error inserting categories:", error);
// }
// }

// insertExpenseCategories();