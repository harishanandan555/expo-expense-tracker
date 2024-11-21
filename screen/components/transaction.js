import React, { useState, useEffect } from 'react';
import {View, Text,StyleSheet,FlatList, TouchableOpacity, Alert, Image,} from "react-native";
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
import { doc, getDoc } from 'firebase/firestore';
import Header from './header';

const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    buttonBackground: '#ffffff', 
    buttonBorder: '#333',
    buttonText: '#000000',
    tableHeaderBackground: '#ffffff',
    tableHeaderText: '#000000',
    transactionBackground: '#ffffff',
    transactionText: '#000000',
  
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    buttonBackground: '#333',
    buttonText: '#ffffff',
    tableHeaderBackground: '#333',
    tableHeaderText: '#ffffff',
    transactionBackground: '#121212',
    transactionText: '#ffffff',
  },
};

// const generateHtml = (transactionsData) =>{
//   let transactionHtml = transactionsData.map((transaction) =>
//  <tr>
//   <td style="padding: 10px;">${transaction.date}</td>
//   <td style="padding: 10px;">${transaction.type}</td>
//   <td style="padding: 10px;">${transaction.description}</td>
//   <td style="padding: 10px;">${transaction.amount}</td>
//   <td style="padding: 10px;">${transaction.category}</td>
//   {/* <td style="padding: 10px;">${transaction.icon}</td> */}
//   </tr>

//   ).join('');

//   return `
//   <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
//     </head>
//     <body style="text-align: center; font-family: Helvetica Neue;">
//       <h1 style="font-size: 40px; font-weight: normal;">Transaction Report</h1>
//       <table style="width: 80%; margin: 0 auto; border-collapse: collapse;">
//         <thead>
//           <tr>
//             <th style="padding: 10px;">Date</th>
//             <th style="padding: 10px;">Type</th>
//             <th style="padding: 10px;">Description</th>
//             <th style="padding: 10px;">Amount</th>
//             <th style="padding: 10px;">Category</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${transactionHtml}
//         </tbody>
//       </table>
//     </body>
//   </html>
// `;
// }

const TransactionScreen = () => {
  const [theme, setTheme] = useState('dark');
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedType, setSelectedType] = useState("Type");
  // const [transactionsData, setTransactionsData] = useState([]); 
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noTransactionsMessage, setNoTransactionsMessage] = useState("");
  const [transactionsFound, setTransactionsFound] = useState(true);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [transactionsData, setTransactionsData] = useState([]);
  const [selectedExportOption, setSelectedExportOption] = useState("");
  const [transactionTypes, setTransactionTypes] = useState(['Type', 'Income', 'Expense']);
  const [categories, setCategories] = useState(['Category']);
  
  const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       fetchTransactions(user.uid);
  //     } else {
  //       setTransactionsData([]);
  //     }
  //   });
  
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        fetchTransactions(user.uid);
        if (userDoc.exists()) {
          const transactions = userDoc.data().transactions || [];
          setTransactionsData(transactions);
        }
      } else {
        setTransactionsData([]);
      }
    });
    return unsubscribe;
  }, []);


  const fetchTransactions = async (uid) => {
    try {
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
  
      console.log("Fetched transactions in fetchTransactions fn:", allTransactions);
      // Extract unique categories and transaction types
      const uniqueCategories = [...new Set(allTransactions.map(item => item.category))];
      const uniqueTransactionTypes = ['Type', 'Income', 'Expense'];
      
      setTransactionsData(allTransactions);
      setCategories(uniqueCategories);
      setTransactionTypes(uniqueTransactionTypes);
        // const formattedTransactions = allTransactions.map(item => ({
        //   ...item,
        //   date: new Date(item.timestamp.seconds * 1000).toLocaleString(),
        // }));
  
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
    }
  };
  
   // Determine colors based on the theme
   const isDarkMode = theme === 'dark';
   const backgroundColor = isDarkMode ? '#000' : '#fff';
   const textColor = isDarkMode ? '#fff' : '#000';

  const showDatePicker = () => {setDatePickerVisibility(true);};
  const hideDatePicker = () => {setDatePickerVisibility(false); };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleConfirm = (date) => {
    const formattedDate = format(date, "dd-MM-yyyy");
    const filteredTransactions = transactionsData.filter(
      (transaction) => transaction.date === formattedDate
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
      const transactionDate = transaction.date; // Ensure this is in the correct format
      return (
        (selectedCategory === "Category" || transaction.category === selectedCategory) &&
        (selectedType === "Type" || transaction.type === selectedType) &&
        (selectedDate ? transactionDate === selectedDate : true)
      );
    });
  
    console.log("Filtered transactions:", filtered); // Debugging line
    return filtered;
  };

  const deleteTransaction = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () =>
            setTransactionsData(transactionsData.filter((transaction) => transaction.id !== id)),
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionCategory}>{item.category}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionType}>{item.type}</Text>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
      <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
        <Icon name="delete" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = () => {
    setSelectedCategory("Category");
    setSelectedType("Type");
    setSelectedDate(null);
    setNoTransactionsMessage("");
    setTransactionsFound(true);
  };

  const exportToCSV = async () => {
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

    const csvData = [
      ["Category", "Description", "Date", "Type", "Amount"],
      ...filteredTransactions.map((transaction) => [
        transaction.category,
        transaction.description,
        transaction.date,
        transaction.type,
        transaction.amount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const fileUri = `${FileSystem.documentDirectory}transactions.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csvData);

  // const downloadsDir = FileSystem.documentDirectory + 'Downloads';
  // const newFileUri = `${downloadsDir}/transactions.csv`;

  // await FileSystem.moveAsync({
  //   from: fileUri,
  //   to: newFileUri,
  // });

    await MediaLibrary.createAssetAsync(fileUri);
    Alert.alert("CSV Exported", "Your transactions have been exported to CSV and saved in your media library.");
  };

  const generateHtml = (transactionsData) => {
    if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
      return `<html><body><h1>No transactions available</h1></body></html>`;
    }
  
    let transactionHtml = transactionsData.map((transaction) => `
      <tr>
        <td style="padding: 10px;">${transaction.category || 'N/A'}</td>
        <td style="padding: 10px;">${transaction.type || 'N/A'}</td>
        <td style="padding: 10px;">${transaction.date || 'N/A'}</td>
        <td style="padding: 10px;">${transaction.description || 'N/A'}</td>
        <td style="padding: 10px;">${transaction.amount || 'N/A'}</td>
      </tr>
    `).join('');
  
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="text-align: center; font-family: Helvetica Neue;">
          <h1 style="font-size: 40px; font-weight: normal;">Transaction Report</h1>
          <table style="width: 80%; margin: 0 auto; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 10px;">Date</th>
                <th style="padding: 10px;">Type</th>
                <th style="padding: 10px;">Description</th>
                <th style="padding: 10px;">Amount</th>
                <th style="padding: 10px;">Category</th>
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
    const html = generateHtml(initialTransactionsData);
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
      <View style={[styles.container, { backgroundColor: themes[theme].background }]}>
        
        {/* Header Section */}
        <Header isDarkMode={theme === "dark"} toggleTheme={toggleTheme} navigation={navigation} />
        <View style={styles.transactionsContainer}>
        <Text style={[styles.headerTitle, { color: themes[theme].text }]}> Transactions History</Text>

        {/* Filter Section */}
          <View style={styles.filterContainer}>
            <View style={styles.pickerContainer}>
              <Picker  selectedValue={selectedCategory} onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={[ styles.picker,
                  { 
                  backgroundColor: themes[theme].buttonBackground,
                  borderColor: themes[theme].buttonBorder,color: themes[theme].text
                }]}
                dropdownIconColor={theme === 'dark' ? 'white' : 'black'}
                >
                <Picker.Item label="Categories" value="Category" />
                {categories.map((category) => (
                  <Picker.Item
                   key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedType} onValueChange={(itemValue) => setSelectedType(itemValue)}
              style={[ styles.picker, {
                  backgroundColor: themes[theme].buttonBackground,
                  borderColor: themes[theme].buttonBorder,
                  color: themes[theme].text,
                },
              ]}
              dropdownIconColor={theme === 'dark' ? 'white' : 'black'}
            >
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
                  backgroundColor: themes[theme].buttonBackground,
                  borderColor: themes[theme].buttonBorder,
                  color: themes[theme].text,
                },
              ]}
              dropdownIconColor={theme === 'dark' ? 'white' : 'black'}
            >
              <Picker.Item label="Export" value="" />
              <Picker.Item label="CSV" value="CSV" />
              <Picker.Item label="PDF" value="PDF" />
            </Picker>
          </View>

          {/* Date Picker Button */}
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              {
                backgroundColor: themes[theme].buttonBackground,
                borderColor: themes[theme].buttonBorder,
              },
            ]}
            onPress={showDatePicker}
          >
            <Text style={[  styles.datePickerText, { color: themes[theme].buttonText }]}>
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

        {/* No Transactions Message */}
        {/* {noTransactionsMessage && !transactionsFound ? (
            <View style={styles.noTransactionsContainer}>
              <Text style={[styles.noTransactionsText, { color: themes[theme].text }]}>
                {noTransactionsMessage}
              </Text>
            </View>
          ) : null} */}

        {/* Transactions Table Header */}
        <View style={[ styles.tableHeader,  { backgroundColor: themes[theme].tableHeaderBackground }]}>
          <Text style={[  styles.headerText,{ color: themes[theme].tableHeaderText }, ]}>Category</Text>
          <Text style={[ styles.headerText,{ color: themes[theme].tableHeaderText }, ]}>Description</Text>
          <Text  style={[ styles.headerText, { color: themes[theme].tableHeaderText }, ]}> Date </Text>
          <Text  style={[ styles.headerText,  { color: themes[theme].tableHeaderText },  ]}>Type </Text>
          <Text  style={[ styles.headerText,   { color: themes[theme].tableHeaderText },]}>Amount </Text>
          <TouchableOpacity>
            <Icon name="more-horiz"size={24} color={themes[theme].tableHeaderText}/>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {filterTransactions().length > 0 ? (
        <FlatList
          data={filterTransactions()}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noTransactionsContainer}>
        <Text style={[styles.noTransactionsText, { color: themes[theme].text }]}>
          No transactions found.
        </Text>
      </View>
      )}
        {/* {userEmail === "roopashree_v@bullbox.in" ? (
        filterTransactions().length > 0 ? (
        <FlatList  data={filterTransactions()} keyExtractor={(item) => item.id}  renderItem={({ item }) => (
            <View style={[ styles.transactionItem,{ backgroundColor: themes[theme].transactionBackground },]}>
              <Text  style={[ styles.transactionCategory,{ color: themes[theme].transactionText },]} >
                {item.category}
              </Text>
              <Text  style={[  styles.transactionDescription,{ color: themes[theme].transactionText },]} >
                {item.description}
              </Text>
              <Text  style={[ styles.transactionDate,{ color: themes[theme].transactionText },]} >
                {item.date}
              </Text>
              <Text style={[  styles.transactionType, { color: themes[theme].transactionText },]} >
                {item.type}
              </Text>
              <Text style={[ styles.transactionAmount, { color: themes[theme].transactionText },]}>
                {item.amount}
              </Text>
              <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
                <Icon name="delete" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noTransactionsContainer }>
        <Text style={[  styles.noTransactionsText, { color: themes[theme].text }]}>
          No transactions found.
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    )
  ) : (
        <Text style={styles.noAccessMessage}>
          You do not have access to view transactions.
        </Text>
      )} */}
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
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
    height:40
  },
  datePickerButton: {
    flex: 1,
    height: 52,
    marginLeft:5,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, 
  },
  datePickerText: {
    color: "#fff",
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
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1, 
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    minWidth: 50,
    paddingRight: 5,
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
  transactionCategory: {
    color: "#fff",
    flex: 1,
  },
  transactionDescription: {
    color: "#fff",
    flex: 1,
    minWidth: 10,
    paddingLeft: 10,
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
    paddingBottom: 20,
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
});

export default TransactionScreen;
