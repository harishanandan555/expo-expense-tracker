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
  updateDoc,
  setDoc
} from 'firebase/firestore';
import cuid from 'cuid';




//======================================================================
// Firestore adapter to handle NextAuth.js operations
// export function FirestoreAdapter() {

//   return {

//     // Create a new user
//     createUser: async (data) => {
//       const userId = cuid();
//       const userRef = doc(db, 'User', userId);
//       await setDoc(userRef, {
//         ...data,
//         id: userId,
//         createdAt: new Date(),
//       });
//       const userDoc = await getDoc(userRef);
//       return { id: userId, ...userDoc.data() };
//     },

//     // Get a user by ID
//     getUser: async (id) => {
//       const userRef = doc(db, 'User', id);
//       const userDoc = await getDoc(userRef);
//       return userDoc.exists() ? { id, ...userDoc.data() } : null;
//     },

//     // Get a user by email
//     getUserByEmail: async (email) => {
//       const usersRef = collection(db, 'User');
//       const userQuery = query(usersRef, where('email', '==', email));
//       const userSnapshot = await getDocs(userQuery);
//       if (!userSnapshot.empty) {
//         const userDoc = userSnapshot.docs[0];
//         return { id: userDoc.id, ...userDoc.data() };
//       }
//       return null;
//     },

//     // Link a user account to an OAuth provider
//     linkAccount: async (data) => {
//       const accountRef = doc(db, 'Account', cuid());
//       await setDoc(accountRef, data);
//       const accountDoc = await getDoc(accountRef);
//       return { id: accountDoc.id, ...accountDoc.data() };
//     },

//     // Get a user by provider account ID
//     getUserByAccount: async ({ providerAccountId, provider }) => {
//       const accountsRef = collection(db, 'Account');
//       const accountQuery = query(
//         accountsRef,
//         where('providerAccountId', '==', providerAccountId),
//         where('provider', '==', provider)
//       );
//       const accountSnapshot = await getDocs(accountQuery);
//       if (!accountSnapshot.empty) {
//         const accountDoc = accountSnapshot.docs[0];
//         const userRef = doc(db, 'User', accountDoc.data().userId);
//         const userDoc = await getDoc(userRef);
//         return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
//       }
//       return null;
//     },

//     // Update user data
//     updateUser: async (data) => {
//       const userRef = doc(db, 'User', data.id);
//       await setDoc(userRef, data, { merge: true });
//       const updatedUserDoc = await getDoc(userRef);
//       return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
//     },

//     // Delete a user
//     deleteUser: async (id) => {
//       const userRef = doc(db, 'User', id);
//       await deleteDoc(userRef);
//       return { id };
//     },

//     // Create a session
//     createSession: async (data) => {
//       const sessionId = cuid();
//       const sessionRef = doc(db, 'Session', sessionId);
//       await setDoc(sessionRef, { ...data, sessionToken: sessionId });
//       const sessionDoc = await getDoc(sessionRef);
//       return { id: sessionId, ...sessionDoc.data() };
//     },

//     // Get session and user by session token
//     getSessionAndUser: async (sessionToken) => {
//       const sessionsRef = collection(db, 'Session');
//       const sessionQuery = query(sessionsRef, where('sessionToken', '==', sessionToken));
//       const sessionSnapshot = await getDocs(sessionQuery);
//       if (!sessionSnapshot.empty) {
//         const sessionDoc = sessionSnapshot.docs[0];
//         const sessionData = sessionDoc.data();
//         const userRef = doc(db, 'User', sessionData.userId);
//         const userDoc = await getDoc(userRef);
//         return {
//           session: { id: sessionDoc.id, ...sessionData },
//           user: { id: userDoc.id, ...userDoc.data() },
//         };
//       }
//       return null;
//     },

//     // Delete a session
//     deleteSession: async (sessionToken) => {
//       const sessionsRef = collection(db, 'Session');
//       const sessionQuery = query(sessionsRef, where('sessionToken', '==', sessionToken));
//       const sessionSnapshot = await getDocs(sessionQuery);
//       if (!sessionSnapshot.empty) {
//         const sessionDoc = sessionSnapshot.docs[0];
//         await deleteDoc(sessionDoc.ref);
//       }
//     },

//     // Create a verification token
//     createVerificationToken: async (data) => {
//       const verificationRef = doc(db, 'VerificationToken', cuid());
//       await setDoc(verificationRef, data);
//       const verificationDoc = await getDoc(verificationRef);
//       return { id: verificationDoc.id, ...verificationDoc.data() };
//     },

//     // Use a verification token
//     useVerificationToken: async ({ identifier, token }) => {
//       const verificationsRef = collection(db, 'VerificationToken');
//       const verificationQuery = query(
//         verificationsRef,
//         where('identifier', '==', identifier),
//         where('token', '==', token)
//       );
//       const verificationSnapshot = await getDocs(verificationQuery);
//       if (!verificationSnapshot.empty) {
//         const verificationDoc = verificationSnapshot.docs[0];
//         await deleteDoc(verificationDoc.ref);
//         return verificationDoc.data();
//       }
//       return null;
//     },
//   };
// }
//======================================================================

// // Store User
// export async function addUser(user) {
//   const userId = cuid();
//   const userRef = doc(db, 'User', userId);

//   try {
//     await setDoc(userRef, {
//       ...user,
//       id: userId,
//       createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
//       updatedAt: new Date(),
//     });
//     return { userId };
//   } catch (error) {
//     console.error('Error adding user:', error);
//     throw new Error(`Error storing user: ${error}`);
//   }
// }

// // Get User by ID
// export async function getUserById(id) {
//   const userRef = doc(db, 'User', id);
//   const userDoc = await getDoc(userRef);
//   return userDoc.exists() ? { id, ...userDoc.data() } : null;
// }

// // Get User by Email
// export async function getUserByEmail(email) {
//   const usersRef = collection(db, 'User');
//   const userQuery = query(usersRef, where('email', '==', email));
//   const userSnapshot = await getDocs(userQuery);

//   if (!userSnapshot.empty) {
//     const userDoc = userSnapshot.docs[0];
//     return { id: userDoc.id, ...userDoc.data() };
//   }
//   return null;
// }

// // Update User
// export async function updateUser(data) {
//   const userRef = doc(db, 'User', data.id);

//   try {
//     await setDoc(userRef, data, { merge: true });
//     const updatedUserDoc = await getDoc(userRef);
//     return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
//   } catch (error) {
//     console.error('Error updating user:', error);
//     throw new Error(`Error updating user: ${error}`);
//   }
// }

// // Delete User
// export async function deleteUser(id) {
//   const userRef = doc(db, 'User', id);

//   try {
//     await deleteDoc(userRef);
//     return { id };
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     throw new Error(`Error deleting user: ${error}`);
//   }
// }



// Link Account to User
export async function linkUserAccount(data) {
  const accountRef = doc(db, 'Account', cuid());

  try {
    await setDoc(accountRef, data);
    const accountDoc = await getDoc(accountRef);
    return { id: accountDoc.id, ...accountDoc.data() };
  } catch (error) {
    console.error('Error linking account:', error);
    throw new Error(`Error linking account: ${error}`);
  }
}

// Get User by Provider Account
export async function getUserByProviderAccount({ providerAccountId, provider }) {
  const accountsRef = collection(db, 'Account');
  const accountQuery = query(
    accountsRef,
    where('providerAccountId', '==', providerAccountId),
    where('provider', '==', provider)
  );
  const accountSnapshot = await getDocs(accountQuery);

  if (!accountSnapshot.empty) {
    const accountDoc = accountSnapshot.docs[0];
    const userRef = doc(db, 'User', accountDoc.data().userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
  }
  return null;
}


// Create Session
export async function createSession(data) {
  const sessionId = cuid();
  const sessionRef = doc(db, 'Session', sessionId);

  try {
    await setDoc(sessionRef, { ...data, sessionToken: sessionId });
    const sessionDoc = await getDoc(sessionRef);
    return { id: sessionId, ...sessionDoc.data() };
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error(`Error creating session: ${error}`);
  }
}

// Get Session and User by Token
export async function getSessionAndUserByToken(sessionToken) {
  const sessionsRef = collection(db, 'Session');
  const sessionQuery = query(sessionsRef, where('sessionToken', '==', sessionToken));
  const sessionSnapshot = await getDocs(sessionQuery);

  if (!sessionSnapshot.empty) {
    const sessionDoc = sessionSnapshot.docs[0];
    const sessionData = sessionDoc.data();
    const userRef = doc(db, 'User', sessionData.userId);
    const userDoc = await getDoc(userRef);
    return {
      session: { id: sessionDoc.id, ...sessionData },
      user: { id: userDoc.id, ...userDoc.data() },
    };
  }
  return null;
}

// Delete Session
export async function deleteSession(sessionToken) {
  const sessionsRef = collection(db, 'Session');
  const sessionQuery = query(sessionsRef, where('sessionToken', '==', sessionToken));
  const sessionSnapshot = await getDocs(sessionQuery);

  if (!sessionSnapshot.empty) {
    const sessionDoc = sessionSnapshot.docs[0];
    await deleteDoc(sessionDoc.ref);
  }
}

// Create Verification Token
export async function createVerificationToken(data) {
  const verificationRef = doc(db, 'VerificationToken', cuid());

  try {
    await setDoc(verificationRef, data);
    const verificationDoc = await getDoc(verificationRef);
    return { id: verificationDoc.id, ...verificationDoc.data() };
  } catch (error) {
    console.error('Error creating verification token:', error);
    throw new Error(`Error creating verification token: ${error}`);
  }
}

// Use Verification Token
export async function useVerificationToken({ identifier, token }) {
  const verificationsRef = collection(db, 'VerificationToken');
  const verificationQuery = query(
    verificationsRef,
    where('identifier', '==', identifier),
    where('token', '==', token)
  );
  const verificationSnapshot = await getDocs(verificationQuery);

  if (!verificationSnapshot.empty) {
    const verificationDoc = verificationSnapshot.docs[0];
    await deleteDoc(verificationDoc.ref);
    return verificationDoc.data();
  }
  return null;
}

//======================================================================

export async function storeUser(user) {
  // const Id = cuid();
  // const Doc = doc(db, 'User', Id);

  try {

    await setDoc( doc(db, "User", user.id), {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL
    }).then((response) => {
        console.log('User data saved in Firestore');
    })
    .catch((error) => {
      console.error('Error saving user data in Firestore:', error.message);
    });

    // await setDoc( Doc, {
    //   name: user.name,
    //   email: user.email,
    //   emailVerified: new Date(),
    //   image: user.photo || '',
    //   transactionsAttempts: user.transactionsAttempts || 0,
    //   categoriesAttempts: user.categoriesAttempts || 0,
    //   createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    //   updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
    // });
    // return { userId: Id };

  } catch (e) {
    console.error('Error adding user: ', e);
    throw new Error(`Error storing user: ${e}`);
  }
}

// Function to get a user by their ID
export async function getUserById(userId) {
  const Doc = doc(db, 'User', userId);
  
  try {
    const docSnapshot = await getDoc(Doc);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error('User not found');
    }
  } catch (e) {
    console.error('Error getting user by ID: ', e);
    throw new Error(`Error retrieving user: ${e}`);
  }
}

// Function to get a user by their email
export async function fetchUserByEmail(email) {
  const q = query(collection(db, 'User'), where('email', '==', email));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      throw new Error('User not found');
    }
  } catch (e) {
    console.error('Error getting user by email: ', e);
    throw new Error(`Error retrieving user: ${e}`);
  }
}

// Function to update a user's information
export async function updateUser(userId, updatedData) {
  const Doc = doc(db, 'User', userId);

  try {
    await updateDoc(Doc, {
      ...updatedData,
      updatedAt: new Date(), // ensure updatedAt is always updated
    });
    return { message: 'User updated successfully' };
  } catch (e) {
    console.error('Error updating user: ', e);
    throw new Error(`Error updating user: ${e}`);
  }
}

// Function to delete a user by their ID
export async function deleteUser(userId) {
  const Doc = doc(db, 'User', userId);

  try {
    await deleteDoc(Doc);
    return { message: 'User deleted successfully' };
  } catch (e) {
    console.error('Error deleting user: ', e);
    throw new Error(`Error deleting user: ${e}`);
  }
}


export async function storeAccount(userId, account) {
  const Id = cuid();
  const Doc = doc(db, 'Account', Id);

  try {
    await setDoc(Doc, {
      userId: userId,
      type : 'oauth',
      provider: 'google',
      providerAccountId : account.user.id || '',
      refresh_token : account.refresh_token || '',
      access_token : account.access_token || '',
      expires_at  : account.expires_at || 0,
      token_type : account.token_type || '',
      scope  : account.scopes || '',
      id_token  : account.id_token || '',
      session_state  : account.session_state || '',
      createdAt: account.createdAt ? new Date(account.createdAt) : new Date(),
      updatedAt: account.updatedAt ? new Date(account.updatedAt) : new Date(),
    });
  } catch (e) {
    console.error('Error adding user: ', e);
    throw new Error(`Error storing user: ${e}`);
  }
}


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

