import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Modal,
    Alert,
    FlatList,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // For date formatting
import EmojiSelector from 'react-native-emoji-selector'; // For emoji picking
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDefaultCategoriesByType, getUserCategoriesByType } from '../services/firebaseSettings';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { CreateCategoryDialogButton } from '../local__components/create-category-dialog';
import { useTheme } from '../../themeContext';
import cuid from "cuid";

const NewIncomeScreen = ({ route, isVisible, onClose }) => {
    const { theme } = useTheme();
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories || []);
    const [transactionDescription, setTransactionDescription] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode as default
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const modalBackgroundColor = isDarkMode ? '#2C2C2E' : '#fff';
    const [isCreateCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);
    const inputBackgroundColor = isDarkMode ? '#333' : '#f4f4f4';
    const [dbLoaded, setDbLoaded] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const cardBackgroundColor = isDarkMode ? '#121212' : '#f4f4f4';
    const backgroundColor = isDarkMode ? '#1C1C1E' : '#fff';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBorderColor = isDarkMode ? '#FF6A00' : '#ccc';
    const placeholderTextColor = isDarkMode ? '#999' : '#aaa';
    const buttonBackgroundColor = isDarkMode ? '#04539a' : '#FF6A00';
    const buttonTextColor = '#fff';
    const cancelButtonColor = isDarkMode ? '#444' : '#ddd';
    const navigation = useNavigation();

    const { type } = route.params || {}; // Extract the 'type' parameter
    const id = cuid();

    const handleDateConfirm = (date) => {
        setTransactionDate(date);
        setDatePickerVisible(false);
    };



    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = await AsyncStorage.getItem("userId");
            setUserId(userId);
        };
        fetchUserData();
    }, []);

    const fetchCategories = async () => {
        if (!userId) {
            console.error("User ID is not available. Ensure the user is logged in.");
            setError("User ID is required.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const userCategories = await getUserCategoriesByType(userId, type) || [];
            const defaultCategories = await getDefaultCategoriesByType(type) || [];
            const combinedCategories = [
                ...defaultCategories.map((category) => ({ ...category, isDefault: true })),
                ...userCategories.map((category) => ({ ...category, isDefault: false })),
            ];

            console.log("combinedCategories: ", combinedCategories)

            setCategories(combinedCategories);
            setFilteredCategories(combinedCategories);

        } catch (err) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Failed to fetch categories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCategories();
        }
    }, [userId]);

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


    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCategories(categories); // Show all categories if the search is empty
        } else {
            const filtered = categories.filter((category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
            );
            setFilteredCategories(filtered);
        }
    }, [searchQuery, categories]);









    const handleSaveIncome = async () => {
        if (!transactionAmount || !selectedCategory || !transactionDate) {
            Alert.alert('Error', 'Please fill out all required fields.');
            return;
        }

        try {
            // Retrieve userId
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                Alert.alert('Error', 'User ID not found. Please sign in again.');
                return;
            }

            console.log('Retrieved userId:', userId);

            // Get a reference to the "users" collection
            const usersCollection = collection(db, 'users');
            console.log('Users Collection Reference:', usersCollection);

            // Get a reference to the specific user document
            const userRef = doc(usersCollection, userId);
            console.log('User Document Reference:', userRef);
            console.log('Firestore Instance:', db);

            // Prepare new income transaction
            const newIncome = {
                description: transactionDescription,
                amount: parseFloat(transactionAmount),
                category: selectedCategory,
                icon: selectedIcon,
                date: transactionDate.toISOString(),
                Id:id
            };

            console.log("icon", newIncome)
            // Fetch existing user data
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const existingIncome = userDoc.data()?.income || [];
                console.log('Existing Income:', existingIncome);

                const updatedIncome = [...existingIncome, newIncome];
                console.log('Updated Income to Save:', updatedIncome);

                await setDoc(
                    userRef,
                    { income: updatedIncome }, // Update 'income' field
                    { merge: true }
                );
            } else {
                console.log('No document found. Creating new user document with income.');
                await setDoc(
                    userRef,
                    { income: [newIncome] }, // Initialize 'income' field
                    { merge: true }
                );
            }


            console.log('Income transaction saved to Firebase.');
            Alert.alert('Success', 'Income transaction saved successfully!');

            // Reset fields
            setTransactionDescription('');
            setTransactionAmount('');
            setSelectedCategory(null);
            setSelectedIcon(null);

            // Navigate back with refresh flag
            navigation.navigate('Main', { refresh: true });
        } catch (error) {
            console.error('Error saving income transaction:', error);
            Alert.alert('Error', `Could not save income transaction: ${error.message}`);
        }
    };


    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             console.log("Fetching categories for type:", type);

    //             // Replace this with the actual fetching logic
    //             const userCategories = []; // Assuming this would fetch user-specific categories
    //             const defaultCategories = await getDefaultCategories(type) || [];

    //             console.log("Default Categories:", defaultCategories); // Log default categories

    //             const combinedCategories = [
    //                 ...defaultCategories.map(category => ({
    //                     ...category,
    //                     isDefault: true,
    //                 })),
    //                 ...userCategories.map(category => ({
    //                     ...category,
    //                     isDefault: false,
    //                 })),
    //             ];

    //             setCategories(combinedCategories);
    //         } catch (err) {
    //             console.error('Error fetching categories:', err);
    //             setError(err.message || 'Failed to fetch categories');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     if (type) { // Ensure `type` exists before fetching categories
    //         fetchCategories();
    //     } else {
    //         console.error("Type is undefined or null");
    //         setIsLoading(false);
    //     }
    // }, [type]);





    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    
                    <ScrollView
                        contentContainerStyle={[
                            styles.scrollContent,
                            { backgroundColor: theme.background },
                        ]}
                    >
                        <View style={[styles.container, { backgroundColor: theme.background }]}
                            keyboardShouldPersistTaps="handled">
                            {/* Header with Dark/Light Mode Toggle */}
                         

                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Add New <Text style={{ color: 'green' }}>Income</Text> Transaction
                            </Text>

                            {/* Transaction Description Input */}
                            <TextInput
                                style={[styles.input, { borderColor: theme.inputBorderColor, color: theme.text, backgroundColor: theme.background }]}
                                placeholder="Your description..."
                                placeholderTextColor={theme.text}
                                value={transactionDescription}
                                onChangeText={setTransactionDescription}
                            />
                            <Text style={[styles.optionalText, { color: theme.text }]}>Transaction Description (Optional)</Text>

                            {/* Transaction Amount Input */}
                            <TextInput
                                style={[styles.input, { borderColor: theme.inputBorderColor, color: theme.text, backgroundColor: theme.background }]} placeholder="Put the price"
                                placeholderTextColor={theme.text}
                                keyboardType="numeric"
                                value={transactionAmount}
                                onChangeText={setTransactionAmount}
                            />
                            <Text style={[styles.requiredText, { color: theme.text }]}>Transaction Amount (Required)</Text>

                            {/* Category and Date Picker */
                            }<Text style={[styles.categoryText, { color: theme.text }]}>
                                {selectedCategory ? `Category: ${selectedCategory}` : 'Select a category'}
                            </Text>

                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <TouchableOpacity
                                        style={[styles.categoryBox, { borderColor: theme.inputBorderColor }]}
                                        onPress={openCategoryModal}
                                    >
                                        <Text style={[styles.categoryText, { color: theme.text }]}>
                                            {selectedCategory ? `Category: ${selectedCategory}` : 'Select a category'}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color={theme.text} />
                                    </TouchableOpacity>
                                    <Text style={[styles.optionalText, { color: theme.text }]}>Select a category for the transaction</Text>
                                </View>

                                <View style={styles.column}>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { borderColor: theme.inputBorderColor }]}
                                        onPress={() => setDatePickerVisible(true)}
                                    >
                                        <Text style={[styles.datePickerText, { color: theme.text }]}>
                                            {format(transactionDate, 'MMMM do, yyyy')}
                                        </Text>
                                        <MaterialIcons name="calendar-today" size={23} color={theme.text} />
                                    </TouchableOpacity>
                                    <Text style={[styles.optionalText, { color: theme.text }]}>Select a date for your transaction</Text>
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
                            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonBackground }]} onPress={handleSaveIncome}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Main')
                                setCreateCategoryModalVisible(false); // Close the modal
                                // Navigate back to the main screen
                            }} style={[styles.cancelButton, { backgroundColor: theme.cardbackground }]}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            {/* Modal for Category Selection */}
                            <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
                                <View style={styles.modalContainer}>
                                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                                        <TextInput
                                            style={[styles.searchInput, { borderColor: theme.inputBorderColor, color: theme.text, backgroundColor: theme.background }]}
                                            placeholder="Search category..."
                                            placeholderTextColor={placeholderTextColor}
                                            value={searchQuery} // Bind the search query state
                                            onChangeText={(text) => setSearchQuery(text)}
                                        />

                                        {/* Create New Button */}
                                        <TouchableOpacity style={styles.createNewButton} onPress={openCreateCategoryModal}>


                                            <CreateCategoryDialogButton type={type} onSuccessCallback={fetchCategories} />

                                        </TouchableOpacity>

                                        {/* Categories List */}
                                        <FlatList
                                            data={filteredCategories} // Display categories here
                                            keyExtractor={(item) => item.id}
                                            numColumns={1}

                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[styles.categoryItem, { backgroundColor: theme.background }]}
                                                    onPress={() => {
                                                        setSelectedCategory(item.name);
                                                        setSelectedIcon(item.icon); // Set selected category
                                                        setCategoryModalVisible(false); // Close modal
                                                    }}
                                                >
                                                    <Text style={styles.categoryIcon}>{item.icon}</Text>
                                                    <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                            contentContainerStyle={styles.categoryList}
                                        />

                                        {/* Cancel Button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setCategoryModalVisible(false); // Close the modal correctly
                                            }}
                                            style={[styles.smallCancelButton, { backgroundColor: cancelButtonColor }]}
                                        >
                                            <Text style={styles.smallCancelText}>Cancel</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </Modal>


                            {/* Modal for Creating New Category */}
                            <Modal visible={isCreateCategoryModalVisible} animationType="slide" transparent={true}>
                                <View style={styles.modalContainer}>
                                    <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
                                        <Text style={[styles.modalTitle, { color: theme.text }]}>Create Expense category</Text>
                                        <Text style={[styles.subText, { color: placeholderTextColor }]}>Categories are used to group your transactions.</Text>

                                        {/* Category Name Input */}
                                        <TextInput
                                            style={[styles.input, { borderColor: theme.inputBorderColor, color: theme.text, backgroundColor: inputBackgroundColor }]}
                                            placeholder="Category"
                                            value={newCategory}
                                            onChangeText={setNewCategory}
                                            placeholderTextColor={placeholderTextColor}
                                        />
                                        <Text style={[styles.subText, { color: placeholderTextColor }]}>This is how your category will appear</Text>

                                        {/* Icon Selection */}
                                        <TouchableOpacity style={[styles.iconSelector, { borderColor: theme.inputBorderColor, backgroundColor: inputBackgroundColor }]} onPress={() => setEmojiPickerVisible(true)}>
                                            <Text style={[styles.iconText, { color: theme.text }]}>{selectedIcon ? selectedIcon : 'Click To Select Icon'}</Text>
                                        </TouchableOpacity>
                                        <Text style={[styles.subText, { color: placeholderTextColor }]}>This Icon will appear in the category.</Text>

                                        {/* Save and Cancel Buttons */}
                                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonBackground }]} onPress={handleSaveCategory}>
                                            <Text style={[styles.saveButtonText, { color: theme.text }]}>Save</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: cancelButtonColor }]}
                                            onPress={() => {

                                                setCreateCategoryModalVisible(false); // Close the modal
                                                // Navigate back to the main screen
                                            }}>
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
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        marginTop:-5
    },
    scrollContent: {
        flexGrow: 1, // Ensures the content can grow and scroll

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
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
        paddingRight: 3,
    },
    categoryBox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    datePickerButton: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    datePickerText: {
        fontSize: 12,
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
        width: '90%', // Reduce the width to make it smaller
        maxWidth: 400, // Optional: Set a maximum width for larger screens
        padding: 20,
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: '70%', // Set a maximum height to prevent overflow
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
    categoryList: {
        flexDirection: 'column', // Render items in a single column
        paddingHorizontal: 10,
    },
    categoryItem: {
        flexDirection: 'row', // Align icon and text side by side within the row
        alignItems: 'center',
        marginVertical: 5, // Add vertical space between items
        padding: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: '#2C2C2E',
        width: '100%', // Occupy the full width of the container
    },

});

export default NewIncomeScreen;