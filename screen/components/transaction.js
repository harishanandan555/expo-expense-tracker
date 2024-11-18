import React, { useState, useEffect } from 'react';
import {View, Text,StyleSheet,FlatList, TouchableOpacity, Alert, Image,} from "react-native";
import { Avatar, Menu, Divider, Provider } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as MediaLibrary from "expo-media-library";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import Header from './header';

const initialTransactionsData = [
  {
    id: "1",
    date: "08-10-2024",
    type: "Income",
    description: "Paycheck",
    amount: "$2,000",
    category: "Salary",
  },
  {
    id: "2",
    date: "03-10-2024",
    type: "Income",
    description: "Salary Payment",
    amount: "$5,000",
    category: "Salary",
  },
  {
    id: "3",
    date: "08-10-2024",
    type: "Expense",
    description: "Grocery Purchase",
    amount: "$200",
    category: "Grocery",
  },
];

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

const generateHtml = (initialTransactionsData) =>{
  let transactionHtml = initialTransactionsData.map((initialTransactionsData) =>
 
 <tr>
  <td style="padding: 10px;">${initialTransactionsData.date}</td>
  <td style="padding: 10px;">${initialTransactionsData.type}</td>
  <td style="padding: 10px;">${initialTransactionsData.description}</td>
  <td style="padding: 10px;">${initialTransactionsData.amount}</td>
  <td style="padding: 10px;">${initialTransactionsData.category}</td>
  </tr>

  ).join('');

  return `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
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
}

const categories = ["Category", "Salary", "Grocery"];
const transactionTypes = ["Type", "Income", "Expense"];

const TransactionScreen = () => {
  const [theme, setTheme] = useState('dark');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedType, setSelectedType] = useState("Type");
  const [transactionsData, setTransactionsData] = useState(initialTransactionsData);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noTransactionsMessage, setNoTransactionsMessage] = useState("");
  const [transactionsFound, setTransactionsFound] = useState(true);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [selectedExportOption, setSelectedExportOption] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        if (user.email === "roopashree_v@bullbox.in") {
          setTransactionsData(initialTransactionsData);
        } else {
          setTransactionsData([]); // Clear data if user email doesn't match
        }
      } else {
        setUserEmail(null);
        setTransactionsData([]); // Clear data if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

   // Determine colors based on the theme
   const isDarkMode = theme === 'dark';
   const backgroundColor = isDarkMode ? '#000' : '#fff';
   const textColor = isDarkMode ? '#fff' : '#000';

  const showDatePicker = () => {setDatePickerVisibility(true);};

  const hideDatePicker = () => {setDatePickerVisibility(false); };

  const handleThemeSwitch = (mode) => {setTheme(mode);};

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
    return transactionsData.filter((transaction) => {
      const transactionDate = transaction.date;
      return (
        (selectedCategory === "Category" ||
          transaction.category === selectedCategory) &&
        (selectedType === "Type" || transaction.type === selectedType) &&
        (selectedDate ? transactionDate === selectedDate : true)
      );
    });
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
            setTransactionsData(
              transactionsData.filter((transaction) => transaction.id !== id)
            ),
        },
      ]
    );
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
    // Request permission to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "You need to enable permission to save files."
      );
      return;
    }

    const filteredTransactions = filterTransactions();
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

    const asset = await MediaLibrary.createAssetAsync(fileUri);
    Alert.alert(
      "CSV Exported",
      "Your transactions have been exported to CSV and saved in your media library."
    );
  };

  // const generateHtml = () => {
  //   const filteredTransactions = filterTransactions();
  //   let htmlContent = `
  //     <html>
  //       <head>
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //       </head>
  //       <body style="text-align: center;">
  //         <h1 style="font-size: 30px;">Transaction Report</h1>
  //         <table style="width: 100%; border-collapse: collapse;">
  //           <thead>
  //             <tr>
  //               <th style="border: 1px solid #000; padding: 8px;">Category</th>
  //               <th style="border: 1px solid #000; padding: 8px;">Description</th>
  //               <th style="border: 1px solid #000; padding: 8px;">Date</th>
  //               <th style="border: 1px solid #000; padding: 8px;">Type</th>
  //               <th style="border: 1px solid #000; padding: 8px;">Amount</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //   `;

  //   filteredTransactions.forEach(transaction => {
  //     htmlContent += `
  //       <tr>
  //         <td style="border: 1px solid #000; padding: 8px;">${transaction.category}</td>
  //         <td style="border: 1px solid #000; padding: 8px;">${transaction.description}</td>
  //         <td style="border: 1px solid #000; padding: 8px;">${transaction.date}</td>
  //         <td style="border: 1px solid #000; padding: 8px;">${transaction.type}</td>
  //         <td style="border: 1px solid #000; padding: 8px;">${transaction.amount}</td>
  //       </tr>
  //     `;
  //   });

  //   htmlContent += `
  //           </tbody>
  //         </table>
  //       </body>
  //     </html>
  //   `;

  //   return htmlContent;
  // };

  // const print = async () => {
  //   const html = generateHtml();
  //   await Print.printAsync({ html });
  // };

  // const printToFile = async () => {
  //   const html = generateHtml();
  //   const { uri } = await Print.printToFileAsync({ html });
  //   console.log('File has been saved to:', uri);
  //   await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  // };
  
  // const exportToPDF = async () =>{
  //   const filteredTransactions = filterTransactions();

  //   if (filteredTransactions.length === 0) {
  //     Alert.alert("No Data", "No transactions found to export.");
  //     return;
  //   }

  //   let htmlContent = `
  //   <h1>Transaction Report</h1>
  //   <table style="width: 100%; border-collapse: collapse;">
  //     <thead>
  //       <tr>
  //         <th style="border: 1px solid #000; padding: 8px;">Category</th>
  //         <th style="border: 1px solid #000; padding: 8px;">Description</th>
  //         <th style="border: 1px solid #000; padding: 8px;">Date</th>
  //         <th style="border: 1px solid #000; padding: 8px;">Type</th>
  //         <th style="border: 1px solid #000; padding: 8px;">Amount</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  // `;

  // filteredTransactions.forEach(transaction => {
  //   htmlContent += `
  //     <tr>
  //       <td style="border: 1px solid #000; padding: 8px;">${transaction.category}</td>
  //       <td style="border: 1px solid #000; padding: 8px;">${transaction.description}</td>
  //       <td style="border: 1px solid #000; padding: 8px;">${transaction.date}</td>
  //       <td style="border: 1px solid #000; padding: 8px;">${transaction.type}</td>
  //       <td style="border: 1px solid #000; padding: 8px;">${transaction.amount}</td>
  //     </tr>
  //   `;
  // });

  // htmlContent += `
  //     </tbody>
  //   </table>
  // `;

  // // Generate PDF
  // const options = {
  //   html: htmlContent,
  //   fileName: 'transactions',
  //   directory: 'Documents',
  // };

  // let file = await RNHTMLtoPDF.convert(options);
  // Alert.alert("PDF Created", `Your transactions have been exported to PDF: ${file.filePath}`);
  // }

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
    const html = generateHtml(initialTransactionsData);
    try {
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
    setSelectedExportOption(option);
    if (option === "CSV") {
      exportToCSV();
    } else if (option === "PDF") {
      printToFile();
    }
  };

  return (
    <Provider>
      <View style={[ styles.container,  { backgroundColor: themes[theme].background },]}>
        
        {/* Header Section */}
        <Header
          isDarkMode={theme === "dark"}
          toggleTheme={toggleTheme}
          navigation={navigation}
        />

        <Text style={[styles.headerTitle, { color: themes[theme].text }]}>
          Transactions History
        </Text>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={[
                styles.picker,
                {
                  backgroundColor: themes[theme].buttonBackground,
                  borderColor: themes[theme].buttonBorder,
                  color: themes[theme].text,
                },
              ]}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
              style={[
                styles.picker,
                {
                  backgroundColor: themes[theme].buttonBackground,
                  borderColor: themes[theme].buttonBorder,
                  color: themes[theme].text,
                },
              ]}
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
            <Picker
              selectedValue={selectedExportOption}
              onValueChange={handleExportOption}
              style={[
                styles.picker,
                {
                  backgroundColor: themes[theme].buttonBackground,
                  borderColor: themes[theme].buttonBorder,
                  color: themes[theme].text,
                },
              ]}
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
            <Text
              style={[
                styles.datePickerText,
                { color: themes[theme].buttonText },
              ]}
            >
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
        {noTransactionsMessage && !transactionsFound ? (
          <View style={styles.noTransactionsContainer}>
            <Text style={[styles.noTransactionsText, { color: themes[theme].text }]} >
              {noTransactionsMessage}
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Transactions Table Header */}
        <View style={[ styles.tableHeader,  { backgroundColor: themes[theme].tableHeaderBackground }]}>
          <Text
            style={[
              styles.headerText,
              { color: themes[theme].tableHeaderText },
            ]}
          >
            Category
          </Text>
          <Text
            style={[
              styles.headerText,
              { color: themes[theme].tableHeaderText },
            ]}
          >
            Description
          </Text>
          <Text
            style={[
              styles.headerText,
              { color: themes[theme].tableHeaderText },
            ]}
          >
            Date
          </Text>
          <Text
            style={[
              styles.headerText,
              { color: themes[theme].tableHeaderText },
            ]}
          >
            Type
          </Text>
          <Text
            style={[
              styles.headerText,
              { color: themes[theme].tableHeaderText },
            ]}
          >
            Amount
          </Text>
          <TouchableOpacity>
            <Icon
              name="more-horiz"
              size={24}
              color={themes[theme].tableHeaderText}
            />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {userEmail === "roopashree_v@bullbox.in" ? (
        filterTransactions().length > 0 ? (
        <FlatList
          data={filterTransactions()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.transactionItem,
                { backgroundColor: themes[theme].transactionBackground },
              ]}
            >
              <Text
                style={[
                  styles.transactionCategory,
                  { color: themes[theme].transactionText },
                ]}
              >
                {item.category}
              </Text>
              <Text
                style={[
                  styles.transactionDescription,
                  { color: themes[theme].transactionText },
                ]}
              >
                {item.description}
              </Text>
              <Text
                style={[
                  styles.transactionDate,
                  { color: themes[theme].transactionText },
                ]}
              >
                {item.date}
              </Text>
              <Text
                style={[
                  styles.transactionType,
                  { color: themes[theme].transactionText },
                ]}
              >
                {item.type}
              </Text>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: themes[theme].transactionText },
                ]}
              >
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
      )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: "#000",
  },
  // header: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   // marginBottom: 10,
  // },
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
  backgroundColor: '#6200ee', // Customize avatar color
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
    // borderRadius: 5,
    borderWidth: 1, 
  },  
  picker: {
    height: 50,
    backgroundColor: "#333",
    borderWidth: 1, 
  },
  datePickerButton: {
    flex: 1,
    height: 52,
    marginLeft:5,
    backgroundColor: "#333",
    // padding: 10,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 5,
    borderWidth: 1, 
    // marginBottom: 10,
  },
  datePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    // paddingLeft: 5,
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
    width:150,
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
