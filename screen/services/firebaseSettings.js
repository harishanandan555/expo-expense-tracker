import cuid from "cuid";
import { collection, getDocs, query, where, doc, getFirestore, setDoc, getDoc, addDoc, deleteDoc, orderBy, updateDoc } from "firebase/firestore";

import { db } from "../../config/firebaseConfig";

//User--------------------------------------------------------------------------------------------------------------
export async function storeUser(user) {
  try {
    await setDoc( doc(db, "users", user.id), {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      // phoneNumber: user.phoneNumber ?? null,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL
    }).then((response) => {
        console.log('User data saved in Firestore');
    })
    .catch((error) => {
      console.error('Error saving user data in Firestore:', error.message);
    });
  } catch (e) {
    console.error('Error adding user: ', e);
    throw new Error(`Error storing user: ${e}`);
  }
}

export async function getUserById(id) {
  if (!id) {
    throw new Error('User ID is required.');
  }

  const userDoc = doc(db, 'users', id);  // Reference to the document in 'users' collection by userId
  
  try {
    const docSnapshot = await getDoc(userDoc); // Get the document snapshot

    if (docSnapshot.exists()) {
      return docSnapshot.data(); // Return the user data if it exists
    } else {
      throw new Error('User not found');
    }
  } catch (e) {
    console.error('Error getting user by ID: ', e);
    throw new Error(`Error retrieving user: ${e.message || e}`);
  }
}

export async function getUserByEmail(email) {
  const q = query(collection(db, 'users'), where('email', '==', email));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Return the first matched document's data
      return querySnapshot.docs[0].data();
    } else {
      console.log('No user found with this email');
      return null;  // Return null instead of throwing an error
    }
  } catch (e) {
    console.error('Error getting user by email: ', e);
    throw new Error(`Error retrieving user by email: ${e.message}`);
  }
}

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

//Transaction--------------------------------------------------------------------------------------------------------
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

//StripeCustomer------------------------------------------------------------------------------------------------------
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

//Settings------------------------------------------------------------------------------------------------------------
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

export async function updateSettingCurrencyUser(userId, currency) {
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

//DefaultCategory------------------------------------------------------------------------------------------------------
export async function getDefaultCategories(type) {
  if (!type) {
    console.error('Error: Type is undefined or null');
    throw new Error('Type is required to fetch DefaultCategories data.');
  }

  try {
    const collectionRef = collection(db, 'DefaultCategories');
    const queryRef = query(
      collectionRef,
      where('type', '==', type), // Filter by type
      // orderBy('name', 'asc')    // Order categories by name
    );
    const querySnapshot = await getDocs(queryRef);
    const categories = querySnapshot.docs.map(doc => ({
      ...doc.data(),
    }));

    return categories;
  } catch (error) {
    console.error('Error fetching DefaultCategory data:', error);
    throw new Error(`Error retrieving DefaultCategory data: ${error.message}`);
  }
}

//Category-------------------------------------------------------------------------------------------------------------
export async function storeUserCategories(userId, data) {
  try {
    if (!userId) {
      throw new Error("User ID is missing.");
    }
    if (!data || !data.name || !data.icon) {
      throw new Error("Category name or icon is missing.");
    }

    // Generate a unique ID for the category
    const id = cuid();

    // Store the category in Firestore
    await setDoc(doc(db, "UserCategories", id), {
      id, // Assign the generated unique ID
      userId, // Associate the category with the user ID
      name: data.name,
      icon: data.icon,
      type: data.type,
      createdAt: new Date().toISOString(), // Track creation time in ISO format
    });

    return { success: true, message: "Category created successfully." };
  } catch (error) {
    console.error("Error creating category:", error.message);
    throw new Error(`Error creating category: ${error.message}`);
  }
}

export async function getUserCategories(userId, type) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    if (!type) {
      throw new Error("Category type is required.");
    }

    // Reference to the 'UserCategories' collection
    const collectionRef = collection(db, "UserCategories");

    // Query to filter by userId and type
    const queryRef = query(
      collectionRef,
      where("userId", "==", userId), // Filter by userId
      where("type", "==", type) // Filter by type
    );

    // Fetch the documents matching the query
    const querySnapshot = await getDocs(queryRef);

    // Map through the documents and extract their data
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID if needed
      ...doc.data(),
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    throw new Error(`Error retrieving categories: ${error.message}`);
  }
}

export async function updateCategoryAttempts(userId, decrementValue) {
  try {
    const userDocRef = doc(db, 'UserCategories', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const currentAttempts = userDoc.data().categoriesAttempts || 0;

    await updateDoc(userDocRef, {
      categoriesAttempts: Math.max(currentAttempts - decrementValue, 0), // Ensure attempts don't go below zero
    });

    console.log('Category attempts updated for userId:', userId);
  } catch (error) {
    console.error('Error updating category attempts:', error.message);
    throw new Error(`Error updating category attempts: ${error.message}`);
  }
}

export async function deleteCategoryByUserId(id, userId, categoryData) {
  try {
    if (!id || !userId || !categoryData || !categoryData.name || !categoryData.type) {
      throw new Error("Invalid input: All parameters (id, userId, categoryData) are required.");
    }

    const categoryRef = collection(db, "UserCategories");

    // Query to find documents matching all criteria
    const q = query(
      categoryRef,
      where("id", "==", id),
      where("userId", "==", userId),
      where("name", "==", categoryData.name),
      where("type", "==", categoryData.type)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("No matching category found for deletion.");
      return { success: false, message: "No matching category found." };
    }

    // Delete all matching documents
    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, "UserCategories", docSnapshot.id)) // Delete using doc ID
    );

    await Promise.all(deletePromises);

    console.log(`Category with id: ${id} deleted successfully.`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error.message);
    return { success: false, message: `Error deleting category: ${error.message}` };
  }
}