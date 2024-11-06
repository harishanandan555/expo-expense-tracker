import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,

} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';
import { Avatar, Menu, Divider, Provider } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // Use date-fns for formatting dates
import { Picker } from '@react-native-picker/picker'; // Import Picker from @react-native-picker/picker
import EmojiSelector from 'react-native-emoji-selector'; // For emoji picking
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { useSQLiteContext } from 'expo-sqlite/next'; // Assuming you're using expo-sqlite context

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
    const [totalIncome, setTotalIncome] = useState(0); // State to store total income
     const[totalExpense,settotalExpense] =useState(0);
    const [newExpenseCategory, setNewExpenseCategory] = useState('');
    const [selectedExpenseIcon, setSelectedExpenseIcon] = useState(null);
    const [isExpenseEmojiPickerVisible, setExpenseEmojiPickerVisible] = useState(false);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
    const [balance, setBalance] = useState(0); // State for balance

    const navigation = useNavigation();
    // const db = useSQLiteContext(); // Your SQLite context

    // Function to handle theme switching
    const handleThemeSwitch = (mode) => {
        setTheme(mode);
    };

    useEffect(() => {
        setBalance(totalIncome - totalExpense);
    }, [totalIncome, totalExpense]);

    const toggleIncomeModal = () => {
        setIncomeModalVisible(true);
        setExpenseModalVisible(false);
        setActiveButton('income');
    };
    const handleSaveExpenseCategory = () => {
        if (newExpenseCategory && selectedExpenseIcon) {
            setExpenseCategories([...expenseCategories, { id: expenseCategories.length + 1, name: newExpenseCategory, icon: selectedExpenseIcon }]);
            setCreateCategoryModalVisible(false);
            setSelectedExpenseCategory(newExpenseCategory);
        }
    };


    const toggleIncomeModals = () => {
        navigation.navigate('NewIncome');
    };

    // Navigate to NewExpense screen
    const toggleExpenseModals = () => {
        navigation.navigate('NewExpense');
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


    const toggleExpenseModal = () => {
        setExpenseModalVisible(true);
        setIncomeModalVisible(false);
        setActiveButton('expense');
    };

    const closeModals = () => {
        setIncomeModalVisible(false);
        setExpenseModalVisible(false);
        setCategoryModalVisible(false);
        setCreateCategoryModalVisible(false);
    };

    const handleDateConfirm = (date) => {
        setTransactionDate(date);
        setDatePickerVisible(false);
    };

    const fetchTotalIncome = async () => {
        try {
            const result = await db.getAllAsync('SELECT SUM(amount) as totalIncome FROM incomes');
            console.log('Query Result:', result);

            if (result && result.length > 0) {
                const totalIncome = result[0]?.totalIncome || 0;
                console.log('Total Income:', totalIncome);
                setTotalIncome(totalIncome);
            } else {
                console.log('No data found in the incomes table.');
                setTotalIncome(0);
            }
        } catch (error) {
            console.error('Error fetching total income:', error);
        }
    };


    const fetchTotalExpense = async () => {
        try {
            const result = await db.getAllAsync('SELECT SUM(amount) as totalExpense FROM expense');
            console.log('Query Result:', result);

            if (result && result.length > 0) {
                const totalExpense = result[0]?.totalExpense || 0;
                console.log('Total Expense:', totalExpense);
                settotalExpense(totalExpense);
            } else {
                console.log('No data found in the expense table.');
                settotalExpense(0);
            }
        } catch (error) {
            console.error('Error fetching total expense:', error);
        }
    };


    useEffect(() => {
        fetchTotalIncome(); 
        fetchTotalExpense();// Fetch total income when the component mounts
    }, []);

    const route = useRoute();
    const { userInfo } = route.params || {};

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    // Extracting user initials
    const user = { firstName: 'Anjali', lastName: 'Bettan' };
    const initials = `${user.firstName[0]}${user.lastName[0]}`;

    // Determine colors based on the theme
    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? '#000' : '#fff';
    const cardBackgroundColor = isDarkMode ? '#121212' : '#f4f4f4';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBackgroundColor = isDarkMode ? '#333' : '#fff';
    const modalTextColor = isDarkMode ? '#fff' : '#000';
    // Function to format the date
    const formatDate = (date) => {
        return format(date, 'MMM d, yyyy');
    };

    return (
        <Provider>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
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
                            <TouchableOpacity onPress={openMenu}>
                                {userInfo?.data?.user?.photo ? (
                                    <Avatar.Image
                                        size={40}
                                        source={{ uri: userInfo.data.user.photo }}
                                    />
                                ) : (
                                    <Avatar.Text size={40} label={initials} />
                                )}
                            </TouchableOpacity>
                        }
                    >

                        <Menu.Item
                            onPress={() => {
                                handleThemeSwitch('light');
                                closeMenu();
                            }}
                            title="Light"
                            icon="weather-sunny"
                        />
                        <Menu.Item
                            onPress={() => {
                                handleThemeSwitch('dark');
                                closeMenu();
                            }}
                            title="Dark"
                            icon="weather-night"
                        />
                        <Divider />
                        <Menu.Item onPress={() => alert('Logout pressed')} title="Logout" icon="logout" />
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
                            ${totalIncome.toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.overviewCard, { backgroundColor: cardBackgroundColor }]}>
                    <MaterialIcons name="trending-down" size={32} color="red" />
                    <View>
                        <Text style={[styles.overviewLabel, { color: textColor }]}>Expense</Text>
                        <Text style={[styles.overviewValue, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                            ${totalExpense.toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.overviewCard, { backgroundColor: cardBackgroundColor }]}>
                    <MaterialIcons name="account-balance-wallet" size={32} color="blue" />
                    <View>
                        <Text style={[styles.overviewLabel, { color: textColor }]}>Balance</Text>
                        <Text style={[styles.overviewValue, { color: textColor }]}>${balance.toFixed(2)}</Text>
                    </View>
                    </View>

                {/* Income and Expense Section */}
                <Text style={[styles.sectionTitle, { color: textColor }]}>Income</Text>
                <View style={[styles.noDataCard, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={[styles.noDataText, { color: textColor }]}>No data for the selected period.</Text>
                    <Text style={styles.noDataSubtext}>Try to select a different period or add incomes.</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: textColor }]}>Expense</Text>
                <View style={[styles.noDataCard, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={[styles.noDataText, { color: textColor }]}>No data for the selected period.</Text>
                    <Text style={styles.noDataSubtext}>Try to select a different period or add expenses.</Text>
                </View>

                {/* History Section */}
                <Text style={[styles.sectionTitle, { color: textColor }]}>History</Text>
                <View style={[styles.historyContainer, { backgroundColor: cardBackgroundColor }]}>
                    {/* Switch between Year and Month */}
                    <View style={styles.switchContainer}>
                        <TouchableOpacity style={[styles.switchButton, { backgroundColor: cardBackgroundColor }]}>
                            <Text style={[styles.switchButtonText, { color: textColor }]}>Year</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.switchButton, styles.activeSwitch]}>
                            <Text style={styles.switchButtonText}>Month</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker */}
                    <View style={styles.datePicker}>
                        <Text style={[styles.pickerText, { color: textColor }]}>2024</Text>
                        <Text style={[styles.pickerText, { color: textColor }]}>October</Text>
                    </View>

                    {/* Income and Expense Toggle */}
                    <View style={styles.toggleContainer}>
                        <View style={[styles.toggleButton, { backgroundColor: 'green' }]}>
                            <Text style={styles.toggleText}>Income</Text>
                        </View>
                        <View style={[styles.toggleButton, { backgroundColor: 'red' }]}>
                            <Text style={styles.toggleText}>Expense</Text>
                        </View>
                    </View>
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




            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align Avatar to the right
        alignItems: 'center',
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
    dateRange: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    datePickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowIcon: {
        marginLeft: 5,
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
});

export default DashboardScreen;