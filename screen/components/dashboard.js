import React, { useState, useEffect } from 'react';
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
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { BarChart } from 'react-native-gifted-charts';

const DashboardScreen = () => {

    const [theme, setTheme] = useState('dark'); // Set default theme to dark
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
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const [lastUpdated, setLastUpdated] = useState("");
    const [isExpenseEmojiPickerVisible, setExpenseEmojiPickerVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const screenWidth = Dimensions.get('window').width;
    const [tooltip, setTooltip] = useState(null); // State to manage tooltip

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

    // Chart configuration
    const chartConfig = {
        backgroundGradientFrom: '#1e2923',
        backgroundGradientTo: '#08130d',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        barPercentage: 0.5,
        fillShadowGradient: '#FFA726',
        fillShadowGradientOpacity: 1,

        propsForLabels: {
            fontSize: 14,
            fontWeight: 'bold',
        },
    };

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
            value: balance,
            label: 'Balance',
            frontColor: 'blue', // Blue
        },
    ];
    const maxValue = Math.max(totalIncome, totalExpense, balance);
    const yAxisStep = Math.ceil(maxValue / 5);


    const [userInfos, setUserInfos] = useState(null);

    const route = useRoute();
    const [expenses, setExpenses] = useState([]);

    const navigation = useNavigation();
    const [firebaseBalance, setFirebaseBalance] = useState(0);
    const [firebaseTotalIncome, setFirebaseTotalIncome] = useState(0);
    const [firebaseTotalExpense, setFirebaseTotalExpense] = useState(0);
    const [firebaseLastUpdated, setFirebaseLastUpdated] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const barBackgroundColor = isDarkMode ? '#333' : '#e0e0e0';
    const [IncomeCategory, setIncomeCategory] = useState([]); // State to store the income data

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



    const fetchIncomeData = async () => {
        try {
            const id = auth.currentUser?.uid; // Get the user ID


            if (!id) {
                console.error("User ID is required.");
                return;
            }

            // Fetch user data from Firebase
            const userInfo = await getUserById(id);

            if (userInfo && userInfo.income) {
                // Transform income data into a usable structure
                const incomeData = userInfo.income.map((item) => ({
                    category: item.category,
                    amount: item.amount,
                    date: item.date,
                    description: item.description,
                    icon: item.icon || "💰", // Default icon if none is provided
                }));

                // Store the income data in the state
                setIncomeCategory(incomeData);

            } else {
                console.error("No income data found for this user.");
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
        }
    };

    const fetchExpenseData = async () => {
        try {
            const id = auth.currentUser?.uid; // Get the user ID

            if (!id) {
                console.error("User ID is required.");
                return;
            }

            // Fetch user data from Firebase
            const userInfo = await getUserById(id);

            if (userInfo && userInfo.expenses) {
                // Transform expenses data into a usable structure
                const expenseData = userInfo.expenses.map((item) => ({
                    category: item.category,
                    amount: item.amount,
                    date: item.date,
                    description: item.description,
                    icon: item.icon || "💸", // Default icon if none is provided
                }));

                // Store the expenses data in the state
                setExpenses(expenseData);

            } else {
                console.error("No expense data found for this user.");
            }
        } catch (error) {
            console.error("Error fetching expense data:", error);
        }
    };


    const handleGoogleLogout = async () => {
        try {
            await GoogleSignin.signOut();
            await AsyncStorage.removeItem('userInfo');
            await AsyncStorage.removeItem('userEmail'); // Clear stored email if needed
            setUserInfos(null);
            navigation.replace('signin'); // Navigate back to the SignInPage
        } catch (error) {
            console.error('Error signing out from Google:', error);
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







    const formatDate = (date) => format(date, 'yyyy-MM-dd');


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




    const calculateAndSaveFinancialData = async () => {
        try {
            // Get the user ID from the authenticated user
            const userId = auth.currentUser?.uid;


            if (!userId) {
                console.error("User ID is required. Cannot update financial data.");
                return;
            }

            // Fetch user data from Firebase
            const userInfo = await getUserById(userId);


            if (!userInfo) {
                console.error("User information could not be retrieved.");
                return;
            }

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

            // Prepare financial data to be saved
            const financialData = {
                totalIncome: calculatedTotalIncome,
                totalExpense: calculatedTotalExpense,
                balance: calculatedBalance,
                lastUpdated: new Date().toISOString(),
            };

            // Reference to the user's document in Firestore
            const userDocRef = doc(db, "users", userId);

            // Save the financial data to Firestore
            await setDoc(
                userDocRef,
                { financialData },
                { merge: true } // Merge with existing data
            );



            // Update the state variables
            setTotalIncome(calculatedTotalIncome);
            setTotalExpense(calculatedTotalExpense);
            setBalance(calculatedBalance);
            setLastUpdated(financialData.lastUpdated);

            console.log("date", lastUpdated)
        } catch (error) {
            console.error("Error calculating and saving financial data:", error);
        }
    };



    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

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
    const cardBackgroundColor = isDarkMode ? '#121212' : '#f4f4f4';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBackgroundColor = isDarkMode ? '#333' : '#fff';
    const modalTextColor = isDarkMode ? '#fff' : '#000';
    // Function to format the date


    return (
        <Provider>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { backgroundColor: backgroundColor },
                ]}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    {/* Right-aligned Avatar */}
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <View style={styles.header}>
                                <TouchableOpacity onPress={openMenu} style={styles.avatarContainer}>

                                    {userInfos?.photoURL ? (
                                        <Avatar.Image
                                            size={40}
                                            source={{ uri: userInfos.photoURL }}
                                            style={styles.avatar}
                                        />
                                    ) : (
                                        <Avatar.Text
                                            size={40}
                                            label={userInfos?.displayName ? userInfos.displayName[0] : '?'}
                                            style={styles.avatar}
                                        />
                                    )}



                                </TouchableOpacity>
                            </View>
                        }
                        style={[
                            styles.menuItem,
                            {

                                paddingVertical: 0,
                                marginVertical: 0,
                                // Remove height to allow dynamic sizing
                            },
                        ]}
                    >
                        <Menu.Item
                            onPress={() => {
                                handleThemeSwitch('light');
                                closeMenu();
                            }}
                            title="Light"
                            icon="weather-sunny"
                            style={{

                                paddingVertical: 4, // Slight padding adjustment
                                marginVertical: 0,
                            }}

                        />
                        <Menu.Item
                            onPress={() => {
                                handleThemeSwitch('dark');
                                closeMenu();
                            }}
                            title="Dark"
                            icon="weather-night"
                            style={{

                                paddingVertical: 4,
                            }}

                        />
                        <Divider style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#e0e0e0' }} />
                        <Menu.Item
                            onPress={handleGoogleLogout}
                            title="Logout"
                            icon="logout"
                            style={{

                                paddingVertical: 4,
                            }}

                        />
                    </Menu>

                </View>

                {/* Top Upgrade Bar */}
                <View style={[styles.upgradeBar, { backgroundColor: isDarkMode ? '#FF6A00' : '#FFD580' }]}>
                    <Text style={[styles.upgradeText, { color: textColor }]}>Upgrade to premium user</Text>
                </View>

                {/* New Income and New Expense Buttons */}
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
                            New Income
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
                                { color: activeButton === 'expense' ? backgroundColor : isDarkMode ? '#FF6A00' : '#FF8C00' },
                            ]}
                        >
                            New Expense
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* Overview Section */}
                <Text style={[styles.sectionTitle, { color: textColor }]}>Overview</Text>
                <View style={[styles.dateRange, { backgroundColor: cardBackgroundColor }]}>
                    <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePickerWrapper}>
                        <Text style={[styles.dateText, { color: textColor }]}>
                            {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} style={styles.arrowIcon} />
                    </TouchableOpacity>
                </View>

                {/* Date Picker Modal */}

                <DateTimePickerModal
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
                />
                {/* Income, Expense, Balance Cards */}

                <View style={[styles.overviewCard, { backgroundColor: cardBackgroundColor }]}>
                    <MaterialIcons name="trending-up" size={32} color="green" />
                    <View>
                        <Text style={[styles.overviewLabel, { color: textColor }]}>Income</Text>
                        <Text style={[styles.overviewValue, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                            ${totalIncome}
                        </Text>
                    </View>
                </View>

                <View style={[styles.overviewCard, { backgroundColor: cardBackgroundColor }]}>
                    <MaterialIcons name="trending-down" size={32} color="red" />
                    <View>
                        <Text style={[styles.overviewLabel, { color: textColor }]}>Expense</Text>
                        <Text style={[styles.overviewValue, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                            ${totalExpense}
                        </Text>
                    </View>
                </View>

                <View style={[styles.overviewCard, { backgroundColor: cardBackgroundColor }]}>
                    <MaterialIcons name="account-balance-wallet" size={32} color="blue" />
                    <View>
                        <Text style={[styles.overviewLabel, { color: textColor }]}>Balance</Text>
                        <Text style={[styles.overviewValue, { color: textColor }]}>${balance}</Text>
                    </View>
                </View>



                {/* Income and Expense Section */}

                <Text style={[styles.sectionTitle, { color: textColor }]}>Income</Text>
                {/* <TouchableOpacity style={styles.button} onPress={fetchIncomeData}>
                    <Text style={styles.buttonText}>Fetch Income Data</Text>
                </TouchableOpacity> */}

                <View style={[styles.noDataCard, { backgroundColor: cardBackgroundColor }]}>
                    {IncomeCategory.length === 0 ? (
                        <>
                            <Text style={[styles.noDataText, { color: textColor }]}>No income data available.</Text>
                            <Text style={styles.noDataSubtext}>Add new income to see details.</Text>
                        </>
                    ) : (

                        <ScrollView style={styles.scrollArea}>
                            <View style={[styles.sectionContainer, { backgroundColor: cardBackgroundColor }]}>
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
                                        <View key={index} style={styles.listItem}>
                                            <View style={styles.itemHeader}>
                                                <Text style={[styles.emoji, { color: textColor }]}>{item.icon}</Text>
                                                <Text style={[styles.itemCategory, { color: textColor }]} > {item.category}{" "}</Text>
                                                <Text style={[styles.percentageText, { color: textColor }]}>
                                                    ({percentage.toFixed(0)}%)
                                                </Text>

                                                <Text style={[styles.amountText, { color: textColor }]}>
                                                    ${amount.toFixed(2)}
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
                        </ScrollView>

                    )}
                </View>


                <Text style={[styles.sectionTitle, { color: textColor }]}>Expense</Text>
                <View style={[styles.noDataCard, { backgroundColor: cardBackgroundColor }]}>
                    {expenses.length === 0 ? (
                        // Display this message if there is no data
                        <>
                            <Text style={[styles.noDataText, { color: textColor }]}>No data for the selected period.</Text>
                            <Text style={styles.noDataSubtext}>Try to select a different period or add expenses.</Text>
                        </>
                    ) : (
                        <ScrollView style={styles.scrollArea}>
                            <View style={styles.listContainer}>
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
                                        <View key={index} style={styles.listItem}>
                                            <View style={styles.itemHeader}>
                                                <Text style={[styles.emoji, { color: textColor }]}>{item.icon}</Text>
                                                <Text style={[styles.itemCategory, { color: textColor }]} > {item.category}{" "}</Text>
                                                <Text style={[styles.percentageText, { color: textColor }]}>
                                                    ({percentage.toFixed(0)}%)
                                                </Text>

                                                <Text style={[styles.amountText, { color: textColor }]}>
                                                    ${amount.toFixed(2)}
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
                        </ScrollView>
                    )}

                </View>



                {/* History Section */}
                <Text style={[styles.sectionTitle, { color: textColor }]}>History</Text>
                <View style={[styles.historyContainer, { backgroundColor: cardBackgroundColor }]}>
                    {/* Switch between Year and Month */}
                    <View style={styles.switchContainer}>
                        <View>
                            <TouchableOpacity style={[styles.switchButton, { backgroundColor: cardBackgroundColor }]}>
                                <Text style={[styles.switchButtonText, { color: textColor }]}>2024</Text>
                            </TouchableOpacity>



                            {/* Month Selection Dropdown */}
                            <View style={styles.dropdownWrapper}>
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

                            </View>


                        </View>
                    </View>

                    {/* Date Picker */}


                    {/* Income and Expense Toggle */}
                    <View style={styles.toggleContainer}>
                        <View style={[styles.toggleButton, { backgroundColor: 'green' }]}>
                            <Text style={styles.toggleText}>Income</Text>
                        </View>
                        <View style={[styles.toggleButton, { backgroundColor: 'red' }]}>
                            <Text style={styles.toggleText}>Expense</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 40, 
                            padding: 20,
                            borderRadius: 10,
                            backgroundColor: cardBackgroundColor, // Dark background for better contrast
                            alignItems: 'center',
                            marginVertical: 20,
                        }}
                    >
                        
                        <BarChart
                            data={barData}
                            barWidth={40}
                            renderTooltip={(item, index) => {
                                return (
                                    <View
                                        style={{
                                           
                                            marginBottom:-5550,
                                            backgroundColor: '#ffcefe',
                                            paddingHorizontal: 6,
                                            paddingVertical: 4,
                                            borderRadius: 4,
                                        }}>
                                        <Text>{item.value}</Text>
                                    </View>
                                );
                            }}
                            barBorderRadius={6}
                            yAxisThickness={2} // Y-axis line thickness
                            yAxisColor="#fff" // Y-axis line color
                            xAxisThickness={2} // X-axis line thickness
                            xAxisColor="#fff" // X-axis line color
                            noOfSections={5} // Divide y-axis into 5 sections
                            maxValue={yAxisStep * 7} // Adjust the y-axis range
                            yAxisTextStyle={{ color: textColor, fontSize: 12 }} // Customize y-axis labels
                            xAxisLabelTextStyle={{ color: textColor, fontSize: 12 }} // Customize x-axis labels
                            height={500} // Chart height
                            isAnimated
                            side="right"
                            barStyle={{
                              

                                shadowColor: '#fc84ff',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 1,
                                shadowRadius: 8,
                                elevation: 10,
                            }}
                            hideRules
                            initialSpacing={20}
                            barMarginBottom={10}//
                            Enable animation
             
                        />
                    </View>
                    {/* Modal for New Income */}
                    <Modal visible={isIncomeModalVisible} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
                                <Text style={[styles.modalTitle, { color: textColor }]}>
                                    Add New <Text style={{ color: 'green' }}>Income</Text> Transaction
                                </Text>

                                <TextInput style={styles.input} placeholder="Transaction Description" placeholderTextColor={textColor} />
                                <Text style={[styles.optionalText, { color: textColor }]}>Transaction Description (Optional)</Text>

                                <TextInput style={styles.input} placeholder="Put the price" placeholderTextColor={textColor} />
                                <Text style={[styles.requiredText, { color: textColor }]}>Transaction Amount (Required)</Text>

                                {/* Category Selection */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: textColor }]}>Category</Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryBox,
                                            { backgroundColor: cardBackgroundColor, borderColor: isDarkMode ? '#fff' : '#000' }
                                        ]}
                                        onPress={openCategoryModal}
                                    >
                                        <Text style={[styles.categoryText, { color: textColor }]}>
                                            {selectedCategory ? `Category: ${selectedCategory}` : 'Select a category'}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} />
                                    </TouchableOpacity>
                                    <Text style={[styles.pickerHint, { color: textColor }]}>Select a category for the transaction</Text>
                                </View>

                                {/* Date Picker */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: textColor }]}>Transaction date</Text>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { backgroundColor: cardBackgroundColor }]}
                                        onPress={() => setDatePickerVisible(true)}
                                    >
                                        <Text style={[styles.pickerText, { color: textColor }]}>{transactionDate.toLocaleDateString('en-US')}</Text>
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
                                <Text style={[styles.modalTitle, { color: textColor }]}>Select a Category</Text>

                                {/* Create New Category Button */}
                                <TouchableOpacity onPress={openCreateCategoryModal} style={styles.createNewCategoryButton}>
                                    <Text style={[styles.createNewText, { color: textColor }]}>+ Create New</Text>
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
                                <Text style={[styles.modalTitle, { color: modalTextColor }]}>Create New Category</Text>

                                {/* Input for Category Name */}
                                <TextInput
                                    placeholder="Category Name"
                                    value={newCategory}
                                    onChangeText={(text) => setNewCategory(text)}
                                    style={[styles.input, { backgroundColor: inputBackgroundColor, color: modalTextColor }]}
                                    placeholderTextColor={modalTextColor}
                                />

                                {/* Icon Selection */}
                                <TouchableOpacity style={styles.emojiButton} onPress={() => setEmojiPickerVisible(true)}>
                                    <Text style={{ color: modalTextColor }}>{selectedIcon ? selectedIcon : 'Click To Select Icon'}</Text>
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
                            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
                                <Text style={[styles.modalTitle, { color: textColor }]}>
                                    Add New <Text style={{ color: 'red' }}>Expense</Text> Transaction
                                </Text>

                                <TextInput style={styles.input} placeholder="Transaction Description" placeholderTextColor={textColor} />
                                <Text style={[styles.optionalText, { color: textColor }]}>Transaction Description (Optional)</Text>

                                <TextInput style={styles.input} placeholder="Put the price" placeholderTextColor={textColor} />
                                <Text style={[styles.requiredText, { color: textColor }]}>Transaction Amount (Required)</Text>

                                {/* Category Selection */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: textColor }]}>Category</Text>
                                    <TouchableOpacity
                                        style={[styles.categoryBox, { backgroundColor: cardBackgroundColor, borderColor: isDarkMode ? '#fff' : '#000' }]}
                                        onPress={openCategoryModal}  // This opens the category selection modal
                                    >
                                        <Text style={[styles.categoryText, { color: textColor }]}>
                                            {selectedCategory ? `Category: ${selectedCategory}` : 'Select a category'}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} />
                                    </TouchableOpacity>
                                    <Text style={[styles.pickerHint, { color: textColor }]}>Select a category for the transaction</Text>
                                </View>

                                {/* Date Picker */}
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: textColor }]}>Transaction date</Text>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { backgroundColor: cardBackgroundColor }]}
                                        onPress={() => setDatePickerVisible(true)}
                                    >
                                        <Text style={[styles.pickerText, { color: textColor }]}>{transactionDate.toLocaleDateString('en-US')}</Text>
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
            </ScrollView>
        </Provider>
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
        marginBottom: 20,
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
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
        justifyContent: 'space-between',
    },
    toggleButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },

    toggleText: {
        color: '#fff',
        fontWeight: 'bold',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
        marginLeft: 15,
    },
    fullWidthProgressBar: {
        height: 12, // Increase height for better visibility
        borderRadius: 6, // Rounded corners for better design
        backgroundColor: "#333", // Background for unfilled part
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