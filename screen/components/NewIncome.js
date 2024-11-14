import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Modal,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // For date formatting
import EmojiSelector from 'react-native-emoji-selector'; // For emoji picking
import { useSQLiteContext } from 'expo-sqlite/next'; // Import SQLite context




const NewIncomeScreen = ({ navigation }) => {
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDescription, setTransactionDescription] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode as default
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const modalBackgroundColor = isDarkMode ? '#2C2C2E' : '#fff';
    const [isCreateCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);
    const inputBackgroundColor = isDarkMode ? '#333' : '#f4f4f4';
    const [dbLoaded, setDbLoaded] = useState(false);

    const backgroundColor = isDarkMode ? '#1C1C1E' : '#fff';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBorderColor = isDarkMode ? '#FF6A00' : '#ccc';
    const placeholderTextColor = isDarkMode ? '#999' : '#aaa';
    const buttonBackgroundColor = isDarkMode ? '#FF6A00' : '#FF6A00';
    const buttonTextColor = '#fff';
    const cancelButtonColor = isDarkMode ? '#444' : '#ddd';


    const db = useSQLiteContext();

    const handleDateConfirm = (date) => {
        setTransactionDate(date);
        setDatePickerVisible(false);
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const openCategoryModal = () => setCategoryModalVisible(true);
    const closeCategoryModal = () => setCategoryModalVisible(false);
    const openCreateCategoryModal = () => {
        setCategoryModalVisible(false);
        setCreateCategoryModalVisible(true);
    };

    const handleSaveCategory = () => {
        if (newCategory && selectedIcon) {
            setSelectedCategory(newCategory);
            setCreateCategoryModalVisible(false);
        }
    };

    const getData = async () => {
        try {
            const result = await db.getAllAsync('SELECT * FROM income');
            console.log("Query Result Structure:", result);
            console.log("Fetched income data:", result.rows ? result.rows._array : result); // Check if result.rows exists and has _array
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    

    const initializeDatabase = async () => {
        try {
            await db.runAsync(`DROP TABLE IF EXISTS income`);
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS income (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description TEXT,
                    amount REAL,
                    category TEXT,
                    icon TEXT,
                    date TEXT
                )
            `);
            setDbLoaded(true);
            console.log('Table recreated successfully');
        } catch (error) {
            console.error('Error recreating table:', error);
        }
    };
    



    useEffect(() => {
        const initializeAndCheckSchema = async () => {
            await initializeDatabase();

            await getData();

        };

        initializeAndCheckSchema();
    }, [db]);

    if (!dbLoaded) {
        return <Text>Loading database...</Text>;
    }



    const handleSaveIncome = async () => {
        if (!transactionAmount || !selectedCategory || !transactionDate) {
            Alert.alert('Error', 'Please fill out all required fields: amount, category, and date.');
            return;
        }
    
        try {
            const result = await db.runAsync(
                'INSERT INTO income (description, amount, category, icon, date) VALUES (?, ?, ?, ?, ?)',
                [
                    transactionDescription,
                    parseFloat(transactionAmount),
                    selectedCategory,
                    selectedIcon,
                    transactionDate.toISOString(),
                ]
            );
    
            if (result && result.rowsAffected > 0) {
                Alert.alert('Success', 'Income transaction saved successfully!');
                console.log("Transaction saved:", {
                    description: transactionDescription,
                    amount: transactionAmount,
                    category: selectedCategory,
                    icon: selectedIcon,
                    date: transactionDate.toISOString(),
                });
                setTransactionDescription('');
                setTransactionAmount('');
                setSelectedCategory(null);
                setSelectedIcon(null);
                
                // Fetch and log all income data to verify
                await getData(); // Call getData to fetch and log all saved income
                navigation.navigate('main', { refresh: true });
            } else {
                navigation.navigate('main', { refresh: true });
            }
        } catch (error) {
            console.error('Error saving income transaction:', error);
            Alert.alert('Error', `Could not save income transaction: ${error.message}`);
        }
    };
    
    
    


    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Header with Dark/Light Mode Toggle */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle, { color: textColor }]}>New Income</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    thumbColor={isDarkMode ? "#FF6A00" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#FF6A00" }}
                />
            </View>

            <Text style={[styles.modalTitle, { color: textColor }]}>
                Add New <Text style={{ color: 'green' }}>Income</Text> Transaction
            </Text>

            {/* Transaction Description Input */}
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
                placeholder="Your description..."
                placeholderTextColor={placeholderTextColor}
                value={transactionDescription}
                onChangeText={setTransactionDescription}
            />
            <Text style={[styles.optionalText, { color: placeholderTextColor }]}>Transaction Description (Optional)</Text>

            {/* Transaction Amount Input */}
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
                placeholder="Put the price"
                placeholderTextColor={placeholderTextColor}
                keyboardType="numeric"
                value={transactionAmount}
                onChangeText={setTransactionAmount}
            />
            <Text style={[styles.requiredText, { color: placeholderTextColor }]}>Transaction Amount (Required)</Text>

            {/* Category and Date Picker */
            }<Text style={[styles.categoryText, { color: textColor }]}>
                {selectedCategory ? `Category: ${selectedCategory}` : 'Select a category.'}
            </Text>

            <View style={styles.row}>
                <View style={styles.column}>
                    <TouchableOpacity
                        style={[styles.categoryBox, { borderColor: inputBorderColor }]}
                        onPress={openCategoryModal}
                    >
                        <Text style={[styles.categoryText, { color: textColor }]}>
                            {selectedCategory ? `Category: ${selectedCategory}` : 'Select a category.'}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.optionalText, { color: placeholderTextColor }]}>Select a category for the transaction</Text>
                </View>

                <View style={styles.column}>
                    <TouchableOpacity
                        style={[styles.datePickerButton, { borderColor: inputBorderColor }]}
                        onPress={() => setDatePickerVisible(true)}
                    >
                        <Text style={[styles.datePickerText, { color: textColor }]}>
                            {format(transactionDate, 'MMMM do, yyyy')}
                        </Text>
                        <MaterialIcons name="calendar-today" size={24} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.optionalText, { color: placeholderTextColor }]}>Select a date for your transaction</Text>
                </View>
            </View>

            {/* Date Picker Modal */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisible(false)}
            />

            {/* Save and Cancel Buttons */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonBackgroundColor }]} onPress={handleSaveIncome}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: cancelButtonColor }]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Modal for Category Selection */}
            <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
                        <TextInput
                            style={[styles.searchInput, { borderColor: inputBorderColor, color: textColor, backgroundColor: inputBackgroundColor }]}
                            placeholder="Search category..."
                            placeholderTextColor={placeholderTextColor}
                        />
                        {/* Create New Button */}
                        <TouchableOpacity style={styles.createNewButton} onPress={openCreateCategoryModal}>
                            <MaterialIcons name="add" size={24} color={textColor} />
                            <Text style={[styles.createNewText, { color: textColor }]}>Create New</Text>
                        </TouchableOpacity>

                        {/* Cancel Button */}
                        <TouchableOpacity onPress={closeCategoryModal} style={[styles.smallCancelButton, { backgroundColor: cancelButtonColor }]}>
                            <Text style={styles.smallCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for Creating New Category */}
            <Modal visible={isCreateCategoryModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Create Income category</Text>
                        <Text style={[styles.subText, { color: placeholderTextColor }]}>Categories are used to group your transactions.</Text>

                        {/* Category Name Input */}
                        <TextInput
                            style={[styles.input, { borderColor: inputBorderColor, color: textColor, backgroundColor: inputBackgroundColor }]}
                            placeholder="Category"
                            value={newCategory}
                            onChangeText={setNewCategory}
                            placeholderTextColor={placeholderTextColor}
                        />
                        <Text style={[styles.subText, { color: placeholderTextColor }]}>This is how your category will appear</Text>

                        {/* Icon Selection */}
                        <TouchableOpacity style={[styles.iconSelector, { borderColor: inputBorderColor, backgroundColor: inputBackgroundColor }]} onPress={() => setEmojiPickerVisible(true)}>
                            <Text style={[styles.iconText, { color: textColor }]}>{selectedIcon ? selectedIcon : 'Click To Select Icon'}</Text>
                        </TouchableOpacity>
                        <Text style={[styles.subText, { color: placeholderTextColor }]}>This Icon will appear in the category.</Text>

                        {/* Save and Cancel Buttons */}
                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonBackgroundColor }]} onPress={handleSaveCategory}>
                            <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: cancelButtonColor }]} onPress={() => setCreateCategoryModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Emoji Picker Modal */}
            <Modal visible={isEmojiPickerVisible} animationType="slide" transparent={true}>
                <View style={styles.emojiPickerContainer}>
                    <EmojiSelector
                        onEmojiSelected={(emoji) => {
                            setSelectedIcon(emoji);
                            setEmojiPickerVisible(false);
                        }}
                        showSearchBar={true}
                        columns={8}
                    />
                    <TouchableOpacity onPress={() => setEmojiPickerVisible(false)} style={[styles.closeEmojiPicker, { backgroundColor: buttonBackgroundColor }]}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#333',
        color: '#fff',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        paddingRight: 10,
    },
    categoryBox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    datePickerButton: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    datePickerText: {
        fontSize: 16,
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "white"
    },
    cancelButton: {
        marginTop: 10,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
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
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        alignItems: 'center',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#FF6A00',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        color: '#fff',
    },
    createNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    createNewText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    smallCancelButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    smallCancelText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconSelector: {
        borderWidth: 1,
        borderColor: '#FF6A00',
        borderRadius: 10,
        padding: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: '#fff',
    },
    subText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    emojiPickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeEmojiPicker: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF6A00',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default NewIncomeScreen;