
import React, {useState} from "react";
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Alert } from "react-native";
import EditTransactionModal from './EditTransaction';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../../config/firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons";

const TransactionHistoryModal = ({ visible, category, transactions, onClose, theme }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.category === category
    );
    // console.log("filter data in modal",filteredTransactions )
  
// Calculate total amount
  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => {
      if (transaction.type === "Income") {
        return sum + transaction.amount;
      } else if (transaction.type === "Expense") {
        return sum - transaction.amount;
      }
      return sum;
    },
    0
  );

  // Format date and time using date-fns
  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
  
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date object:", dateObj);
      return { formattedDate: "Invalid date", formattedTime: "Invalid time" };
    }
  
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = dateObj.toLocaleDateString("en-CA", options); // yyyy-mm-dd
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return { formattedDate, formattedTime };
  };

//   const editTransaction = async (transaction, updatedTransaction) => {
//     const user = auth.currentUser;
//     if (!user) {
//       Alert.alert("Error", "User not authenticated.");
//       return;
//     }
  
//     const userDocRef = doc(db, 'users', user.uid);
  
//     Alert.alert(
//       "Confirm Edit",
//       `Are you sure you want to edit this ${transaction.type}?`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Save",
//           onPress: async () => {
//             try {
//               console.log("Editing transaction:", transaction);
//               console.log("Updated transaction:", updatedTransaction);
  
//               const userDocSnapshot = await getDoc(userDocRef);
//               if (userDocSnapshot.exists()) {
//                 const expenses = userDocSnapshot.data().expenses || [];
//                 const income = userDocSnapshot.data().income || [];
//                 const transactionIndex =
//                 transaction.type.toLowerCase() === "expense"
//                   ? expenses.findIndex(
//                       (item) =>
//                         item.amount === transaction.amount &&
//                         item.category === transaction.category &&
//                         item.date === transaction.date &&
//                         item.description === transaction.description &&
//                         (item.icon === transaction.icon ||
//                           (item.icon === null && transaction.icon === null))
//                     )
//                   : income.findIndex(
//                       (item) =>
//                         item.amount === transaction.amount &&
//                         item.category === transaction.category &&
//                         item.date === transaction.date &&
//                         item.description === transaction.description &&
//                         (item.icon === transaction.icon ||
//                           (item.icon === null && transaction.icon === null))
//                     );

//               console.log("Transaction index found:", transactionIndex);

//               if (transactionIndex !== -1) {
//                 if (transaction.type.toLowerCase() === "expense") {
//                   expenses[transactionIndex] = {
//                     ...updatedTransaction,
//                     type: "Expense",
//                   };
//                   await updateDoc(userDocRef, { expenses });
//                 } else {
//                   income[transactionIndex] = {
//                     ...updatedTransaction,
//                     type: "Income",
//                   };
//                   await updateDoc(userDocRef, { income });
//                 }

//                 console.log("Transaction edited successfully.");

//                 // Update local state
//                 setTransactionsData((prevTransactions) =>
//                   prevTransactions.map((item) =>
//                     item.amount === transaction.amount &&
//                     item.category === transaction.category &&
//                     item.date === transaction.date &&
//                     item.description === transaction.description &&
//                     (item.icon === transaction.icon ||
//                       (item.icon === null && transaction.icon === null))
//                       ? { ...updatedTransaction, type: transaction.type }
//                       : item
//                   )
//                 );

//                 Alert.alert("Success", "Transaction edited successfully.");
//               } else {
//                 Alert.alert("Error", "Transaction not found.");
//               }
//             } else {
//               console.error("User document not found in Firestore.");
//               Alert.alert("Error", "User document not found.");
//             }
//           } catch (error) {
//             console.error("Error editing transaction: ", error);
//             Alert.alert("Error", "Could not edit transaction.");
//           }
//         },
//       },
//     ]
//   );
// };
  
//   const handleEditTransaction = async (updatedTransaction) => {
//     await editTransaction(selectedTransaction, updatedTransaction);
//     setModalVisible(false);
//     setSelectedTransaction(null);
//   };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              History: {category}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Total Amount */}
          <Text style={[ styles.totalAmount, {color: totalAmount >= 0 ? "green" : "red",},]} >
            Total Amount: ${totalAmount.toFixed(2)}
          </Text>

          {/* Transactions List */}
          {filteredTransactions.length > 0 ? (
            <FlatList
              data={filteredTransactions}
              keyExtractor={(item, index) => `${item.date}-${item.description}-${index}`}
              renderItem={({ item }) => {
                const { formattedDate, formattedTime } = formatDateTime(item.date);
                return (
                  <View
                    style={[
                      styles.transactionCard,
                      {
                        backgroundColor: theme.transactionBackground,
                        shadowColor: theme.shadowColor || "#000",
                      },
                    ]}
                  >
                    <View style={styles.transactionHeader}>
                      <Icon
                        name={item.type === "Income" ? "trending-up" : "trending-down"}
                        size={32}
                        color={item.type === "Income" ? "green" : "red"}
                      />
                      <Text
                        style={[
                          styles.transactionAmount,
                          { color: item.type === "Income" ? "green" : "red" },
                        ]}
                      >
                        {item.type === "Income" ? `+$${item.amount}` : `-$${item.amount}`}
                      </Text>
                    </View>
                    <Text style={[styles.transactionText, { color: theme.text }]}>
                      Date: {formattedDate}, Time: {formattedTime}
                    </Text>
                    <Text style={[styles.transactionText, { color: theme.text }]}>
                      Category: {item.category || "—"}
                    </Text>
                    <Text style={[styles.transactionText, { color: theme.text }]}>
                      Description: {item.description || "—"}
                    </Text>
                    <Text style={[styles.transactionText, { color: theme.text }]}>
                      Type: {item.type || "—"}
                    </Text>
                    {/* <TouchableOpacity
                      onPress={() => {
                        setSelectedTransaction(item);
                        setModalVisible(true);
                      }}
                    >
                      <Icon name="edit" size={21} color="#007BFF" />
                    </TouchableOpacity> */}
                  </View>
                );
              }}
            />
          ) : (
            <View style={styles.noTransactionsContainer}>
              <Text style={[styles.noTransactionsText, { color: theme.text }]}>
                No history found for this category.
              </Text>
            </View>
          )}
        </View>
      </View>
      {selectedTransaction && (
        <EditTransactionModal
          visible={modalVisible}
          transaction={selectedTransaction}
          onClose={() => setModalVisible(false)}
          onSave={handleEditTransaction}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  transactionText: {
    fontSize: 14,
    marginTop: 4,
  },
  noTransactionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noTransactionsText: {
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default TransactionHistoryModal;
