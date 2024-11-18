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

export async function getUserById(userId) {
  const Doc = doc(db, 'users', userId); 
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
export async function storeCategory(userId, data) {
  try {
    // Validate userId by checking its existence in the User collection
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // Proceed to store the category
    const categoryRef = collection(db, 'UserCategories');
    const newCategory = await addDoc(categoryRef, {
      userId, // Associate the category with the user ID
      name: data.name,
      icon: data.icon,
      type: data.type,
      createdAt: new Date(), // Optional: Track creation time
    });

    console.log('Category created with ID:', newCategory.id);
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error.message);
    throw new Error(`Error creating category: ${error.message}`);
  }
}

export async function getCategories(userId, type) {
  try {
    const categoryRef = collection(db, 'UserCategories');
    let categoryQuery = query(
      categoryRef,
      where('userId', '==', userId),
      orderBy('name', 'asc')  // Order categories by name in ascending order
    );

    if (type) {
      categoryQuery = query(categoryQuery, where('type', '==', type));  // Optionally filter by type
    }

    const querySnapshot = await getDocs(categoryQuery);

    if (querySnapshot.empty) {
      console.warn(`No categories found for userId: ${userId}`);
      return [];
    }

    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id, // Include document ID for reference
      ...doc.data(), // Spread the document data
    }));

    return categories;
  } catch (error) {
    console.error('Error fetching categories: ', error.message);
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

export async function deleteCategoryByUserId(userId, data) {
  try {
    const categoryRef = collection(db, 'UserCategories');
    const q = query(
      categoryRef,
      where('userId', '==', userId), // Match category by user ID
      where('name', '==', data.name),
      where('type', '==', data.type)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const deletePromises = querySnapshot.docs.map(docSnapshot =>
        deleteDoc(doc(db, 'Category', docSnapshot.id))
      );

      await Promise.all(deletePromises);

      console.log(`Category with name: ${data.name}, type: ${data.type}, userId: ${userId} deleted successfully.`);
      return { success: true };
    } else {
      console.warn('No matching category found for deletion.');
      return { success: false, message: 'No matching category found.' };
    }
  } catch (error) {
    console.error('Error deleting category:', error.message);
    throw new Error(`Error deleting category: ${error.message}`);
  }
}







// const { collection, getDocs, query, where, doc, getFirestore, setDoc, getDoc, addDoc, deleteDoc, orderBy, updateDoc } = require("firebase/firestore");
// const { db } = require("../../config/firebaseConfig");

// // User--------------------------------------------------------------------------------------------------------------
// async function storeUser(user) {
//   try {
//     await setDoc(doc(db, "users", user.id), {
//       id: user.id,
//       displayName: user.displayName,
//       email: user.email,
//       emailVerified: user.emailVerified,
//       photoURL: user.photoURL
//     }).then((response) => {
//         console.log('User data saved in Firestore');
//     })
//     .catch((error) => {
//       console.error('Error saving user data in Firestore:', error.message);
//     });
//   } catch (e) {
//     console.error('Error adding user: ', e);
//     throw new Error(`Error storing user: ${e}`);
//   }
// }

// async function getUserById(userId) {
//   const Doc = doc(db, 'users', userId);
//   try {
//     const docSnapshot = await getDoc(Doc);
//     if (docSnapshot.exists()) {
//       return docSnapshot.data();
//     } else {
//       throw new Error('User not found');
//     }
//   } catch (e) {
//     console.error('Error getting user by ID: ', e);
//     throw new Error(`Error retrieving user: ${e}`);
//   }
// }

// async function getUserByEmail(email) {
//   const q = query(collection(db, 'users'), where('email', '==', email));

//   try {
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       return querySnapshot.docs[0].data();
//     } else {
//       console.log('No user found with this email');
//       return null;
//     }
//   } catch (e) {
//     console.error('Error getting user by email: ', e);
//     throw new Error(`Error retrieving user by email: ${e.message}`);
//   }
// }

// async function updateUser(userId, updatedData) {
//   const Doc = doc(db, 'User', userId);

//   try {
//     await updateDoc(Doc, {
//       ...updatedData,
//       updatedAt: new Date(),
//     });
//     return { message: 'User updated successfully' };
//   } catch (e) {
//     console.error('Error updating user: ', e);
//     throw new Error(`Error updating user: ${e}`);
//   }
// }

// async function deleteUser(userId) {
//   const Doc = doc(db, 'User', userId);
//   try {
//     await deleteDoc(Doc);
//     return { message: 'User deleted successfully' };
//   } catch (e) {
//     console.error('Error deleting user: ', e);
//     throw new Error(`Error deleting user: ${e}`);
//   }
// }

// // Transaction--------------------------------------------------------------------------------------------------------
// async function storeTransaction(transaction) {
//   const transactionCollection = collection(db, 'Transaction');
//   try {
//     const docRef = await addDoc(transactionCollection, {
//       ...transaction,
//       createdAt: transaction.createdAt || new Date(),
//       updatedAt: transaction.updatedAt || new Date(),
//     });
//     console.log('Transaction document written with ID: ', docRef.id);
//     return docRef.id;
//   } catch (e) {
//     console.error('Error adding transaction: ', e);
//     throw new Error(`Error storing transaction: ${e}`);
//   }
// }

// async function getFirestoreTransactionById(transactionId) {
//   const docRef = doc(db, 'Transaction', transactionId);
//   const transaction = await getDoc(docRef);
//   if (transaction.exists()) {
//     return transaction.data();
//   }
//   return null;
// }

// async function getTransactionsByUserIdAndDate(userId, from, to) {
//   const transactionCollection = collection(db, 'Transaction');
//   const q = query(
//     transactionCollection,
//     where("userId", "==", userId),
//     where("date", ">=", from),
//     where("date", "<=", to),
//     orderBy("date", "desc")
//   );

//   const querySnapshot = await getDocs(q);
//   const transactions = [];
//   querySnapshot.forEach((doc) => {
//     transactions.push({ id: doc.id, ...doc.data() });
//   });

//   return transactions;
// }

// async function deleteFirestoreTransaction(transactionId) {
//   const docRef = doc(db, 'Transaction', transactionId);
//   try {
//     await deleteDoc(docRef);
//     console.log('Transaction deleted with ID: ', transactionId);
//   } catch (e) {
//     console.error('Error deleting transaction: ', e);
//     throw new Error(`Error deleting transaction: ${e}`);
//   }
// }

// // StripeCustomer------------------------------------------------------------------------------------------------------
// async function storeStripeCustomer(customer) {
//   const customerCollection = collection(db, 'StripeCustomer');
//   try {
//     const docRef = await addDoc(customerCollection, {
//       ...customer,
//       createdAt: customer.createdAt || new Date(),
//       updatedAt: customer.updatedAt || new Date(),
//     });
//     console.log('Stripe Customer document written with ID: ', docRef.id);
//     return docRef.id;
//   } catch (e) {
//     console.error('Error adding document: ', e);
//     throw new Error(`Error storing Stripe customer: ${e}`);
//   }
// }

// async function getStripeCustomerByUserId(userId) {
//   const customerCollection = collection(db, 'StripeCustomer');
//   const q = query(customerCollection, where('userId', '==', userId));
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     const doc = querySnapshot.docs[0];
//     return { id: doc.id, ...doc.data() };
//   }

//   return null;
// }

// // Settings------------------------------------------------------------------------------------------------------------
// async function storeSettings(settings) {
//   const settingsCollection = collection(db, 'Settings');
//   try {
//     await addDoc(settingsCollection, {
//       ...settings,
//       createdAt: settings.createdAt || new Date(),
//       updatedAt: settings.updatedAt || new Date(),
//     });
//     console.log('Settings document successfully written.');
//   } catch (e) {
//     console.error('Error adding settings document: ', e);
//   }
// }

// async function getSettingsByUserId(userId) {
//   const settingsCollection = collection(db, "Settings");
//   const q = query(settingsCollection, where("userId", "==", userId));
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     const doc = querySnapshot.docs[0];
//     const data = doc.data();

//     return {
//       id: doc.id,
//       currency: data.currency,
//       userId: data.userId,
//       createdAt: data.createdAt?.toDate(),
//       updatedAt: data.updatedAt?.toDate(),
//     };
//   }

//   return null;
// }

// async function updateUserCurrency(userId, currency) {
//   const settingsCollection = collection(db, 'Settings');
//   const settingsQuery = query(settingsCollection, where('userId', '==', userId));
//   const querySnapshot = await getDocs(settingsQuery);

//   if (!querySnapshot.empty) {
//     const docRef = doc(db, 'Settings', querySnapshot.docs[0].id);
//     await updateDoc(docRef, { currency, updatedAt: new Date() });
    
//     return { id: docRef.id, userId, currency, updatedAt: new Date() };
//   }

//   return null;
// }

// // DefaultCategory------------------------------------------------------------------------------------------------------
// async function getDefaultCategories(type) {
//   try {
//     const collectionRef = collection(db, 'DefaultCategory');
//     let queryRef = query(collectionRef, orderBy('name', 'asc'));

//     if (type) {
//       queryRef = query(queryRef, where('type', '==', type));
//     }

//     const querySnapshot = await getDocs(queryRef);
//     const categories = querySnapshot.docs.map(doc => ({
//       ...doc.data(),
//     }));

//     return categories;
//   } catch (error) {
//     console.error('Error fetching DefaultCategory data: ', error);
//     throw new Error(`Error retrieving DefaultCategory data: ${error.message}`);
//   }
// }

// // Category-------------------------------------------------------------------------------------------------------------
// async function storeCategory(userId, data) {
//   try {
//     const userDocRef = doc(db, 'User', userId);
//     const userDoc = await getDoc(userDocRef);

//     if (!userDoc.exists()) {
//       throw new Error(`User with ID ${userId} does not exist.`);
//     }

//     const categoryRef = collection(db, 'Category');
//     const newCategory = await addDoc(categoryRef, {
//       userId,
//       name: data.name,
//       icon: data.icon,
//       type: data.type,
//       createdAt: new Date(),
//     });

//     console.log('Category created with ID:', newCategory.id);
//     return newCategory;
//   } catch (error) {
//     console.error('Error creating category:', error.message);
//     throw new Error(`Error creating category: ${error.message}`);
//   }
// }

// async function getCategories(userId, type) {
//   try {
//     const categoryRef = collection(db, 'Category');
//     let categoryQuery = query(
//       categoryRef,
//       where('userId', '==', userId),
//       orderBy('name', 'asc')
//     );

//     if (type) {
//       categoryQuery = query(categoryQuery, where('type', '==', type));
//     }

//     const querySnapshot = await getDocs(categoryQuery);

//     if (querySnapshot.empty) {
//       console.warn(`No categories found for userId: ${userId}`);
//       return [];
//     }

//     const categories = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return categories;
//   } catch (error) {
//     console.error('Error fetching categories: ', error.message);
//     throw new Error(`Error retrieving categories: ${error.message}`);
//   }
// }

// async function updateCategoryAttempts(userId, decrementValue) {
//   try {
//     const userDocRef = doc(db, 'User', userId);
//     const userDoc = await getDoc(userDocRef);

//     if (!userDoc.exists()) {
//       throw new Error(`User with ID ${userId} not found.`);
//     }

//     const currentAttempts = userDoc.data().categoriesAttempts || 0;

//     await updateDoc(userDocRef, {
//       categoriesAttempts: Math.max(currentAttempts - decrementValue, 0),
//     });

//     console.log('Category attempts updated for userId:', userId);
//   } catch (error) {
//     console.error('Error updating category attempts:', error.message);
//     throw new Error(`Error updating category attempts: ${error.message}`);
//   }
// }

// async function deleteCategoryByUserId(userId, data) {
//   try {
//     const categoryRef = collection(db, 'Category');
//     const q = query(
//       categoryRef,
//       where('userId', '==', userId),
//       where('name', '==', data.name),
//       where('type', '==', data.type)
//     );

//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const deletePromises = querySnapshot.docs.map(docSnapshot =>
//         deleteDoc(doc(db, 'Category', docSnapshot.id))
//       );

//       await Promise.all(deletePromises);

//       console.log(`Category deleted successfully.`);
//       return { success: true };
//     } else {
//       console.warn('No matching category found for deletion.');
//       return { success: false, message: 'No matching category found.' };
//     }
//   } catch (error) {
//     console.error('Error deleting category:', error.message);
//     throw new Error(`Error deleting category: ${error.message}`);
//   }
// }

// module.exports = {
//   storeUser,
//   getUserById,
//   getUserByEmail,
//   updateUser,
//   deleteUser,
//   storeTransaction,
//   getFirestoreTransactionById,
//   getTransactionsByUserIdAndDate,
//   deleteFirestoreTransaction,
//   storeStripeCustomer,
//   getStripeCustomerByUserId,
//   storeSettings,
//   getSettingsByUserId,
//   updateUserCurrency,
//   getDefaultCategories,
//   storeCategory,
//   getCategories,
//   updateCategoryAttempts,
//   deleteCategoryByUserId
// };
