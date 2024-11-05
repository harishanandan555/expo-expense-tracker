import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // For date formatting
import EmojiSelector from 'react-native-emoji-selector'; // For emoji picking

const NewIncomeScreen = ({ navigation }) => {
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode as default
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [isCreateCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);

    const backgroundColor = isDarkMode ? '#1C1C1E' : '#fff';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBorderColor = isDarkMode ? '#FF6A00' : '#ccc';
    const placeholderTextColor = isDarkMode ? '#999' : '#aaa';
    const buttonBackgroundColor = isDarkMode ? '#FF6A00' : '#FF6A00';
    const buttonTextColor = '#fff';
    const cancelButtonColor = isDarkMode ? '#444' : '#ddd';

    const handleDateConfirm = (date) => {
        setTransactionDate(date);
        setDatePickerVisible(false);
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const openCategoryModal = () => {
        setCategoryModalVisible(true);
    };

    const closeCategoryModal = () => {
        setCategoryModalVisible(false);
    };

    const openCreateCategoryModal = () => {
        setCategoryModalVisible(false); // Close the category modal
        setCreateCategoryModalVisible(true); // Open the create category modal
    };

    const handleSaveCategory = () => {
        if (newCategory && selectedIcon) {
            setSelectedCategory(newCategory);
            setCreateCategoryModalVisible(false);
        }
    };

    const getData = async () => {
        try {
            const result = await db.getAllAsync('SELECT * FROM incomes');
            console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const initializeDatabase = async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS incomes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description TEXT,
                    amount REAL,
                    category TEXT,
                    icon TEXT,
                    date TEXT
                )`
            );
            setDbLoaded(true);
            console.log('Table created or already exists');
        } catch (error) {
            console.error('Error creating table:', error);
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
                'INSERT INTO incomes (description, amount, category, icon, date) VALUES (?, ?, ?, ?, ?)',
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
                setTransactionDescription('');
                setTransactionAmount('');
                setSelectedCategory(null);
                setSelectedIcon(null);
    
                // Navigate back to DashboardScreen with a refresh flag
                navigation.navigate('dashboard', { refresh: true });
            } else {
                Alert.alert('Error', 'No rows were affected. Please try again.');
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
            />
            <Text style={[styles.optionalText, { color: placeholderTextColor }]}>Transaction Description (Optional)</Text>

            {/* Transaction Amount Input */}
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
                placeholder="Put the price"
                placeholderTextColor={placeholderTextColor}
                keyboardType="numeric"
            />
            <Text style={[styles.requiredText, { color: placeholderTextColor }]}>Transaction Amount (Required)</Text>

            {/* Category and Date Picker */}
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
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonBackgroundColor }]}>
                <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: cancelButtonColor }]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Modal for Category Selection */}
            <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search category..."
                            placeholderTextColor="#999"
                            value=""
                        />
                        {/* Create New Button */}
                        <TouchableOpacity style={styles.createNewButton} onPress={openCreateCategoryModal}>
                            <MaterialIcons name="add" size={24} color="#fff" />
                            <Text style={styles.createNewText}>Create New</Text>
                        </TouchableOpacity>
                        {/* Cancel Button */}
                        <TouchableOpacity onPress={closeCategoryModal} style={styles.smallCancelButton}>
                            <Text style={styles.smallCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for Creating New Category */}
            <Modal visible={isCreateCategoryModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Income category</Text>
                        <Text style={styles.subText}>Categories are used to group your transactions.</Text>

                        {/* Category Name Input */}
                        <TextInput
                            style={styles.input}
                            placeholder="Category"
                            value={newCategory}
                            onChangeText={setNewCategory}
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.subText}>This is how your category will appear</Text>

                        {/* Icon Selection */}
                        <TouchableOpacity style={styles.iconSelector} onPress={() => setEmojiPickerVisible(true)}>
                            <Text style={styles.iconText}>{selectedIcon ? selectedIcon : 'Click To Select Icon'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.subText}>This Icon will appear in the category.</Text>

                        {/* Save and Cancel Buttons */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setCreateCategoryModalVisible(false)}>
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
                    <TouchableOpacity onPress={() => setEmojiPickerVisible(false)} style={styles.closeEmojiPicker}>
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
