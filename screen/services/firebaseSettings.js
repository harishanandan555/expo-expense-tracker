import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc
} from 'firebase/firestore';

export async function storeTransaction(transaction) {
  const transactionCollection = collection(db, 'Transaction');
  try {
    const docRef = await addDoc(transactionCollection, {
      ...transaction,
      createdAt: transaction.createdAt || new Date(),
      updatedAt: transaction.updatedAt || new Date(),
    });
    console.log('Transaction document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding transaction: ', e);
    throw new Error(`Error storing transaction: ${e}`);
  }
}

export async function getFirestoreTransactionById(transactionId) {
  const docRef = doc(db, 'Transaction', transactionId);
  const transaction = await getDoc(docRef);
  if (transaction.exists()) {
    return transaction.data();
  }
  return null;
}

export async function getTransactionsByUserIdAndDate(userId, from, to) {
  const transactionCollection = collection(db, 'Transaction');
  const q = query(
    transactionCollection,
    where("userId", "==", userId),
    where("date", ">=", from),
    where("date", "<=", to),
    orderBy("date", "desc")
  );

  const querySnapshot = await getDocs(q);
  const transactions = [];
  querySnapshot.forEach((doc) => {
    transactions.push({ id: doc.id, ...doc.data() });
  });

  return transactions;
}

export async function deleteFirestoreTransaction(transactionId) {
  const docRef = doc(db, 'Transaction', transactionId);
  try {
    await deleteDoc(docRef);
    console.log('Transaction deleted with ID: ', transactionId);
  } catch (e) {
    console.error('Error deleting transaction: ', e);
    throw new Error(`Error deleting transaction: ${e}`);
  }
}

export async function storeStripeCustomer(customer) {
  const customerCollection = collection(db, 'StripeCustomer');
  try {
    const docRef = await addDoc(customerCollection, {
      ...customer,
      createdAt: customer.createdAt || new Date(),
      updatedAt: customer.updatedAt || new Date(),
    });
    console.log('Stripe Customer document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error(`Error storing Stripe customer: ${e}`);
  }
}

export async function getStripeCustomerByUserId(userId) {
  const customerCollection = collection(db, 'StripeCustomer');
  const q = query(customerCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  return null;
}

export async function storeSettings(settings) {
  const settingsCollection = collection(db, 'Settings');
  try {
    await addDoc(settingsCollection, {
      ...settings,
      createdAt: settings.createdAt || new Date(),
      updatedAt: settings.updatedAt || new Date(),
    });
    console.log('Settings document successfully written.');
  } catch (e) {
    console.error('Error adding settings document: ', e);
  }
}

export async function getSettingsByUserId(userId) {
  const settingsCollection = collection(db, "Settings");
  const q = query(settingsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      currency: data.currency,
      userId: data.userId,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  }

  return null;
}

export async function updateUserCurrency(userId, currency) {
  const settingsCollection = collection(db, 'Settings');
  const settingsQuery = query(settingsCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(settingsQuery);

  if (!querySnapshot.empty) {
    const docRef = doc(db, 'Settings', querySnapshot.docs[0].id);
    await updateDoc(docRef, { currency, updatedAt: new Date() });
    
    return { id: docRef.id, userId, currency, updatedAt: new Date() };
  }

  return null;
}

export async function storeUser(user) {
  const userCollection = collection(db, 'User');
  try {
    await addDoc(userCollection, user);
    console.log('User document written with ID: ', user.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}