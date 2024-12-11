// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Alert } from "react-native";
// // import EditTransactionModal from './EditTransaction';
//   // import { updateDoc, doc, getDoc } from 'firebase/firestore';
//   import { auth, db } from "../../config/firebaseConfig";
// import Icon from "react-native-vector-icons/MaterialIcons";

// const TransactionHistoryModal = ({ visible, category, onClose, theme }) => {
//     // const [selectedTransaction, setSelectedTransaction] = useState(null);
//     // const [modalVisible, setModalVisible] = useState(false);
//     const [filteredTransactions, setFilteredTransactions] = useState([]);
  
//     // const filteredTransactions = Array.isArray(transactions)
//     // ? transactions.filter((transaction) => transaction.category === category)
//     // : [];
//     // console.log("filter data in modal",filteredTransactions )

//      // Fetch data from Firestore when the modal opens
//   useEffect(() => {
//     if (visible && category) {
//       const unsubscribe = firestore()
//         .collection('users') // Replace with your Firestore collection
//         .where('category', '==', category) // Filter transactions by category
//         .onSnapshot((snapshot) => {
//           const transactions = snapshot.docs.map((doc) => doc.data());
//           setFilteredTransactions(transactions);
          
//           // Calculate total amount
//           const total = transactions.reduce((sum, transaction) => {
//             if (transaction.type === "Income") {
//               return sum + transaction.amount;
//             } else if (transaction.type === "Expense") {
//               return sum - transaction.amount;
//             }
//             return sum;
//           }, 0);
//           setTotalAmount(total);
//         });

//       // Cleanup subscription when the modal closes or category changes
//       return () => unsubscribe();
//     }
//   }, [visible, category]);
  
// // Calculate total amount
//   const totalAmount = filteredTransactions.reduce(
//     (sum, transaction) => {
//       if (transaction.type === "Income") {
//         return sum + transaction.amount;
//       } else if (transaction.type === "Expense") {
//         return sum - transaction.amount;
//       }
//       return sum;
//     },
//     0
//   );

//   // Format date and time using date-fns
//   const formatDateTime = (dateString) => {
//     const dateObj = new Date(dateString);
  
//     if (isNaN(dateObj.getTime())) {
//       console.error("Invalid date object:", dateObj);
//       return { formattedDate: "Invalid date", formattedTime: "Invalid time" };
//     }
  
//     const options = { year: "numeric", month: "2-digit", day: "2-digit" };
//     const formattedDate = dateObj.toLocaleDateString("en-CA", options); // yyyy-mm-dd
//     const formattedTime = dateObj.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
  
//     return { formattedDate, formattedTime };
//   };

// //   const editTransaction = async (transaction, updatedTransaction) => {
// //     const user = auth.currentUser;
// //     if (!user) {
// //       Alert.alert("Error", "User not authenticated.");
// //       return;
// //     }
  
// //     const userDocRef = doc(db, 'users', user.uid);
  
// //     Alert.alert(
// //       "Confirm Edit",
// //       `Are you sure you want to edit this ${transaction.type}?`,
// //       [
// //         {
// //           text: "Cancel",
// //           style: "cancel",
// //         },
// //         {
// //           text: "Save",
// //           onPress: async () => {
// //             try {
// //               console.log("Editing transaction:", transaction);
// //               console.log("Updated transaction:", updatedTransaction);
  
// //               const userDocSnapshot = await getDoc(userDocRef);
// //               if (userDocSnapshot.exists()) {
// //                 const expenses = userDocSnapshot.data().expenses || [];
// //                 const income = userDocSnapshot.data().income || [];
// //                 const transactionIndex =
// //                 transaction.type.toLowerCase() === "expense"
// //                   ? expenses.findIndex(
// //                       (item) =>
// //                         item.amount === transaction.amount &&
// //                         item.category === transaction.category &&
// //                         item.date === transaction.date &&
// //                         item.description === transaction.description &&
// //                         (item.icon === transaction.icon ||
// //                           (item.icon === null && transaction.icon === null))
// //                     )
// //                   : income.findIndex(
// //                       (item) =>
// //                         item.amount === transaction.amount &&
// //                         item.category === transaction.category &&
// //                         item.date === transaction.date &&
// //                         item.description === transaction.description &&
// //                         (item.icon === transaction.icon ||
// //                           (item.icon === null && transaction.icon === null))
// //                     );

// //               console.log("Transaction index found:", transactionIndex);

// //               if (transactionIndex !== -1) {
// //                 if (transaction.type.toLowerCase() === "expense") {
// //                   expenses[transactionIndex] = {
// //                     ...updatedTransaction,
// //                     type: "Expense",
// //                   };
// //                   await updateDoc(userDocRef, { expenses });
// //                 } else {
// //                   income[transactionIndex] = {
// //                     ...updatedTransaction,
// //                     type: "Income",
// //                   };
// //                   await updateDoc(userDocRef, { income });
// //                 }

// //                 console.log("Transaction edited successfully.");

// //                 // Update local state
// //                 setTransactionsData((prevTransactions) =>
// //                   prevTransactions.map((item) =>
// //                     item.amount === transaction.amount &&
// //                     item.category === transaction.category &&
// //                     item.date === transaction.date &&
// //                     item.description === transaction.description &&
// //                     (item.icon === transaction.icon ||
// //                       (item.icon === null && transaction.icon === null))
// //                       ? { ...updatedTransaction, type: transaction.type }
// //                       : item
// //                   )
// //                 );

// //                 Alert.alert("Success", "Transaction edited successfully.");
// //               } else {
// //                 Alert.alert("Error", "Transaction not found.");
// //               }
// //             } else {
// //               console.error("User document not found in Firestore.");
// //               Alert.alert("Error", "User document not found.");
// //             }
// //           } catch (error) {
// //             console.error("Error editing transaction: ", error);
// //             Alert.alert("Error", "Could not edit transaction.");
// //           }
// //         },
// //       },
// //     ]
// //   );
// // };
  
// //   const handleEditTransaction = async (updatedTransaction) => {
// //     await editTransaction(selectedTransaction, updatedTransaction);
// //     setModalVisible(false);
// //     setSelectedTransaction(null);
// //   };

// return (
//   <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
//     <View style={styles.modalContainer}>
//       <View style={[styles.modalContent]}>
//         {/* Header */}
//         <View style={styles.modalHeader}>
//           <Text style={[styles.modalTitle]}>
//             History: {category}
//           </Text>
//           <TouchableOpacity onPress={onClose}>
//             <Icon name="close" size={24} />
//           </TouchableOpacity>
//         </View>

//         {/* Total Amount */}
//         <Text style={[styles.totalAmount, { color: totalAmount >= 0 ? "green" : "red" }]}>
//           Total Amount: ${totalAmount.toFixed(2)}
//         </Text>

//         {/* Transactions List */}
//         {filteredTransactions.length > 0 ? (
//           <FlatList
//             data={filteredTransactions}
//             keyExtractor={(item, index) => `${item.date}-${item.description}-${index}`}
//             renderItem={({ item }) => {
//               const { formattedDate, formattedTime } = formatDateTime(item.date);
//               return (
//                 <View
//                   style={[
//                     styles.transactionCard,
//                     {
//                       shadowColor: theme.shadowColor || "#000",
//                     },
//                   ]}
//                 >
//                   <View style={styles.transactionHeader}>
//                     <Icon
//                       name={item.type === "Income" ? "trending-up" : "trending-down"}
//                       size={32}
//                       color={item.type === "Income" ? "green" : "red"}
//                     />
//                     <Text
//                       style={[
//                         styles.transactionAmount,
//                         { color: item.type === "Income" ? "green" : "red" },
//                       ]}
//                     >
//                       {item.type === "Income" ? `+$${item.amount}` : `-$${item.amount}`}
//                     </Text>
//                   </View>
//                   <Text style={[styles.transactionText]}>
//                     Date: {formattedDate}, Time: {formattedTime}
//                   </Text>
//                   <Text style={[styles.transactionText]}>
//                     Category: {item.category || "—"}
//                   </Text>
//                   <Text style={[styles.transactionText]}>
//                     Description: {item.description || "—"}
//                   </Text>
//                   <Text style={[styles.transactionText]}>
//                     Type: {item.type || "—"}
//                   </Text>
//                 </View>
//               );
//             }}
//           />
//         ) : (
//           <View style={styles.noTransactionsContainer}>
//             <Text style={[styles.noTransactionsText]}>
//               No history found for this category.
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   </Modal>
// );
// };

// const styles = StyleSheet.create({
// modalContainer: {
//   flex: 1,
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
// },
// modalContent: {
//   width: "90%",
//   borderRadius: 8,
//   padding: 16,
//   elevation: 5,
// },
// modalHeader: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: 16,
// },
// modalTitle: {
//   fontSize: 18,
//   fontWeight: "bold",
// },
// totalAmount: {
//   fontSize: 16,
//   fontWeight: "bold",
//   marginBottom: 16,
// },
// transactionCard: {
//   padding: 16,
//   borderRadius: 8,
//   marginBottom: 12,
//   elevation: 3,
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.2,
//   shadowRadius: 3,
// },
// transactionHeader: {
//   flexDirection: "row",
//   alignItems: "center",
//   justifyContent: "space-between",
//   marginBottom: 8,
// },
// transactionAmount: {
//   fontSize: 20,
//   fontWeight: "bold",
// },
// transactionText: {
//   fontSize: 14,
//   marginTop: 4,
// },
// noTransactionsContainer: {
//   alignItems: "center",
//   justifyContent: "center",
//   marginTop: 20,
// },
// noTransactionsText: {
//   fontSize: 16,
//   fontStyle: "italic",
// },
// });

// export default TransactionHistoryModal;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../themeContext';

const TransactionHistoryModal = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { theme } = useTheme();

  const { item } = route?.params || {}; 
  if (!item) {
    return (
      <View >
        {/* <Text>Error: No data passed</Text> */}
      </View>
    );
  }
  
  const { category, transactions, deleteTransaction, editTransaction ,handleEditTransaction} = item;

  useEffect(() => {
    setTransactionHistory(transactions || []);
  }, [transactions]);

  const handleDelete = (transaction) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            deleteTransaction(transaction); // Call the delete function
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
  }

  const handleEdit = (item) => {
    setTransaction(item);
    setModalVisible(true);
  };

  const handleSave = async () => {
    // Ensure all required fields are set
    if (!transaction.description || !transaction.category || transaction.amount === null || transaction.amount <= 0 || !transaction.type || !transaction.date) {
      Alert.alert("Error", "Please provide valid transaction details.");
      return;
    }
  
    if (transaction) {
      console.log("Saving updated transaction:", transaction);
      
      // Send only updated transaction data
      await editTransaction(transaction);
  
      // Additional handling for successful edit
      if (handleEditTransaction) {
        handleEditTransaction(transaction); // Send updated transaction to parent component
      } else {
        console.error("handleEditTransaction is not defined");
      }
  
      setModalVisible(false);
    } else {
      console.error("Transaction is null or undefined");
    }
  };
  
  const handleClose = () => {
    setModalVisible(false);
    setTransaction(null); 
  };

  return (
    <View style={[styles.container,{ backgroundColor: theme.background}]}>
      <Text style={[styles.header,{color:theme.text}]}>History Of {category}</Text>

      {/* Display all the transactions for that category */}
      <FlatList
        data={transactionHistory}
        keyExtractor={(transaction, index) => `${transaction.date}-${index}`}
        renderItem={({ item }) => (
          <View  style={[
            styles.transactionCard,{ backgroundColor: theme.transactionCard,color: theme.text,}
          ]}>
            <View style={[styles.cardHeader,{backgroundColor:theme.transactionCard}]}>
              <Text style={[styles.category,{color:theme.text}]}>{category}</Text>
              <View style={[styles.iconContainer, {backgroundColor:theme.transactionCard,}]}>
                {item.type === "Income" ? (
                  <MaterialIcons name="trending-up" size={38} color="green" />
                ) : (
                  <MaterialIcons name="trending-down" size={29} color="red" />
                )}
                <Text
                  style={[
                    styles.transactionType,{color:theme.text},
                    item.type === "Income" ? styles.income : styles.expense,
                  ]}
                >
                  {item.type}
                </Text>
              </View>
            </View>

            <View style={[styles.decriptionAmount,{ backgroundColor: theme.transactionCard,color: theme.text,}]}>
              <Text style={[styles.description,{color:theme.text} ]}>{item.description}</Text>
              <Text style={[styles.amount,{color:theme.text}]}>
                {item.amount || "Amount not available"}
              </Text>
            </View>

            <Text style={[styles.date,{color:theme.text}]}>
              {formatDate(item.date)}
            </Text>

            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <MaterialIcons name="edit" size={24} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <MaterialIcons name="delete" size={30} color="#dc3545" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Modal for Editing Transaction */}
      {transaction && (
        <Modal
          visible={modalVisible}
          onRequestClose={handleClose}
          animationType="slide"
          transparent={true}
        >
          <View style={[styles.modalContainer,]}>
            <View style={[styles.modalContent,{ backgroundColor: theme.transactionCard,color: theme.text,}]}>
              <Text style={[styles.modalHeader,{ color: theme.text,}]}>Edit Transaction</Text>
              <TextInput
                style={[styles.input,{ color: theme.text,}]}
                placeholder="Description"
                value={transaction.description}
                onChangeText={(text) =>
                  setTransaction({ ...transaction, description: text })
                }
              />
              <TextInput
               style={[styles.input,{ color: theme.text,}]}
                placeholder="Amount"
                keyboardType="numeric"
                value={
                  transaction.amount !== null ? String(transaction.amount) : ""
                }
                onChangeText={(text) => {
                  // Check if the input is empty
                  const amount = text.trim() === "" ? null : parseFloat(text);
                  setTransaction({ ...transaction, amount });
                }}
              />
              <TextInput
                style={[styles.input,{ color: theme.text,}]}
                placeholder="Category"
                value={transaction.category}
                onChangeText={(text) =>
                  setTransaction({ ...transaction, category: text })
                }
              />
              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} />
                <Button title="Cancel" onPress={handleClose} color="red" />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    justifyContent:'center',
    marginLeft:80,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    marginTop: 20,
  },
  transactionCard: {
    marginBottom: 15,
    padding: 15,
    // backgroundColor: '#fff',
    borderRadius: 5,
    // shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionType: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  decriptionAmount: {
    marginVertical: 10,
  },
  description: {
    fontSize: 24,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TransactionHistoryModal;
