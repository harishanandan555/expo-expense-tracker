import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, TouchableWithoutFeedback } from "react-native";
import { Provider } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as MediaLibrary from "expo-media-library";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth, db } from "../../config/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import EditTransactionModal from './EditTransaction';

const TransactionScreen = ({ theme }) => {
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedType, setSelectedType] = useState("Type");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noTransactionsMessage, setNoTransactionsMessage] = useState("");
  const [transactionsFound, setTransactionsFound] = useState(true);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [transactionsData, setTransactionsData] = useState([]);
  const [selectedExportOption, setSelectedExportOption] = useState("");
  const [transactionTypes, setTransactionTypes] = useState(['Type', 'Income', 'Expense']);
  const [categories, setCategories] = useState(['Category']);
  const [menuVisible, setMenuVisible] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchTransactions(user.uid);
        // await copyDataToHistory(user.uid); // Call to copy data to History
      } else {
        setTransactionsData([]);
      }
    });
    return unsubscribe;
  }, []);

  const fetchTransactions = async (uid) => {
    try {
      // setIsRefreshing(true);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const incomeData = data.income || [];
        const expenseData = data.expenses || [];

        // Combine income and expense data into a single array
        const allTransactions = [
          ...incomeData.map(item => ({ ...item, type: 'Income' })),
          ...expenseData.map(item => ({ ...item, type: 'Expense' })),
        ];

        // Set transactions data only if it's not empty
        if (allTransactions.length > 0) {
          setTransactionsData(allTransactions);
          console.log("Fetched transactions in fetchTransactions fn:", allTransactions);
        } else {
          setNoTransactionsMessage("No transactions found.");
          setTransactionsFound(false);
        }

        // Extract unique categories and transaction types
        const uniqueCategories = [...new Set(allTransactions.map(item => item.category))];
        // const uniqueTransactionTypes = ['Type', 'Income', 'Expense'];

        const uniqueTransactionTypes = ['Income', 'Expense'];

        setCategories(uniqueCategories);
        setTransactionTypes(uniqueTransactionTypes);

        if (allTransactions.length === 0) {
          setNoTransactionsMessage("No transactions found.");
          setTransactionsFound(false);
        } else {
          setNoTransactionsMessage("");
          setTransactionsFound(true);
        }


      } else {
        setNoTransactionsMessage("User data not found.");
        setTransactionsFound(false);
      }
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      setNoTransactionsMessage("Error fetching transactions.");
      setTransactionsFound(false);
      // setIsRefreshing(false);
    }
  };

  // const copyDataToHistory = async (uid) => {
  //   try {
  //     const userDocRef = doc(db, 'users', uid);
  //     const userDoc = await getDoc(userDocRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();

  //       if (!userData.income || !userData.expenses) {
  //         console.log("No income or expenses data found.");
  //         return;
  //       }

  //       const historyData = [
  //         ...userData.income.map(item => ({ ...item, type: 'Income' })),
  //         ...userData.expenses.map(item => ({ ...item, type: 'Expense' })),
  //       ];

  //       const historyCollectionRef = collection(db, 'History', uid, 'transactions');

  //       const querySnapshot = await getDocs(historyCollectionRef);
  //       const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  //       await Promise.all(deletePromises);

  //       const addPromises = historyData.map(async (transaction) => {
  //         const docRef = doc(historyCollectionRef);
  //         await setDoc(docRef, {
  //           ...transaction,
  //           id: docRef.id,
  //         });
  //       });
  //       await Promise.all(addPromises);

  //       console.log("History collection updated successfully.");
  //     } else {
  //       console.log("No user data found.");
  //     }
  //   } catch (error) {
  //     console.log("Error updating History collection: ", error);
  //   }
  // };


  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';

  const showDatePicker = () => { setDatePickerVisibility(true); };
  const hideDatePicker = () => { setDatePickerVisibility(false); };


  const handleConfirm = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);

    const filteredTransactions = transactionsData.filter(
      (transaction) => format(new Date(transaction.date), "yyyy-MM-dd") === formattedDate
    );

    if (filteredTransactions.length === 0) {
      setSelectedDate(null);
      setNoTransactionsMessage("No transactions found.");
      setTransactionsFound(false);
    } else {
      setSelectedDate(formattedDate);
      setNoTransactionsMessage("");
      setTransactionsFound(true);
    }

    hideDatePicker();
  };

  const filterTransactions = () => {
    const filtered = transactionsData.filter((transaction) => {
      const transactionDate = format(new Date(transaction.date), "yyyy-MM-dd"); // Ensure this is in the correct format
      return (
        (selectedCategory === "Category" || transaction.category === selectedCategory) &&
        (selectedType === "Type" || transaction.type === selectedType) &&
        (selectedDate ? transactionDate === selectedDate : true)
      );
    });
    // console.log("Filtered transactions:", filtered); // Debugging line
    return filtered;
  };

  const deleteTransaction = async (transaction) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete this ${transaction.type}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              console.log("Deleting transaction:", transaction);

              const userDocSnapshot = await getDoc(userDocRef);
              if (userDocSnapshot.exists()) {
                const expenses = userDocSnapshot.data().expenses || [];
                const income = userDocSnapshot.data().income || [];

                const transactionIndex = transaction.type.toLowerCase() === 'expense'
                  ? expenses.findIndex(item =>
                    item.amount === transaction.amount &&
                    item.category === transaction.category &&
                    item.date === transaction.date &&
                    item.description === transaction.description &&
                    (item.icon === transaction.icon || (item.icon === null && transaction.icon === null))
                  )
                  : income.findIndex(item =>
                    item.amount === transaction.amount &&
                    item.category === transaction.category &&
                    item.date === transaction.date &&
                    item.description === transaction.description &&
                    (item.icon === transaction.icon || (item.icon === null && transaction.icon === null))
                  );

                console.log("Transaction index found:", transactionIndex);
                console.log("Expenses:", expenses);

                if (transactionIndex !== -1) {
                  if (transaction.type.toLowerCase() === 'expense') {
                    expenses.splice(transactionIndex, 1);
                    await updateDoc(userDocRef, { expenses });
                  } else {
                    income.splice(transactionIndex, 1);
                    await updateDoc(userDocRef, { income });
                  }

                  console.log("Transaction deleted successfully.");

                  setTransactionsData(prevTransactions =>
                    prevTransactions.filter(item =>
                      !(item.amount === transaction.amount &&
                        item.category === transaction.category &&
                        item.date === transaction.date &&
                        item.description === transaction.description &&
                        (item.icon === transaction.icon || (item.icon === null && transaction.icon === null)))
                    )
                  );

                  Alert.alert("Success", "Transaction deleted successfully.");
                } else {
                  Alert.alert("Error", "Transaction not found.");
                }
              } else {
                console.error("User document not found in Firestore.");
                Alert.alert("Error", "User document not found.");
              }
            } catch (error) {
              console.error("Error deleting transaction: ", error);
              Alert.alert("Error", "Could not delete transaction.");
            }
          }
        }
      ]
    );
  };

  const editTransaction = async (transaction, updatedTransaction) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    Alert.alert(
      "Confirm Edit",
      `Are you sure you want to edit this ${transaction.type}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: async () => {
            try {
              console.log("Editing transaction:", transaction);
              console.log("Updated transaction:", updatedTransaction);

              const userDocSnapshot = await getDoc(userDocRef);
              if (userDocSnapshot.exists()) {
                const expenses = userDocSnapshot.data().expenses || [];
                const income = userDocSnapshot.data().income || [];

                const transactionIndex = transaction.type.toLowerCase() === 'expense'
                  ? expenses.findIndex(item =>
                    item.amount === transaction.amount &&
                    item.category === transaction.category &&
                    item.date === transaction.date &&
                    item.description === transaction.description &&
                    (item.icon === transaction.icon || (item.icon === null && transaction.icon === null))
                  )
                  : income.findIndex(item =>
                    item.amount === transaction.amount &&
                    item.category === transaction.category &&
                    item.date === transaction.date &&
                    item.description === transaction.description &&
                    (item.icon === transaction.icon || (item.icon === null && transaction.icon === null))
                  );

                console.log("Transaction index found:", transactionIndex);

                if (transactionIndex !== -1) {
                  if (transaction.type.toLowerCase() === 'expense') {
                    expenses[transactionIndex] = { ...updatedTransaction, type: 'Expense' };
                    await updateDoc(userDocRef, { expenses });
                  } else {
                    income[transactionIndex] = { ...updatedTransaction, type: 'Income' };
                    await updateDoc(userDocRef, { income });
                  }

                  console.log("Transaction edited successfully.");

                  // Update local state
                  setTransactionsData(prevTransactions =>
                    prevTransactions.map(item =>
                      item.amount === transaction.amount &&
                        item.category === transaction.category &&
                        item.date === transaction.date &&
                        item.description === transaction.description &&
                        (item.icon === transaction.icon || (item.icon === null && transaction.icon === null))
                        ? { ...updatedTransaction, type: transaction.type }
                        : item
                    )
                  );

                  Alert.alert("Success", "Transaction edited successfully.");
                } else {
                  Alert.alert("Error", "Transaction not found.");
                }
              } else {
                console.error("User document not found in Firestore.");
                Alert.alert("Error", "User document not found.");
              }
            } catch (error) {
              console.error("Error editing transaction: ", error);
              Alert.alert("Error", "Could not edit transaction.");
            }
          }
        }
      ]
    );
  };

  const handleEditTransaction = async (updatedTransaction) => {
    await editTransaction(selectedTransaction, updatedTransaction);
    setModalVisible(false);
    setSelectedTransaction(null); // Reset selected transaction
  };

  const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
  };

  const renderTransactionItem = ({ item, index }) => {
    const uniqueId = `${item.date}-${item.category}-${item.amount}-${index}`; // Combine fields + index for uniqueness
    const isMenuVisible = menuVisible === uniqueId; // Compare with menuVisible state

    return (
      <View style={[styles.transactionRow, { backgroundColor: theme.transactionBackground }]}>

        <Text style={[styles.transactionCell, { color: theme.transactionText }]}>{formatDate(item.date)}</Text>
        <Text style={[styles.transactionCell, { color: theme.transactionText }]}>{item.category}</Text>
        <Text style={[styles.transactionCell, { color: theme.transactionText }]}>{item.description}</Text>
        <Text style={[styles.transactionCell, { color: theme.transactionText }]}>{item.type}</Text>
        <Text style={[styles.transactionCell, { color: theme.transactionText }]}>{item.amount}</Text>

        {/* More Icon */}
        <TouchableOpacity
          onPress={() => setMenuVisible(isMenuVisible ? null : uniqueId)} // Toggle visibility
        >
          <Icon name="more-horiz" size={24} color={theme.transactionText} />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {isMenuVisible && (
          <View style={[styles.dropdownMenu, { backgroundColor: theme.transactionBackground }]} >
            <TouchableOpacity onPress={() => { setSelectedTransaction(item); setModalVisible(true); }} style={styles.menuItem}>
              <Icon name="edit" size={21} color="#007BFF" />
              <Text style={[styles.menuText, { color: theme.transactionText }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(null); deleteTransaction(item); }} style={styles.menuItem}>
              <Icon name="delete" size={21} color="#FF0000" />
              <Text style={[styles.menuText, { color: theme.transactionText }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleRefresh = () => {
    setSelectedCategory("Category");
    setSelectedType("Type");
    setSelectedDate(null);
    setNoTransactionsMessage("");
    setTransactionsFound(true);
    setIsFilterApplied(false);
  };

  const exportToCSV = async () => {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "You need to enable permission to save files.");
      return;
    }

    const filteredTransactions = filterTransactions();
    console.log("Filtered transactions for CSV:", filteredTransactions);

    if (filteredTransactions.length === 0) {
      Alert.alert("No transactions found", "There are no transactions to export.");
      return;
    }

    // Create CSV content
    const csvData = [
      ["Date", "Type", "Description", "Amount", "Category"],
      ...filteredTransactions.map((transaction) => [
        format(new Date(transaction.date), "yyyy-MM-dd"),
        transaction.type || 'N/A',
        transaction.description ? `"${transaction.description.replace(/"/g, '""')}"` : 'N/A',
        transaction.amount ? parseFloat(transaction.amount).toFixed(2) : 'N/A',
        transaction.category || 'N/A',
      ]),
    ]
      .map((row) => row.join(',')) // Join each row with commas
      .join('\n');
    // .map((row) =>
    //   row
    //       .map((value) => {
    //           // Escape double quotes by doubling them
    //           const escapedValue = String(value).replace(/"/g, '""');
    //           return `"${escapedValue}"`; // Enclose values in quotes
    //       })
    //       .join(",")
    // )
    // .join("\n");

    // Log the generated CSV data
    console.log("Generated CSV Data:\n", csvData);

    // Save the file to the app's document directory
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const fileUri = `${FileSystem.documentDirectory}transactions_${currentDate}.csv`;

    try {
      // Write the CSV file
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log("File saved at:", fileUri);

      // Share the file using expo-sharing
      await shareAsync(fileUri, {
        mimeType: "text/csv", // Ensure the correct MIME type
        dialogTitle: "Share your transactions",
      });
      console.log("File shared successfully");

}catch (error) {
  console.error("Error writing or sharing file:", error);
  Alert.alert("Error", "Failed to write or share the CSV file.");
}
  };

  const generateHtml = (transactionsData) => {
    if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
      return `<html><body><h1>No transactions available</h1></body></html>`;
    }

  let transactionHtml = transactionsData.map((transaction) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${format(new Date(transaction.date), "yyyy-MM-dd") || 'N/A'}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${transaction.type || 'N/A'}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${transaction.description || 'N/A'}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${transaction.amount || 'N/A'}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${transaction.category || 'N/A'}</td>
    </tr>
  `).join('');

    return `
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Helvetica Neue, Arial, sans-serif;
            text-align: center;
          }
          h1 {
            font-size: 50px;
            font-weight: bold;
            margin-bottom: 30px;
          }
          table {
            width: 80%;
            margin: 0 auto;
            border-collapse: collapse;
            margin-top: 30px;
          }
          th, td {
            padding: 15px;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
            font-size: 16px;
            text-align: center;
          }
          td {
            font-size: 14px;
            text-align: center;
          }
          .logo {
            width: 100px;
          }
        </style>
      </head>
      <body>
        <img src="${logoBase64}" alt="Logo" class="logo" />
        <h1>Transaction Report</h1>
        <h2>Transaction Chart</h2>
      <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
        <LineChart
          style={{ height: 200 }}
          data={chartData}
          labels={chartLabels}
          svg={{
            stroke: 'rgba(75, 192, 192, 1)',
            strokeWidth: 2,
          }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveNatural}
          numberOfTicks={5}
          xAccessor={(index) => index}
          yAccessor={(value) => value}
          xLabel={(index) => chartLabels[index]}
        />
      </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            ${transactionHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;
  };

  const print = async () => {
    const html = generateHtml(transactionsData);
    try {
      await Print.printAsync({
        html,
        printerUrl: selectedPrinter?.url,
      });
    } catch (error) {
      console.error('Error while printing:', error);
    }
  }

  const printToFile = async () => {
    try {
      const html = generateHtml(transactionsData);
      const { uri } = await Print.printToFileAsync({ html });
      console.log('File has been saved to:', uri);
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error while creating PDF:', error);
      Alert.alert("Error", "There was an issue creating the PDF.");
    }
  };

  // Function to select a printer (only for iOS)
  const selectPrinter = async () => {
    try {
      const printer = await Print.selectPrinterAsync();
      setSelectedPrinter(printer);
    } catch (error) {
      console.error('Error while selecting printer:', error);
    }
  };

  const handleExportOption = (option) => {
    console.log("Selected export option:", option); // Debugging line
    setSelectedExportOption(option);
    if (option === "CSV") {
      exportToCSV();
    } else if (option === "PDF") {
      printToFile();
    }
  };

  return (
    <Provider>
      <TouchableWithoutFeedback onPress={() => setMenuVisible(null)} accessible={false}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.transactionsContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={handleRefresh}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Transactions History</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  style={[styles.picker,
                  {
                    backgroundColor: theme.buttonBackground,
                    borderColor: theme.buttonBorder,
                    color: theme.text
                  }]}
                  dropdownIconColor={theme.text}
                >
                  {/* <Picker.Item label="" value="placeholder" /> */}
                  {categories.map((category) => (
                    <Picker.Item
                      key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedType} onValueChange={(itemValue) => setSelectedType(itemValue)}
                  style={[styles.picker, {
                    backgroundColor: theme.buttonBackground,
                    borderColor: theme.buttonBorder,
                    color: theme.text,
                  },
                  ]}
                  dropdownIconColor={theme.text}
                >
                  {/* <Picker.Item label="Type" value="" /> */}
                  {transactionTypes.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.filterContainer}>
              {/* Export Options Picker */}
              <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedExportOption} onValueChange={handleExportOption}
                  style={[
                    styles.picker,
                    {
                      backgroundColor: theme.buttonBackground,
                      borderColor: theme.buttonBorder,
                      color: theme.text,
                    },
                  ]}
                  dropdownIconColor={theme.text}
                >
                  {/* <Picker.Item label="Export" value="placeholder" /> */}
                  <Picker.Item label="CSV" value="CSV" />
                  <Picker.Item label="PDF" value="PDF" />
                </Picker>
              </View>

              {/* Date Picker Button */}
              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  {
                    backgroundColor: theme.buttonBackground,
                    borderColor: theme.buttonBorder,
                  },
                ]}
                onPress={showDatePicker}
              >
                <Text style={[styles.datePickerText, { color: theme.buttonText }]}>
                  {selectedDate ? `Selected Date: ${selectedDate}` : "Select Date"}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>

            {/* Transactions Table Header */}
            <View style={[styles.tableHeader, { backgroundColor: theme.tableHeaderBackground }]}>

              <Text style={[styles.headerText, { color: theme.tableHeaderText },]}> Date </Text>
              <Text style={[styles.headerText, { color: theme.tableHeaderText },]}>Category</Text>
              <Text style={[styles.headerCell, { color: theme.tableHeaderText }]}>Description</Text>
              <Text style={[styles.headerText, { color: theme.tableHeaderText },]}>Type </Text>
              <Text style={[styles.lastHeaderText, { color: theme.tableHeaderText },]}>Amount </Text>

            </View>
            <View style={{ flex: 1, height: '100%' }}>
              {/* Transactions List */}
              {filterTransactions().length > 0 ? (
                <FlatList
                  data={filterTransactions()}
                  keyExtractor={(item, index) => `${item.date}-${item.category}-${item.amount}-${index}`}
                  renderItem={renderTransactionItem}
                  contentContainerStyle={styles.listContainer}
                  nestedScrollEnabled
                  refreshing={isRefreshing}
                  onRefresh={filterTransactions}
                />
              ) : (
                <View style={styles.noTransactionsContainer}>
                  <Text style={[styles.noTransactionsText, { color: theme.text }]}>
                    No transactions found.
                  </Text>
                </View>
              )}
            </View>
            {/* Edit Transaction Modal */}
            {selectedTransaction && (
              <EditTransactionModal
                visible={modalVisible}
                transaction={selectedTransaction}
                onClose={() => setModalVisible(false)}
                onSave={handleEditTransaction}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,

  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10
  },
  avatarRight: {
    position: 'absolute',
    right: 10,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  logo: {
    marginTop: 10,
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 1,
    zIndex: 1,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 3,
    borderWidth: 1,
  },
  picker: {
    height: 20,
    backgroundColor: "#333",
    borderWidth: 1,
    height: 40,
  },

  datePickerButton: {
    flex: 1,
    height: 53.5,
    marginHorizontal: 3,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "start",
    borderWidth: 1,
  },
  datePickerText: {
    color: "#fff",
    marginLeft: 15,
    fontSize: 16,
  },
  transactionsContainer: {
    flex: 5.5,
    paddingTop: 16,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noAccessMessage: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "red",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.9,
    borderColor: "#ccc",
    backgroundColor: "#333",
    padding: 15,
    paddingLeft: 1,
    marginRight: 3,
    borderRadius: 3,
    marginBottom: 5,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    minWidth: 50,
    paddingRight: 10,
  },
  lastHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    paddingRight: 20
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#121212",
    marginBottom: 10,
    borderRadius: 5,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#121212",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    position: "relative",
  },
  transactionCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    paddingRight: 9,
  },
  transactionDate: {
    color: "#aaa",
    flex: 1,
    minWidth: 10,
    paddingLeft: 10,
  },
  transactionType: {
    color: "#aaa",
    flex: 1,
    paddingLeft: 10,
  },
  transactionAmount: {
    color: "#FF6A00",
    flex: 1,
    minWidth: 20,
    paddingLeft: 10,
  },
  deleteButton: {
    color: "#FF0000",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    paddingLeft: 10,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    zIndex: 1,
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
  },
  refreshButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    width: 100,
  },
  exportButton: {
    height: 50,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 5,
    width: 50,
    borderWidth: 1,
  },
  exportButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: -1, // Adjust to position below the "more-horiz" icon dynamically
    right: 10, // Align to the right of the row
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  menuText: {
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
});

export default TransactionScreen;
