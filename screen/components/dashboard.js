import React, { useState, useEffect, } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Dimensions, Image,
    FlatList,

} from 'react-native';
import { auth, db } from "../../config/firebaseConfig";
import { ProgressBar } from "react-native-paper"; // For a Progress bar
import { useFocusEffect } from '@react-navigation/native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

import { Separator } from "../ui/separator";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import DropDownPicker from "react-native-dropdown-picker";
import { getUserById } from '../services/firebaseSettings';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar, Menu, Divider, Provider } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // Use date-fns for formatting dates
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { doc, setDoc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { BarChart } from 'react-native-gifted-charts';
const DashboardScreen = ({ theme }) => {


    const [menuVisible, setMenuVisible] = useState(false);
    const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);
    const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [activeButton, setActiveButton] = useState('income');
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [isCreateCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGraph, setSelectedGraph] = useState(null); // Default to null for showing all data

    const navigation = useNavigation();
    const [firebaseBalance, setFirebaseBalance] = useState(0);
    const [firebaseTotalIncome, setFirebaseTotalIncome] = useState(0);
    const [firebaseTotalExpense, setFirebaseTotalExpense] = useState(0);
    const [firebaseLastUpdated, setFirebaseLastUpdated] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);

    const [IncomeCategory, setIncomeCategory] = useState([]); // State to store the income data
    const [currency, setCurrency] = useState({ value: 'USD', label: '$ Dollar', locale: 'en-US' });

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "January", value: "January" },
        { label: "February", value: "February" },
        { label: "March", value: "March" },
        { label: "April", value: "April" },
        { label: "May", value: "May" },
        { label: "June", value: "June" },
        { label: "July", value: "July" },
        { label: "August", value: "August" },
        { label: "September", value: "September" },
        { label: "October", value: "October" },
        { label: "November", value: "November" },
        { label: "December", value: "December" },
    ]);

    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const [lastUpdated, setLastUpdated] = useState("");
    const [isExpenseEmojiPickerVisible, setExpenseEmojiPickerVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const screenWidth = Dimensions.get('window').width;
    const [tooltip, setTooltip] = useState(null); // State to manage tooltip
    const maxValue = Math.max(totalIncome, totalExpense, balance);
    const yAxisStep = Math.ceil(maxValue / 5);

    const toggleGraph = (graphType) => {
        setSelectedGraph(graphType); // Update selected graph
    };
    const [userInfos, setUserInfos] = useState(null);

    const route = useRoute();
    const [expenses, setExpenses] = useState([]);
    const data = {
        labels: ['Income', 'Expense', 'Balance'],
        datasets: [
            {
                data: [totalIncome, totalExpense, balance],
                colors: [
                    () => `rgba(34, 197, 94, 0.9)`, // Green
                    () => `rgba(220, 38, 38, 0.9)`, // Red
                    () => `rgba(75, 85, 99, 0.9)`, // Gray
                ],
            },
        ],
    };
    useFocusEffect(
        React.useCallback(() => {
            const fetchCurrency = async () => {
                try {
                    const storedCurrency = await AsyncStorage.getItem('selectedCurrency');

                    if (storedCurrency) {
                        setCurrency(JSON.parse(storedCurrency));
                    }

                } catch (error) {
                    console.error('Error fetching currency:', error);
                }
            };

            fetchCurrency();
        }, [])
    );


    // Chart configuration

    const absoluteBalance = Math.abs(balance);
    const barData = [
        {
            value: totalIncome,
            label: 'Income',
            frontColor: 'green', // Green
        },
        {
            value: totalExpense,
            label: 'Expense',
            frontColor: 'red', // Red
        },
        {
            value: absoluteBalance,
            label: 'Balance',
            frontColor: 'blue', // Blue
        },
    ];



    // Function to handle theme switching
    const handleThemeSwitch = (mode) => {
        setTheme(mode);
    };
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const storedUserInfo = await AsyncStorage.getItem("userInfo");
                if (storedUserInfo) {
                    setUserInfos(storedUserInfo ? JSON.parse(storedUserInfo) : {});
                } else {
                    console.log("No User Info found.");
                }
            } catch (error) {
                console.error("Error retrieving user info:", error);
            }
        };

        fetchUserInfo();
    }, []);
    const calculateAndSaveFinancialData = () => {
        const userId = auth.currentUser?.uid;

        if (!userId) {
            console.error("User ID is required. Cannot update financial data.");
            return;
        }

        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "users", userId);

        // Set up real-time listener
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {

            if (docSnapshot.exists()) {
                const userInfo = docSnapshot.data();

                const financialData = userInfo.financialData || {};
                const lastUpdatedTime = financialData.lastUpdated || "Not Available";

                // Calculate total income
                const calculatedTotalIncome = (userInfo.income || []).reduce(
                    (sum, incomeItem) => sum + (incomeItem.amount || 0),
                    0
                );

                // Calculate total expenses
                const calculatedTotalExpense = (userInfo.expenses || []).reduce(
                    (sum, expenseItem) => sum + (expenseItem.amount || 0),
                    0
                );

                // Calculate the balance
                const calculatedBalance = calculatedTotalIncome - calculatedTotalExpense;

                // Update the state variables
                setTotalIncome(calculatedTotalIncome);
                setTotalExpense(calculatedTotalExpense);
                setBalance(calculatedBalance);
                setLastUpdated(lastUpdatedTime);

                console.log("Updated financial data:", {
                    totalIncome: calculatedTotalIncome,
                    totalExpense: calculatedTotalExpense,
                    balance: calculatedBalance,
                    lastUpdated: lastUpdatedTime,
                });
            } else {
                console.error("User document does not exist.");
            }
        }, (error) => {
            console.error("Error listening to user financial data:", error);
        });

        // Return unsubscribe function to clean up the listener when no longer needed
        return unsubscribe;
    };




    const fetchIncomeData = () => {
        try {
            const id = auth.currentUser?.uid; // Get the user ID

            if (!id) {
                console.error("User ID is required.");
                return;
            }



            // Reference to the user's Firestore document
            const userDocRef = doc(db, "users", id);

            // Set up real-time listener
            const unsubscribe = onSnapshot(
                userDocRef,
                (docSnapshot) => {
                    try {
                        if (docSnapshot.exists()) {
                            const userInfo = docSnapshot.data();

                            if (userInfo && userInfo.income) {
                                // Transform income data into a usable structure
                                const incomeData = userInfo.income.map((item) => ({
                                    category: item.category,
                                    amount: item.amount,
                                    date: item.date,
                                    description: item.description,
                                    icon: item.icon || "💰", // Default icon if none is provided
                                }));

                                // Update the state with the new income data
                                setIncomeCategory(incomeData);
                            } else {
                                // console.error("No income data found for this user.");
                                setIncomeCategory([]); // Reset to empty if no data is found
                            }
                        } else {
                            console.error("User document does not exist.");
                        }
                    } catch (innerError) {
                        console.error("Error processing document snapshot:", innerError);
                    }
                },
                (error) => {
                    console.error("Error listening to user document:", error);
                }
            );

            // Return unsubscribe function to clean up the listener when no longer needed
            return unsubscribe;
        } catch (error) {
            console.error("Error in fetchIncomeData:", error);
        }
    };


    const fetchExpenseData = () => {
        try {
            const id = auth.currentUser?.uid; // Get the user ID

            if (!id) {
                console.error("User ID is required.");
                return;
            }

            // Reference to the user's Firestore document
            const userDocRef = doc(db, "users", id);

            // Set up real-time listener
            const unsubscribe = onSnapshot(
                userDocRef,
                (docSnapshot) => {
                    try {
                        if (docSnapshot.exists()) {
                            const userInfo = docSnapshot.data();

                            if (userInfo && userInfo.expenses) {
                                // Transform expenses data into a usable structure
                                const expenseData = userInfo.expenses.map((item) => ({
                                    category: item.category,
                                    amount: item.amount,
                                    date: item.date,
                                    description: item.description,
                                    icon: item.icon || "💸", // Default icon if none is provided
                                }));

                                // Update the state with the new expense data
                                setExpenses(expenseData);
                            } else {
                                console.error("No expense data found for this user.");
                                setExpenses([]); // Reset to empty if no data is found
                            }
                        } else {
                            console.error("User document does not exist.");
                        }
                    } catch (innerError) {
                        console.error("Error processing document snapshot:", innerError);
                    }
                },
                (error) => {
                    console.error("Error listening to user document:", error);
                }
            );

            // Return unsubscribe function to clean up the listener when no longer needed
            return unsubscribe;
        } catch (error) {
            console.error("Error in fetchExpenseData:", error);
        }
    };










    const toggleIncomeModals = () => {
        navigation.navigate('NewIncome', { type: 'income' });
    };

    // Navigate to NewExpense screen
    const toggleExpenseModals = () => {
        navigation.navigate('NewExpense', { type: 'expense' });
    };

    const openCategoryModal = () => {
        setCategoryModalVisible(true);
    };

    const openCreateCategoryModal = () => {
        setCategoryModalVisible(false);
        setCreateCategoryModalVisible(true);
    };




    const handleSaveCategory = () => {
        if (newCategory && selectedIcon) {
            // Save the new category (this is for demonstration; you may save it in a state)
            setCreateCategoryModalVisible(false);
        }
    };




    const closeModals = () => {
        setIncomeModalVisible(false);
        setExpenseModalVisible(false);
        setCategoryModalVisible(false);
        setCreateCategoryModalVisible(false);
    };










    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                "622095554406-32i6saoa7sn60bu32n33f4um21ep2i65.apps.googleusercontent.com",
        });
    }, []);



    const userInfo = route.params?.userInfo;

    useEffect(() => {
        if (userInfo) {
            console.log("User Info in Dashboard:", userInfo); // Log to confirm data
        } else {
            console.log("No User Info received");
        }
    }, [userInfo]);

    // Fetch income and expense data









    // Extracting user initials

    useEffect(() => {
        const fetchData = async () => {
            await fetchIncomeData();
            await fetchExpenseData();
            await calculateAndSaveFinancialData();
        };
        fetchData();
    }, []);



    // Determine colors based on the theme
    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? '#000' : '#fff';

    const textColor = isDarkMode ? '#fff' : '#000';

    const modalTextColor = isDarkMode ? '#fff' : '#000';
    // Function to format the date


    return (
        <Provider>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.newIncomeButton,
                        {
                            backgroundColor:
                                activeButton === 'income' ? (isDarkMode ? '#FF6A00' : '#FF8C00') : backgroundColor,
                            borderColor: '#FF6A00',
                        },
                    ]}
                    onPress={toggleIncomeModals}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { color: activeButton === 'income' ? backgroundColor : isDarkMode ? '#FF6A00' : '#FF8C00' },
                        ]}
                    >
                        New income
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.newExpenseButton,
                        {
                            // backgroundColor: activeButton === 'expense' ? (isDarkMode ? '#FF6A00' : '#FF8C00') : backgroundColor,
                            backgroundColor: theme.cardBackground,
                            borderColor: '#FF6A00',
                        },
                    ]}
                    onPress={toggleExpenseModals}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { color: theme.text },
                            // { color: activeButton === 'expense' ? "black" : 'black' },
                        ]}
                    >
                        New Expense
                    </Text>
                </TouchableOpacity>
            </View>

            {/* <Separator theme={theme} /> */}

            <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}>

                {/* Top Upgrade Bar */}
                {/* <View style={[styles.upgradeBar, { backgroundColor: '#FF8C00' }]}>
                    <Text style={[styles.upgradeText, { color: theme.text }]}>Upgrade to premium user</Text>
                </View> */}

                {/* New Income and New Expense Buttons */}
                {/* <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.newIncomeButton,
                            {
                                backgroundColor:
                                    activeButton === 'income' ? (isDarkMode ? '#FF6A00' : '#FF8C00') : backgroundColor,
                                borderColor: '#FF6A00',
                            },
                        ]}
                        onPress={toggleIncomeModals}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: activeButton === 'income' ? backgroundColor : isDarkMode ? '#FF6A00' : '#FF8C00' },
                            ]}
                        >
                            New income
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.newExpenseButton,
                            {
                                backgroundColor:
                                    activeButton === 'expense' ? (isDarkMode ? '#FF6A00' : '#FF8C00') : backgroundColor,
                                borderColor: '#FF6A00',
                            },
                        ]}
                        onPress={toggleExpenseModals}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: activeButton === 'expense' ? "black" : 'black' },
                            ]}
                        >
                            New Expense
                        </Text>
                    </TouchableOpacity>
                </View> */}


                {/* Overview Section */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>

                {/* <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePickerWrapper}>
                        <Text style={[styles.dateText, { color: textColor }]}>
                            {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} style={styles.arrowIcon} />
                    </TouchableOpacity> */}


                {/* Date Picker Modal */}

                {/* <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => {
                        setStartDate(date);
                        setDatePickerVisible(false);
                    }}
                    onCancel={() => setDatePickerVisible(false)}
                />


                <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => {
                        setEndDate(date);
                        setEndDatePickerVisible(false);
                    }}
                    onCancel={() => setEndDatePickerVisible(false)}
                /> */}
                {/* Income, Expense, Balance Cards */}

                <View style={[styles.overviewCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
                        <MaterialIcons name="trending-up" size={32} color="green" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.overviewLabel, { color: theme.text }]}> Income </Text>
                        <Text style={[styles.overviewValue, { color: theme.text }]}> {currency.label.split(' ')[0]}{totalIncome || 0} </Text>
            </View>
        </View>

        <View style={[styles.overviewCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={[styles.iconContainer, { backgroundColor: '#ffebee' }]}>
                        <MaterialIcons name="trending-down" size={32} color="red" />
        </View>
        <View style={styles.textContainer}>
            <Text style={[styles.overviewLabel, { color: theme.text }]}>Expense</Text>
            <Text style={[styles.overviewValue, { color: theme.text }]}>
                {currency.label.split(' ')[0]}{totalExpense || 0}
            </Text>
        </View>
    </View>

        <View style={[styles.overviewCard, { backgroundColor: theme.cardBackground }]}>

            <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                <MaterialIcons name="account-balance-wallet" size={32} color="blue" />
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.overviewLabel, { color: theme.text }]}>Balance</Text>
                <Text style={[styles.overviewValue, { color: theme.text }]}>{currency.label.split(' ')[0]}{balance || 0}</Text>
            </View>

        </View>

    {/* <Separator theme={theme} /> */ }

    <Card theme={theme}>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Income</Text>
        {/* <View style={ { backgroundColor: theme.background,  }}> */}
        <View >
            {IncomeCategory.length === 0 ? (
                <>
                    <Text style={[styles.noDataText, { color: theme.text }]}>No income data available.</Text>
                    <Text style={styles.noDataSubtext}>Add new income to see details.</Text>
                </>
            ) : (


                                <View style={[styles.sectionContainer]}>
                                        {Object.values(
                                            IncomeCategory.reduce((acc, curr) => {
                                                if (!acc[curr.category]) {
                                                    acc[curr.category] = { ...curr, amount: 0 }; // Initialize with category data
                                                }
                                                acc[curr.category].amount += curr.amount; // Aggregate the amounts
                                                return acc;
                                            }, {})
                                        ).map((item, index) => {
                                            const totalIncome = IncomeCategory.reduce((sum, income) => sum + income.amount, 0);

                                            const amount = item.amount || 0;
                                            const percentage = totalIncome ? (amount / totalIncome) * 100 : 0;

                                            return (
                                                <View key={index} style={[styles.listItem,]}>
                                                    <View style={styles.itemHeader}>
                                                        <Text style={[styles.emoji, { color: theme.text }]}>{item.icon}</Text>
                                                        <Text style={[styles.itemCategory, { color: theme.text, marginLeft: -60 }]} >{item.category}</Text>
                                                        <Text style={[styles.percentageText, { color: theme.text, marginLeft: -40 }]}>({percentage.toFixed(0)}%){" "} </Text>


                                                        <Text style={[styles.amountText, { color: theme.text }]}>
                                                            {currency.label.split(' ')[0]}{amount.toFixed(2)}
                                                        </Text>
                                                    </View>
                                                    <ProgressBar
                                                        progress={percentage / 100}
                                                        color="#10B981" // Green for income
                                                        style={styles.fullWidthProgressBar}
                                                    />
                                                </View>
                                            );
                                        })}

                                </View>


                        )}
                    </View >
                </Card >

                <Card theme={theme}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Expense</Text>
                        <View >
                            {expenses.length === 0 ? (
                                // Display this message if there is no data
                                <>
                                    <Text style={[styles.noDataText, { color: theme.text }]}>No data for the selected period.</Text>
                                    <Text style={styles.noDataSubtext}>Try to select a different period or add expenses.</Text>
                                </>
                            ) : (

                                <View style={[styles.sectionContainer]}>

                                    {Object.values(
                                        expenses.reduce((acc, curr) => {
                                            if (!acc[curr.category]) {
                                                acc[curr.category] = { ...curr, amount: 0 }; // Initialize with category data
                                            }
                                            acc[curr.category].amount += curr.amount; // Aggregate the amounts
                                            return acc;
                                        }, {})
                                    ).map((item, index) => {
                                        const totalIncome = expenses.reduce((sum, income) => sum + income.amount, 0);

                                        const amount = item.amount || 0;
                                        const percentage = totalIncome ? (amount / totalIncome) * 100 : 0;

                                        return (
                                        <View key={index} style={[styles.listItem,]}>
                                                            <View style={styles.itemHeader}>
                                                                <Text style={[styles.emoji, { color: theme.text, }]}>{item.icon}</Text>
                                                                <Text style={[styles.itemCategory, { color: theme.text, marginLeft: -60 }]} >{item.category}</Text>
                                                                <Text style={[styles.percentageText, { color: theme.text, marginLeft: -40 }]}>
                                                                    ({percentage.toFixed(0)}%){"   "}
                                                                </Text>


                                                                <Text style={[styles.amountText, { color: theme.text }]}>
                                                                    {currency.label.split(' ')[0]}{amount.toFixed(2)}
                                                                </Text>
                                                            </View>
                                                            <ProgressBar
                                                                progress={percentage / 100}
                                                                color="#FF0000" // Green color for progress
                                                                style={styles.fullWidthProgressBar}
                                                            />
                                                        </View>

                                                        );
                                })}
                                                </View>

                    )}

                </View>
                </Card >


    {/* <Separator theme={theme} /> */ }

{/* History Section */ }
                <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>
                <View style={[styles.historyContainer, { backgroundColor: theme.background }]}>
                    {/* Switch between Year and Month */}
                    <View style={styles.switchContainer}>
                        <View>
                            {/* <TouchableOpacity style={[styles.switchButton, { backgroundColor: theme.background }]}>
                                <Text style={[styles.switchButtonText, { color: theme.text }]}>2024</Text>
                            </TouchableOpacity> */}



                            {/* Month Selection Dropdown */}
                            {/* <View style={styles.dropdownWrapper}>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    placeholder="Select Month"
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    textStyle={styles.dropdownText}
                                    arrowIconStyle={styles.arrowIcon}
                                    listMode="SCROLLVIEW" // Enables scrolling
                                    scrollViewProps={{
                                        nestedScrollEnabled: true, // Ensure smooth scrolling within parent ScrollView
                                    }}
                                    maxHeight={300} // Set an appropriate max height for the dropdown
                                    zIndex={5000} // Ensure dropdown is displayed above other components
                                    zIndexInverse={1000}
                                    onChangeValue={(selectedMonth) => {
                                        console.log("Selected Month:", selectedMonth);
                                        setSelectedMonth(selectedMonth); // Update state
                                    }}
                                />

                            </View> */}


                        </View>
                    </View>

                    {/* Date Picker */}


                    {/* Income and Expense Toggle */}
                    <View style={[styles.toggleContainer, { backgroundColor: theme.background }]}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                styles.incomeButton,
                                selectedGraph === 'income', // Highlight if selected
                            ]}
                            onLongPress={() => setSelectedGraph('income')} // Show only Expense on long press
                            onPressOut={() => setSelectedGraph(null)} // Show only Income
                        >
                            <View style={[styles.icon, styles.incomeIcon]} />
                            <Text style={[styles.toggleText, { color: theme.text }]}>Income</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                styles.expenseButton,
                                selectedGraph === 'expense', // Highlight if selected
                            ]}
                            onLongPress={() => setSelectedGraph('expense')} // Show only Income on long press
                            onPressOut={() => setSelectedGraph(null)} // Show only Expense
                        >
                            <View style={[styles.icon, styles.expenseIcon]} />
                            <Text style={[styles.toggleText, { color: theme.text }]}>Expense</Text>
                        </TouchableOpacity>


                    </View>
                    <View
                        style={{
                            marginRight: 10,
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: theme.background, // Dark background for better contrast
                            alignItems: 'center',
                            marginVertical: 20,
                        }}
                    >
                        {selectedGraph === null && (
                            <BarChart
                                data={barData}
                                barWidth={screenWidth * 0.1}
                                renderTooltip={(item, index) => {
                                    const value = item.label === 'Balance' ? balance : item.value;
                                    return (
                                        <View
                                            style={{

                                                marginBottom: -5550,
                                                backgroundColor: '#DB7093',
                                                paddingHorizontal: 6,
                                                paddingVertical: 4,
                                                borderRadius: 4,

                                            }}>
                                            <Text style={{ color: theme.text }}> {currency.label.split(' ')[0]}{value}</Text>
                                        </View>
                                    );
                                }}
                                barBorderRadius={6}
                                yAxisThickness={1.5} // Y-axis line thickness
                                yAxisColor={theme.text} // Y-axis line color
                                xAxisThickness={2.5} // X-axis line thickness
                                xAxisColor={theme.text}
                                yAxisStepValue={5000}
                                // X-axis line color
                                noOfSections={8} // Divide y-axis into 5 sections
                                maxValue={Math.max(totalIncome, totalExpense, balance) + 1000} // Close to the highest value
                                yAxisTextStyle={{ color: theme.text, fontSize: 12 }} // Customize y-axis labels
                                xAxisLabelTextStyle={{ color: theme.text, fontSize: 12 }} // Customize x-axis labels
                                height={500} // Chart height
                                yAxisLabelContainerStyle={{
                                    marginRight: 10, // Add a gap between the Y-axis line and labels
                                }}
                                isAnimated
                                side="right"
                                barStyle={{


                                    borderWidth: 0,
                                    shadowColor: '#999',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 6,
                                    elevation: 8,
                                }}

                                initialSpacing={20}
                                barMarginBottom={5}//
                                Enable animation
                                spacing={20}

                            />
                        )}
                        {selectedGraph === 'income' && (
                            <BarChart
                                data={[
                                    { value: totalIncome, label: 'Income', frontColor: 'green' },
                                ]}
                                barWidth={screenWidth * 0.09}
                                renderTooltip={(item, index) => {
                                    const value = item.label === 'Balance' ? balance : item.value;
                                    return (
                                        <View
                                            style={{

                                                marginBottom: -5550,
                                                backgroundColor: '#DB7093',
                                                paddingHorizontal: 6,
                                                paddingVertical: 4,
                                                borderRadius: 4,

                                            }}>
                                            <Text style={{ color: theme.text }}> {currency.label.split(' ')[0]}{value}</Text>
                                        </View>
                                    );
                                }}
                                barBorderRadius={6}
                                yAxisThickness={1.5} // Y-axis line thickness
                                yAxisColor={theme.text} // Y-axis line color
                                xAxisThickness={1.5} // X-axis line thickness
                                xAxisColor={theme.text}
                                yAxisStepValue={5000}
                                // X-axis line color
                                noOfSections={8} // Divide y-axis into 5 sections
                                maxValue={Math.max(totalIncome, totalExpense, balance) + 5000} // Close to the highest value
                                yAxisTextStyle={{ color: theme.text, fontSize: 12 }} // Customize y-axis labels
                                xAxisLabelTextStyle={{ color: theme.text, fontSize: 12 }} // Customize x-axis labels
                                height={500} // Chart height
                                yAxisLabelContainerStyle={{
                                    marginRight: 10, // Add a gap between the Y-axis line and labels
                                }}
                                isAnimated
                                side="right"
                                barStyle={{


                                    borderWidth: 0,
                                    shadowColor: '#999',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 6,
                                    elevation: 8,
                                }}

                                initialSpacing={20}
                                barMarginBottom={5}//
                                Enable animation
                                spacing={20}

                            />

                        )}


                        {selectedGraph === 'expense' && (

                            <BarChart
                                data={[
                                    { value: totalExpense, label: 'Expense', frontColor: 'red' },
                                ]}
                                barWidth={screenWidth * 0.09}
                                renderTooltip={(item, index) => {
                                    const value = item.label === 'Balance' ? balance : item.value;
                                    return (
                                        <View
                                            style={{

                                                marginBottom: -5550,
                                                backgroundColor: '#DB7093',
                                                paddingHorizontal: 6,
                                                paddingVertical: 4,
                                                borderRadius: 4,

                                            }}>
                                            <Text style={{ color: theme.text }}> {currency.label.split(' ')[0]}{value}</Text>
                                        </View>
                                    );
                                }}
                                barBorderRadius={6}
                                yAxisThickness={1.5} // Y-axis line thickness
                                yAxisColor={theme.text} // Y-axis line color
                                xAxisThickness={1.5} // X-axis line thickness
                                xAxisColor={theme.text}
                                yAxisStepValue={5000}
                                // X-axis line color
                                noOfSections={6} // Divide y-axis into 5 sections
                                maxValue={Math.max(totalIncome, totalExpense, balance) + 5000} // Close to the highest value
                                yAxisTextStyle={{ color: theme.text, fontSize: 12 }} // Customize y-axis labels
                                xAxisLabelTextStyle={{ color: theme.text, fontSize: 12 }} // Customize x-axis labels
                                height={500} // Chart height
                                yAxisLabelContainerStyle={{
                                    marginRight: 10, // Add a gap between the Y-axis line and labels
                                }}
                                isAnimated
                                side="right"
                                barStyle={{


                                    borderWidth: 0,
                                    shadowColor: '#999',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 6,
                                    elevation: 8,
                                }}

                                initialSpacing={20}
                                barMarginBottom={5}//
                                Enable animation
                                spacing={20}

                            />
                        )}


                    </View>
                    {/* Modal for New Income */}
                    <Modal visible={isIncomeModalVisible} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>
                                    Add New <Text style={{ color: 'green' }}>Income</Text> Transaction
                                </Text>

                                <TextInput style={styles.input} placeholder="Transaction Description" placeholderTextColor={textColor} />
                                <Text style={[styles.optionalText, { color: theme.text }]}>Transaction Description (Optional)</Text>

                                <TextInput style={styles.input} placeholder="Put the price" placeholderTextColor={textColor} />
                                <Text style={[styles.requiredText, { color: theme.text }]}>Transaction Amount (Required)</Text>

                                {/* Category Selection */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.text }]}>Category</Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryBox,
                                            { backgroundColor: theme.background, borderColor: isDarkMode ? '#fff' : '#000' }
                                        ]}
                                        onPress={openCategoryModal}
                                    >
                                        <Text style={[styles.categoryText, { color: theme.text }]}>
                                            {selectedCategory ? `Category: {currency.label.split(' ')[0]}{selectedCategory}` : 'Select a category'}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} />
                                    </TouchableOpacity>
                                    <Text style={[styles.pickerHint, { color: theme.text }]}>Select a category for the transaction</Text>
                                </View>

                                {/* Date Picker */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.text }]}>Transaction date</Text>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { backgroundColor: theme.background }]}
                                        onPress={() => setDatePickerVisible(true)}
                                    >
                                        <Text style={[styles.pickerText, { color: theme.text }]}>{transactionDate.toLocaleDateString('en-US')}</Text>
                                        <MaterialIcons name="calendar-today" size={24} color={textColor} />
                                    </TouchableOpacity>
                                </View>

                                {/* Save and Cancel Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={closeModals}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveButton} onPress={closeModals}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal for Category Selection */}
                    <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>Select a Category</Text>

                                {/* Create New Category Button */}
                                <TouchableOpacity onPress={openCreateCategoryModal} style={styles.createNewCategoryButton}>
                                    <Text style={[styles.createNewText, { color: theme.text }]}>+ Create New</Text>
                                </TouchableOpacity>

                                {/* Cancel Button */}
                                <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={styles.smallCancelButton}>
                                    <Text style={styles.smallCancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>



                    {/* Modal for Creating New Category */}
                    <Modal visible={isCreateCategoryModalVisible} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>Create New Category</Text>

                                {/* Input for Category Name */}
                                <TextInput
                                    placeholder="Category Name"
                                    value={newCategory}
                                    onChangeText={(text) => setNewCategory(text)}
                                    style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                                    placeholderTextColor={modalTextColor}
                                />

                                {/* Icon Selection */}
                                <TouchableOpacity style={styles.emojiButton} onPress={() => setEmojiPickerVisible(true)}>
                                    <Text style={{ color: theme.text }}>{selectedIcon ? selectedIcon : 'Click To Select Icon'}</Text>
                                </TouchableOpacity>

                                {/* Save Button */}
                                <TouchableOpacity onPress={handleSaveCategory} style={[styles.niceSaveButton, { backgroundColor: isDarkMode ? '#FF6A00' : '#008F11' }]}>
                                    <Text style={[styles.niceButtonText, { color: isDarkMode ? '#fff' : '#fff' }]}>Save</Text>
                                </TouchableOpacity>

                                {/* Cancel Button */}
                                <TouchableOpacity onPress={() => setCreateCategoryModalVisible(false)} style={[styles.niceCancelButton, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]}>
                                    <Text style={[styles.niceButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    {/* Emoji Picker Modal */}
                    <Modal visible={isEmojiPickerVisible} animationType="slide" transparent={true}>
                        <View style={styles.emojiPickerContainer}>
                            {/* Replace this with your Emoji Picker component */}
                            <TouchableOpacity onPress={() => { setSelectedIcon('🙂'); setEmojiPickerVisible(false); }} style={styles.emoji}>
                                <Text style={{ fontSize: 30 }}>🙂</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEmojiPickerVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>


                    {/* Modal for New Expense */}
                    <Modal visible={isExpenseModalVisible} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>
                                    Add New <Text style={{ color: 'red' }}>Expense</Text> Transaction
                                </Text>

                                <TextInput style={styles.input} placeholder="Transaction Description" placeholderTextColor={textColor} />
                                <Text style={[styles.optionalText, { color: theme.text }]}>Transaction Description (Optional)</Text>

                                <TextInput style={styles.input} placeholder="Put the price" placeholderTextColor={textColor} />
                                <Text style={[styles.requiredText, { color: theme.text }]}>Transaction Amount (Required)</Text>

                                {/* Category Selection */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.text }]}>Category</Text>
                                    <TouchableOpacity
                                        style={[styles.categoryBox, { backgroundColor: theme.background, borderColor: isDarkMode ? '#fff' : '#000' }]}
                                        onPress={openCategoryModal}  // This opens the category selection modal
                                    >
                                        <Text style={[styles.categoryText, { color: theme.text }]}>
                                            {selectedCategory ? `Category: {currency.label.split(' ')[0]}{selectedCategory}` : 'Select a category'}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} />
                                    </TouchableOpacity>
                                    <Text style={[styles.pickerHint, { color: theme.text }]}>Select a category for the transaction</Text>
                                </View>

                                {/* Date Picker */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.text }]}>Transaction date</Text>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { backgroundColor: theme.background }]}
                                        onPress={() => setDatePickerVisible(true)}
                                    >
                                        <Text style={[styles.pickerText, { color: theme.text }]}>{transactionDate.toLocaleDateString('en-US')}</Text>
                                        <MaterialIcons name="calendar-today" size={24} color={textColor} />
                                    </TouchableOpacity>
                                </View>

                                {/* Save and Cancel Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={closeModals}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveButton} onPress={closeModals}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal visible={isExpenseEmojiPickerVisible} animationType="slide" transparent={true}>
                        <View style={styles.emojiPickerContainer}>
                            <TouchableOpacity onPress={() => { setSelectedExpenseIcon('😎'); setExpenseEmojiPickerVisible(false); }} style={styles.emoji}>
                                <Text style={{ fontSize: 30 }}>😎</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setExpenseEmojiPickerVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>



                </View>
            </ScrollView >
        </Provider >
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1, // Ensures the content can grow and scroll
        padding: 20, // Adjust padding as needed
    },
    container: {
        marginTop: 200,
        padding: 60,
        flexGrow: 1,  // Ensures ScrollView has full height
        backgroundColor: 'white', // Example background color, adjust as needed
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,  // Add a little space below the avatar
    },
    avatarRight: {
        position: 'absolute',
        right: 10,
    },
    avatar: {
        backgroundColor: '#6200ee', // Customize avatar color
    },
    upgradeBar: {
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    upgradeText: {
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 4,
        padding: 20,
        // marginBottom: 20,
        //
        marginTop:10,
        // marginBottom: 20,
    },
    newIncomeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    newExpenseButton: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontWeight: 'bold',
    },
    overviewValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5, // Reduce vertical margin for compact layout
    },
    iconAndLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryEmoji: {
        fontSize: 18, // Adjust size for a minimal look
        marginRight: 5,
    },
    categoryLabel: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600', // Make the font bold for better readability
    },
    progressBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#333', // Dark background for unfilled part
        borderRadius: 4, // Rounded edges
        overflow: 'hidden',
        marginHorizontal: 10, // Add spacing between text and bar
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FF6A00', // Custom fill color
        borderRadius: 4,
    },
    amountText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
    },
    dateRange: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    datePickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    overviewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: 'white', // Card background
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    optionalText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    requiredText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    picker: {
        height: 40,
    },
    pickerText: {
        fontSize: 16,
    },
    pickerHint: {
        fontSize: 12,
        color: '#999',
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#FF6A00',
        padding: 10,
        borderRadius: 5,
    },
    overviewLabel: {
        fontSize: 16,
    },
    overviewValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    noDataCard: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#fff', // Card background color
        borderWidth: 1,
        borderColor: '#000', // Black border for emphasis
        // Elevation for Android
        elevation: 4,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    noDataText: {
        fontSize: 16,
    },

    noDataSubtext: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
    },
    historyContainer: {
        padding: 20,
        borderRadius: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    switchButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    activeSwitch: {
        backgroundColor: '#FF6A00',
    },
    switchButtonText: {
        color: '#fff',
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    menuItem: {

        marginTop: 50,

    },
    createNewText: {
        fontSize: 18, // Make the text larger
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: '#FF6A00', // Orange text
    },

    createNewCategoryButton: {
        backgroundColor: '#f4f4f4', // Light background for the button
        borderRadius: 5,
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignSelf: 'flex-start', // Align button to the left
    },
    niceSaveButton: {
        borderRadius: 10, // Rounded corners
        paddingVertical: 12, // Padding for height
        paddingHorizontal: 25, // Padding for width
        marginTop: 15, // Space from the previous element
        alignItems: 'center', // Center the text
        alignSelf: 'stretch', // Stretch to fill the width of the parent container
    },

    niceCancelButton: {
        borderRadius: 10, // Rounded corners
        paddingVertical: 12, // Padding for height
        paddingHorizontal: 25, // Padding for width
        marginTop: 10, // Space from the Save button
        alignItems: 'center', // Center the text
        alignSelf: 'stretch', // Stretch to fill the width of the parent container
    },

    niceButtonText: {
        fontSize: 16, // Medium-sized font
        fontWeight: 'bold', // Bold font for emphasis
    },

    smallCancelButton: {
        backgroundColor: '#FF6A00', // Orange color
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginTop: 20,
        alignSelf: 'flex-start', // Align button to the left
    },
    avatarContainer: {
        alignItems: 'flex-end',
        margin: 10, // Example, adjust as necessary for positioning
    },

    smallCancelText: {
        fontSize: 16,
        color: '#fff', // White text
        fontWeight: 'bold',
    },
    categoryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
        flex: 1,
    },
    emojiPickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerText: {
        fontSize: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, // Add spacing from the top
    },
    toggleButton: {
        flexDirection: 'row', // Align icon and text in a row
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20, // Rounded container
        borderWidth: 1, // Border for the button
        borderColor: '#ccc', // Light border color
        marginHorizontal: 10, // Spacing between buttons
        // White background
    },
    incomeButton: {
        borderColor: 'green', // Border color for income
    },
    expenseButton: {
        borderColor: 'red', // Border color for expense
    },
    icon: {
        width: 15,
        height: 15,
        borderRadius: 6, // Circular icon
        marginRight: 8, // Spacing between icon and text
    },
    incomeIcon: {
        backgroundColor: 'green', // Green icon for income
    },
    expenseIcon: {
        backgroundColor: 'red', // Red icon for expense
    },
    toggleText: {
        // Black text color
        fontWeight: 'bold',
        fontSize: 14, // Adjust font size for text
    },
    categoryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    createNewCategoryButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginTop: 10,
    },
    container: {
        padding: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },

    barContainer: {
        flex: 4,
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    bar: {
        height: '100%',
        backgroundColor: '#FF6A00', // Customize the color of the filled part
        borderRadius: 5,
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        padding: 20,
        backgroundColor: '#f4f4f4',
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    switchButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF6A00',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    activeSwitch: {
        backgroundColor: '#FF6A00',
    },
    container: {
        padding: 20,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#FF6A00',
        alignItems: 'center',
    },
    dropdownText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    listItem: {
        marginBottom: 20,
        paddingHorizontal: 10,

    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8, // Space between header and progress bar
    },
    itemCategory: {
        fontSize: 16,
        fontWeight: "bold",
    },
    emoji: {
        fontSize: 20,
        marginRight: 5,
    },
    percentageText: {
        fontSize: 14,
        color: "#888",

    },
    amountText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    fullWidthProgressBar: {
        height: 12, // Increase height for better visibility
        borderRadius: 6, // Rounded corners for better design
       // Background for unfilled part
    },
    monthItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    monthText: {
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#FF6A00',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    historyContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#121212", // Match your app theme
        marginBottom: 20,
    },
    dropdownWrapper: {
        width: "100%",
        alignSelf: "center",
        zIndex: 5000, // Ensure the dropdown is displayed above other components
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: "#1F1F1F",
        borderColor: "#FF6A00",
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    dropdownContainer: {
        backgroundColor: "#2C2C2C",
        borderColor: "#FF6A00",
        borderRadius: 8,
        maxHeight: 500, // Ensure sufficient height for scrolling
    },
    dropdownPlaceholder: {
        color: "#A6A6A6",
        fontSize: 16,
        fontWeight: "bold",
    },
    dropdownText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    arrowIcon: {
        tintColor: "#FF6A00",
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    tooltipText: {
        color: '#333',
        fontWeight: 'bold',
    },
});
export default DashboardScreen;