import React, { useState, useEffect  } from 'react';
import {View, Text,StyleSheet,FlatList, TouchableOpacity, Alert, Image,TouchableWithoutFeedback} from "react-native";
import { Provider } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as MediaLibrary from "expo-media-library";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { auth, db } from "../../config/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import EditTransactionModal from './EditTransaction';

const TransactionScreen = ({theme}) => { 
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

  
  const navigation = useNavigation();

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

        const uniqueTransactionTypes = [ 'Income', 'Expense'];
  
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

   const showDatePicker = () => {setDatePickerVisibility(true);};
   const hideDatePicker = () => {setDatePickerVisibility(false); };


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

  const renderTransactionItem = ({  item, index }) => {
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
        <View style={[styles.dropdownMenu,{ backgroundColor: theme.transactionBackground }]} >
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
    ["Date","Type","Description","Amount","Category"],
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
  
  const logoBase64 = 'data:image/png;base64,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';

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
  
  const print = async ()=> {
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
      <TouchableWithoutFeedback  onPress={() => setMenuVisible(null)} accessible={false}>
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
              <Picker  selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={[ styles.picker,
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
             style={[ styles.picker, {
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
            <Text style={[  styles.datePickerText, { color: theme.buttonText }]}>
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
        <View style={[ styles.tableHeader,  { backgroundColor: theme.tableHeaderBackground }]}>
          
          <Text  style={[ styles.headerText, { color: theme.tableHeaderText },]}> Date </Text>
          <Text  style={[ styles.headerText,{ color: theme.tableHeaderText },]}>Category</Text>
          <Text  style={[ styles.headerCell, { color: theme.tableHeaderText }]}>Description</Text>
          <Text  style={[ styles.headerText,{ color: theme.tableHeaderText },]}>Type </Text>
          <Text  style={[ styles.lastHeaderText,{ color: theme.tableHeaderText },]}>Amount </Text>
          
        </View>
      <View style={{flex:1, height:'100%'}}>
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
    marginBottom:10
  },
  avatarRight: {
    position: 'absolute',
    right: 10,
},
avatar: {
  backgroundColor: '#6200ee',
},
logo: {
  marginTop:10,
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
    height:40,
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
    marginLeft:15,
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
    paddingLeft:1,
    marginRight:3,
    borderRadius: 3,
    marginBottom: 5,
  },
  headerCell:{
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
    paddingRight:20
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
    flexGrow:1, 
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
    width:100,
  },
  exportButton: {
    height: 50,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft:5,
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
