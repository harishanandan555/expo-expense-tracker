// import React, { useCallback, useState, useEffect  } from 'react';
// import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ActivityIndicator } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useForm, Controller } from 'react-hook-form';
// import EmojiSelector, { Categories } from 'react-native-emoji-selector';
// import Toast from 'react-native-toast-message';
// import * as Yup from 'yup';

// import { db, auth } from "../../config/firebaseConfig";
// import { getUserByEmail, storeUserCategories, updateCategoryAttempts, deleteCategoryByUserId } from "../services/firebaseSettings"
// // import { CreateCategory } from "../actions/categories.action";
// import { hasSubscription } from "../services/stripe.services";

// // Define a schema using Yup for validation
// const CreateCategorySchema = Yup.object().shape({
//     name: Yup.string().required('Name is required'),
//     icon: Yup.string().required('Icon is required'),
//     type: Yup.string().oneOf(['income', 'expense'], 'Invalid category type').required('Type is required'),
// });

// export const CreateCategoryDialog = ({ type, onSuccessCallback }) => {

//     const [open, setOpen] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [userEmail, setUserEmail] = useState(null);
//     const [userInfo, setUserInfo] = useState(null);
//     const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
//     const { control, handleSubmit, formState: { isValid, isSubmitting }, reset } = useForm({
//       defaultValues: {
//         name: "",
//         icon: "",
//         type,
//       },
//     });


//     useEffect(() => {
//         const fetchUserEmail = async () => {
//             const userId = await AsyncStorage.getItem("userId");
//             const email = await AsyncStorage.getItem("userEmail");
//             const userInfo = await AsyncStorage.getItem("userInfo");
//             setUserId(userId); // Set email for later use in database
//             setUserEmail(email); // Set email for later use in database
//             setUserInfo(userInfo); // Set email for later use in database
//         };
//         fetchUserEmail();
//     }, []);


//     const onSubmit = useCallback(
//       async (values) => {
//         // Show "Creating Category..." Toast
//         Toast.show({
//           type: 'info',
//           text1: 'Creating Category...',
//         });

//         try {

//             const response = await createCategory(values); // Call the correct function to create category

//             // Show success message with category name
//             Toast.show({
//                 type: 'success',
//                 text1: `Category ${response.name} created successfully!`,
//             });

//             // Call success callback
//             onSuccessCallback(response);

//             // Reset the form and close the dialog
//             reset();
//             setOpen(false);

//         } catch (error) {
//           console.error("Error:", error);
//           Toast.show({
//             type: 'error',
//             text1: 'Failed to create category',
//             text2: error?.message || 'Please try again.',
//           });
//         }
//       },[onSuccessCallback, reset]
//     );

//     const createCategory = async (value) => {

//         try {
//             // Validate the value
//             const parsedBody = await CreateCategorySchema.validate(value, { abortEarly: false });

//             // Assuming the schema returns an object with an error property if invalid:
//             if (parsedBody && parsedBody.errors && parsedBody.errors.length > 0) {
//                 throw new Error(`Validation failed: ${parsedBody.errors.join(', ')}`);
//             }

//             const { name, icon, type } = parsedBody;

//             // const hasAccess = await hasSubscription();

//             // if (!hasAccess && user.categoriesAttemps === 0) {
//             //     return { error: true, redirect: "/upgrade?categoriesLimit=true" };
//             // }

//             let data = {
//                 name: name,
//                 icon: icon,
//                 type: type,
//             };

//             // let userid = "nVjoGRXNbUcaxDH5O5SNMhXc6rB2"
//             // let userid = "o3MEsCK23MN48AcgyYaMNwe0xYP2"
//             console.log("userId1: ", userId)
//             const userid = auth.currentUser?.uid;
//             console.log("userId2: ", userid)
//             // Store category
//             const categories = await storeUserCategories(userid, data);

//             // Update category attempts
//             // await updateCategoryAttempts(userId, hasAccess ? 0 : -1); // Pass -1 to decrement

//             return { categories };

//         } catch (error) {
//             console.error("Error during category creation:", error);
//             // Log detailed error message
//             // throw new Error(error?.message || 'An unknown error occurred');
//         }
//     };

//     return (
//       <>
//         {/* Trigger Button */}
//         <TouchableOpacity
//           style={styles.triggerButton}
//           onPress={() => setOpen(true)}
//         >
//           <Text style={styles.triggerButtonText}>Create New</Text>
//         </TouchableOpacity>

//         {/* Dialog Content */}
//         <Modal visible={open} transparent animationType="slide">
//           <View style={styles.modalOverlay}>
//             <View style={styles.dialogContainer}>
//               <Text style={styles.dialogTitle}>
//                 Create{" "}
//                 <Text
//                   style={[
//                     styles.dialogType,
//                     type === "income"
//                       ? styles.incomeColor
//                       : styles.expenseColor,
//                   ]}
//                 >
//                   {type}
//                 </Text>{" "}
//                 Category
//               </Text>
//               <Text style={styles.dialogDescription}>
//                 Categories are used to group your transactions.
//               </Text>

//               {/* Form */}
//               <View style={styles.formContainer}>
//                 {/* Name Field */}
//                 <Controller
//                   control={control}
//                   name="name"
//                   render={({ field: { onChange, value } }) => (
//                     <View style={styles.formField}>
//                       <Text style={styles.fieldLabel}>Name</Text>
//                       <TextInput
//                         style={styles.textInput}
//                         placeholder="Category"
//                         onChangeText={onChange}
//                         value={value}
//                       />
//                       <Text style={styles.fieldDescription}>
//                         This is how your category will appear.
//                       </Text>
//                     </View>
//                   )}
//                 />

//                 {/* Icon Field */}
//                 <Controller
//                   control={control}
//                   name="icon"
//                   render={({ field: { onChange, value } }) => (
//                     <View style={styles.formField}>
//                       <Text style={styles.fieldLabel}>Icon</Text>
//                       <TouchableOpacity
//                         style={styles.iconPicker}
//                         onPress={() => setIsEmojiPickerOpen(true)}
//                       >
//                         {value ? (
//                           <View style={styles.iconPreview}>
//                             <Text style={styles.iconText}>{value}</Text>
//                             <Text>Click To Select Icon</Text>
//                           </View>
//                         ) : (
//                           <View style={styles.iconPreview}>
//                             <Text style={styles.iconPlaceholder}>⛔</Text>
//                             <Text>Click To Select Icon</Text>
//                           </View>
//                         )}
//                       </TouchableOpacity>
//                       {isEmojiPickerOpen && (
//                         <View style={styles.emojiSelectorContainer}>
//                           <EmojiSelector
//                             onEmojiSelected={(emoji) => {
//                               onChange(emoji);
//                               setIsEmojiPickerOpen(false);
//                             }}
//                             category={Categories.Smileys}
//                           />
//                         </View>
//                       )}
//                       <Text style={styles.fieldDescription}>
//                         This Icon will appear in the category.
//                       </Text>
//                     </View>
//                   )}
//                 />
//               </View>

//               {/* Dialog Footer */}
//               <View style={styles.footer}>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => setOpen(false)}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.saveButton,
//                     (!isValid || isSubmitting) && styles.saveButtonDisabled,
//                   ]}
//                   onPress={handleSubmit(onSubmit)}
//                   disabled={!isValid || isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.saveButtonText}>Save</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         {/* Toast Notifications */}
//         <Toast />
//       </>
//     );
//   };

// const styles = StyleSheet.create({
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     dialogContainer: {
//         width: '90%',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 20,
//     },
//     dialogTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     dialogType: {
//         textTransform: 'capitalize',
//     },
//     incomeColor: {
//         color: '#4CAF50',
//     },
//     expenseColor: {
//         color: '#FF5722',
//     },
//     dialogDescription: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 20,
//     },
//     formContainer: {
//         marginBottom: 20,
//     },
//     formField: {
//         marginBottom: 15,
//     },
//     fieldLabel: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         marginBottom: 5,
//     },
//     textInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         padding: 10,
//         fontSize: 14,
//         backgroundColor: '#F9F9F9',
//     },
//     fieldDescription: {
//         fontSize: 12,
//         color: '#999',
//         marginTop: 5,
//     },
//     iconPicker: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         padding: 10,
//         alignItems: 'center',
//         backgroundColor: '#F9F9F9',
//     },
//     iconPreview: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     iconText: {
//         fontSize: 20,
//         marginRight: 10,
//     },
//     iconPlaceholder: {
//         fontSize: 20,
//         color: '#ccc',
//     },
//     emojiSelectorContainer: {
//         marginTop: 10,
//         height: 300,
//     },
//     footer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     cancelButton: {
//         flex: 1,
//         padding: 10,
//         backgroundColor: '#ccc',
//         borderRadius: 5,
//         marginRight: 10,
//         alignItems: 'center',
//     },
//     cancelButtonText: {
//         color: '#333',
//         fontSize: 14,
//     },
//     saveButton: {
//         flex: 1,
//         padding: 10,
//         backgroundColor: '#4CAF50',
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     saveButtonDisabled: {
//         backgroundColor: '#888',
//     },
//     saveButtonText: {
//         color: '#fff',
//         fontSize: 14,
//     },
//     triggerButton: {
//         backgroundColor: '#2196F3',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     triggerButtonText: {
//         color: '#fff',
//         fontSize: 14,
//     },
// });





import React, { useCallback, useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useForm, Controller } from 'react-hook-form';
import EmojiSelector from 'react-native-emoji-selector';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import { db, auth } from "../../config/firebaseConfig";
import { getUserByEmail, storeUserCategories, updateCategoryAttempts, deleteCategoryByUserId } from "../services/firebaseSettings"
// import { CreateCategory } from "../actions/categories.action";
import { hasSubscription } from "../services/stripe.services";

// Define a schema using Yup for validation
const CreateCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    icon: Yup.string().required('Icon is required'),
    type: Yup.string().oneOf(['income', 'expense'], 'Invalid category type').required('Type is required'),
});

export const CreateCategoryDialogButton = ({ type, onSuccessCallback }) => {

    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    //
    const { control, handleSubmit, formState: { isValid, isSubmitting }, reset } = useForm({
      defaultValues: {
        name: "",
        icon: "",
        type: type || "income", // Provide a fallback if type is not explicitly passed
      },
    });


    useEffect(() => {
        const fetchUserEmail = async () => {
            const userId = await AsyncStorage.getItem("userId");
            const email = await AsyncStorage.getItem("userEmail");
            const userInfo = await AsyncStorage.getItem("userInfo");
            setUserId(userId); // Set email for later use in database
            setUserEmail(email); // Set email for later use in database
            setUserInfo(userInfo); // Set email for later use in database
        };
        fetchUserEmail();
    }, []);

    //
    const onSubmit = useCallback(
      async (values) => {
        Toast.show({
          type: 'info',
          text1: 'Creating Category...',
        });

        try {
          const response = await createCategory(values);

          if (!response || !response.name) {
            throw new Error("Category creation failed.");
          }

          Toast.show({
            type: 'success',
            text1: `Category ${response.name} created successfully!`,
          });

          onSuccessCallback(response);

          reset();
          setOpen(false);

        } catch (error) {
          console.error("Error:", error);
          Toast.show({
            type: 'error',
            text1: 'Failed to create category',
            text2: error.message || 'Please try again.',
          });
        }
      },
      [onSuccessCallback, reset]
    );

    //
    const createCategory = async (value) => {
      try {
        // Validate input
        const parsedBody = await CreateCategorySchema.validate(value, { abortEarly: false });

        const { name, icon, type } = parsedBody;
        const userid = auth.currentUser?.uid;
        if (!userid) throw new Error("User is not authenticated.");

        // Prepare category data
        const data = { name, icon, type };

        // Store category in Firestore
        await storeUserCategories(userid, data);
        return { name, icon, type }; // Return the created category details
      } catch (error) {
        console.error("Error during category creation:", error);
        throw new Error(error.message || "An unknown error occurred");
      }
    };

    return (
      // <>


        <View style={{ padding: 10 }}>{/* Trigger Button */}

        {/* <TouchableOpacity
          style={styles.triggerButton}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.triggerButtonText}>Create New</Text>
        </TouchableOpacity> */}

        <Button
          title="Create New"
          onPress={() => setOpen(true)}
          color="#007bff" // You can customize the button color here
        />


        {/* Dialog Content */}
        <Modal visible={open} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>
                Create{" "}
                <Text
                  style={[
                    styles.dialogType,
                    type === "income"
                      ? styles.incomeColor
                      : styles.expenseColor,
                  ]}
                >
                  {type}
                </Text>{" "}
                Category
              </Text>
              <Text style={styles.dialogDescription}>
                Categories are used to group your transactions.
              </Text>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* Name Field */}
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Name</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Category"
                        onChangeText={onChange}
                        value={value}
                      />
                      <Text style={styles.fieldDescription}>
                        This is how your category will appear.
                      </Text>
                    </View>
                  )}
                />

                {/* Icon Field */}
                <Controller
                  control={control}
                  name="icon"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Icon</Text>
                      <TouchableOpacity
                        style={styles.iconPicker}
                        onPress={() => setIsEmojiPickerOpen(true)}
                      >
                        {value ? (
                          <View style={styles.iconPreview}>
                            <Text style={styles.iconText}>{value}</Text>
                            {/* <Text>Click To Select Icon</Text> */}
                          </View>
                        ) : (
                          <View style={styles.iconPreview}>
                            <Text style={styles.iconPlaceholder}>⛔</Text>
                            <Text>Click To Select Icon</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {isEmojiPickerOpen && (
                        <View style={styles.emojiSelectorContainer}>

                          {/* <EmojiInput
                            onEmojiSelected={(emoji) => {
                              onChange(emoji);
                              setIsEmojiPickerOpen(false);
                            }}
                            showSearch={true} // Show search bar
                            categories={null} // Customize categories
                          /> */}

                          <EmojiSelector
                            onEmojiSelected={(emoji) => {
                              onChange(emoji);
                              setIsEmojiPickerOpen(false);
                            }}
                            // category={Categories.Smileys}
                            // categories={['people', 'nature', 'food', 'objects']}
                            showSearchBar={true}
                            searchPlaceholder="Search Emoji..."
                            searchBarStyle={{ height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', paddingLeft: 10 }}
                            categoryStyle={{ fontSize: 18, fontWeight: 'bold', color: 'blue' }}
                            // style={{
                            //   height: 400,
                            //   width: '100%',
                            // }}
                          />

                        </View>
                      )}
                      {/* <Text style={styles.fieldDescription}>
                        This Icon will appear in the category.
                      </Text> */}
                    </View>
                  )}
                />
              </View>

              {/* Dialog Footer */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setOpen(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (!isValid || isSubmitting) && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Toast Notifications */}
        <Toast />
        </View>
      // </>
    );
  };

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dialogType: {
        textTransform: 'capitalize',
    },
    incomeColor: {
        color: '#4CAF50',
    },
    expenseColor: {
        color: '#FF5722',
    },
    dialogDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
    },
    formField: {
        marginBottom: 15,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#F9F9F9',
    },
    fieldDescription: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    iconPicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    iconPreview: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
        marginRight: 10,
    },
    iconPlaceholder: {
        fontSize: 20,
        color: '#ccc',
    },
    emojiSelectorContainer: {
        marginTop: 10,
        height: 300,
    },
    footer: {
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 14,
    },
    saveButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#888',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    triggerButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    triggerButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

