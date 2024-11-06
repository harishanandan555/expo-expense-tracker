import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Avatar, Menu, Divider, Provider } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
// import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../config/firebaseConfig";


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

const categories = ["Category", "Salary", "Grocery"];
const transactionTypes = ["Type", "Income", "Expense"];

const TransactionScreen = () => {
  const [theme, setTheme] = useState('dark');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedType, setSelectedType] = useState("Type");
  const [transactionsData, setTransactionsData] = useState(
    initialTransactionsData
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noTransactionsMessage, setNoTransactionsMessage] = useState("");
  const [transactionsFound, setTransactionsFound] = useState(true);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigation = useNavigation();

   // Determine colors based on the theme
   const isDarkMode = theme === 'dark';
   const backgroundColor = isDarkMode ? '#000' : '#fff';
   const textColor = isDarkMode ? '#fff' : '#000';

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleThemeSwitch = (mode) => {
    setTheme(mode);
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.navigate("signin")
      // Optionally, navigate back to the login screen
    } catch (error) {
      console.log(error)
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
        <Image
            source={require("../../assets/wallet_logo.png")}
            style={styles.logo}
          ></Image>
          {/* <Text style={styles.headerTitle}>Transactions History</Text> */}
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            style={{size:50}}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Avatar.Text size={45} label="R" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                handleThemeSwitch("light");
                closeMenu();
              }}
              title="Light"
              icon="weather-sunny"
            />
            <Menu.Item
              onPress={() => {
                handleThemeSwitch("dark");
                closeMenu();
              }}
              title="Dark"
              icon="weather-night"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                handleLogout(); // Call the logout method here
                closeMenu();
              }}
              title="Logout"
              icon="logout"
            />
          </Menu>
        </View>
        <Text style={styles.headerTitle}>Transactions History</Text>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={[styles.picker, { backgroundColor: isDarkMode ? '#121212' : '#fff', color: textColor }]}
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
              style={[styles.picker, { backgroundColor: isDarkMode ? '#121212' : '#fff', color: textColor }]}
            >
              {transactionTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          {/* Date Picker Button */}
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatePicker}
          >
            <Text style={styles.datePickerText}>
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

        {/* Export CSV Button */}
        <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
          <Text style={styles.exportButtonText}>Export CSV</Text>
        </TouchableOpacity>

        {/* No Transactions Message */}
        {noTransactionsMessage && !transactionsFound ? (
          <View>
            <Text style={styles.noTransactionsText}>
              {noTransactionsMessage}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Transactions Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Category</Text>
          <Text style={styles.headerText}>Description</Text>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Type</Text>
          <Text style={styles.headerText}>Amount</Text>
          <TouchableOpacity>
            <Icon name="more-horiz" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <FlatList
          data={filterTransactions()}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    padding: 20,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom:10,
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
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    height: 50,
    backgroundColor: "#121212",
    color: "#fff",
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  datePickerText: {
    color: "#fff",
  },
  noTransactionsText: {
    color: "#FF0000",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
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
  },
  refreshButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    width:150,
  },
  exportButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: 100,
  },
  exportButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default TransactionScreen;
