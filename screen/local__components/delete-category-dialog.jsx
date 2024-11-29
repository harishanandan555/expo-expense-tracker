// import React, { useCallback, useState } from "react";
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import * as Yup from "yup";

// import { deleteCategoryByUserId } from "../services/firebaseSettings";

// const DeleteCategorySchema = Yup.object().shape({
//   name: Yup.string()
//     .min(3, "Name must be at least 3 characters")
//     .max(20, "Name must be less than 20 characters")
//     .required("Name is required"),
//   type: Yup.mixed()
//     .oneOf(["income", "expense"], 'Type must be either "income" or "expense"')
//     .required("Type is required"),
// });

// // export const DeleteCategoryDialog = ({ children, category }) => {

// //   // console.log("children: ", children)
// //   console.log("category: ", category)

// //   const queryClient = useQueryClient();

// //   const [isModalVisible, setModalVisible] = useState(false);

// //   const deleteCategory = async (value) => {
// //     try {
// //       const validatedData = await DeleteCategorySchema.validate(value, {
// //         abortEarly: false,
// //       });

// //       const { name, type } = validatedData;
// //       const response = await deleteCategoryByUserId(name, type); // Replace with actual function call

// //       if (!response?.success) {
// //         throw new Error(response?.message || "Failed to delete category");
// //       }
// //       return validatedData;
// //     } catch (error) {
// //       console.error("Error during category deletion:", error);
// //       throw error;
// //     }
// //   };

// //   const { mutate } = useMutation({
// //     mutationFn: deleteCategory,
// //     onSuccess: async (data) => {
// //       Toast.show({
// //         type: "success",
// //         text1: `Category "${data.name}" deleted successfully!`,
// //         position: "bottom",
// //       });
// //       await queryClient.invalidateQueries(["categories"]);
// //       setModalVisible(false);
// //     },
// //     onError: (error) => {
// //       Toast.show({
// //         type: "error",
// //         text1: "Error deleting category",
// //         text2: error.message || "Something went wrong",
// //         position: "bottom",
// //       });
// //       setModalVisible(false);
// //     },
// //   });

// //   const onDelete = useCallback(() => {
// //     Toast.show({
// //       type: "info",
// //       text1: "Deleting category...",
// //       position: "bottom",
// //     });
// //     mutate({ name: category.name, type: category.type });
// //   }, [mutate, category]);

// //   return (
// //     <>
// //       <TouchableOpacity onPress={() => setModalVisible(true)}>
// //         {children}
// //       </TouchableOpacity>

// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={isModalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.title}>
// //               Delete {category.icon} {category.name} category
// //             </Text>
// //             <Text style={styles.description}>
// //               This action cannot be undone.
// //             </Text>
// //             <View style={styles.footer}>
// //               <TouchableOpacity
// //                 style={styles.cancelButton}
// //                 onPress={() => setModalVisible(false)}
// //               >
// //                 <Text style={styles.buttonText}>Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={styles.confirmButton}
// //                 onPress={onDelete}
// //               >
// //                 <Text style={styles.buttonText}>Confirm</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </>
// //   );
// // };

// export const DeleteCategoryDialog = ({ children, category }) => {

//   console.log("category1: ", category)
//   const queryClient = useQueryClient();
//   const [isModalVisible, setModalVisible] = useState(false);

//   const deleteCategory = async ({ name, type }) => {
//     try {
//       const validatedData = await DeleteCategorySchema.validate({ name, type }, { abortEarly: false });
//       const response = await deleteCategoryByUserId(name, type); // Ensure this function is implemented correctly

//       if (!response?.success) {
//         throw new Error(response?.message || "Failed to delete category");
//       }
//       return validatedData;
//     } catch (error) {
//       console.error("Error during category deletion:", error);
//       throw error;
//     }
//   };

//   const { mutate } = useMutation({
//     mutationFn: deleteCategory,
//     onSuccess: async (data) => {
//       Toast.show({
//         type: "success",
//         text1: `Category "${data.name}" deleted successfully!`,
//         position: "bottom",
//       });
//       await queryClient.invalidateQueries(["categories"]);
//       setModalVisible(false);
//     },
//     onError: (error) => {
//       Toast.show({
//         type: "error",
//         text1: "Error deleting category",
//         text2: error.message || "Something went wrong",
//         position: "bottom",
//       });
//       setModalVisible(false);
//     },
//   });

//   const onDelete = useCallback(() => {
//     if (!category || !category.name || !category.type) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid category data",
//         position: "bottom",
//       });
//       return;
//     }

//     Toast.show({
//       type: "info",
//       text1: "Deleting category...",
//       position: "bottom",
//     });
//     mutate({ name: category.name, type: category.type });
//   }, [mutate, category]);

//   return (
//     <>
//       <TouchableOpacity onPress={() => setModalVisible(true)}>
//         {children}
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.title}>
//               Delete {category.icon} {category.name} category
//             </Text>
//             <Text style={styles.description}>
//               This action cannot be undone.
//             </Text>
//             <View style={styles.footer}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.confirmButton}
//                 onPress={onDelete}
//               >
//                 <Text style={styles.buttonText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: "80%",
//     padding: 20,
//     backgroundColor: "white",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   description: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   cancelButton: {
//     padding: 10,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 4,
//     flex: 1,
//     marginRight: 5,
//     alignItems: "center",
//   },
//   confirmButton: {
//     padding: 10,
//     backgroundColor: "#ef4444",
//     borderRadius: 4,
//     flex: 1,
//     marginLeft: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });


import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Button } from "react-native";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

import { db, auth } from "../../config/firebaseConfig";
import { deleteCategoryByUserId } from "../services/firebaseSettings";

const DeleteCategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be less than 20 characters")
    .required("Name is required"),
  type: Yup.mixed()
    .oneOf(["income", "expense"], 'Type must be either "income" or "expense"')
    .required("Type is required"),
});

export const DeleteCategoryDialog = ({ children, category, onSuccessCallback }) => {

  // const [isModalVisible, setModalVisible] = useState(false);

  // const deleteCategory = async (id, name, type, userId) => {
  //   console.log("categoryId: ", categoryId)
  //   try {
  //     const validatedData = await DeleteCategorySchema.validate({ name, type }, { abortEarly: false });
  //     const response = await deleteCategoryByUserId(id, userId, validatedData); // pass categoryId directly
  //     if (!response?.success) {
  //       throw new Error(response?.message || "Failed to delete category");
  //     }
  //     return response;
  //   } catch (error) {
  //     console.error("Error during category deletion:", error);
  //     throw error;
  //   }
  // };

  // const { mutate } = useMutation({
  //   mutationFn: deleteCategory,
  //   onSuccess: () => {
  //     Toast.show({ type: "success", text1: "Category deleted successfully" });
  //     setModalVisible(false);
  //     onSuccessCallback();
  //   },
  //   onError: () => {
  //     Toast.show({ type: "error", text1: "Failed to delete category" });
  //   },
  // });

  // const userId = auth.currentUser?.uid;

  // const handleDelete = () => {
  //   mutate({ id: category.id, name: category.name, type: category.type, userId });
  // };

  const [isModalVisible, setModalVisible] = useState(false);

  const deleteCategory = async (id, name, type, userId) => {
    console.log("categoryId: ", id);
    try {
      // Validate data before proceeding with the deletion
      const validatedData = await DeleteCategorySchema.validate({ name, type }, { abortEarly: false });
      const response = await deleteCategoryByUserId(id, userId, validatedData); // pass categoryId directly
      if (!response?.success) {
        throw new Error(response?.message || "Failed to delete category");
      }

      // If the category is deleted successfully
      Toast.show({ type: "success", text1: "Category deleted successfully" });
      setModalVisible(false);
      onSuccessCallback();
    } catch (error) {
      // Handle errors
      console.error("Error during category deletion:", error);
      Toast.show({ type: "error", text1: "Failed to delete category" });
    }
  };

  const userId = auth.currentUser?.uid;

  const handleDelete = () => {
    deleteCategory(category.id, category.name, category.type, userId);
  };

  return (
    // <>
    //   <TouchableOpacity onPress={() => setModalVisible(true)}>{children}</TouchableOpacity>

    //   <Modal visible={isModalVisible} transparent>
    //     <View style={styles.modalOverlay}>
    //       <View style={styles.modalContent}>
    //         <Text>Delete {category.icon} {category.name} category?</Text>
    //         <TouchableOpacity onPress={handleDelete}>
    //           <Text>Confirm</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity onPress={() => setModalVisible(false)}>
    //           <Text>Cancel</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </Modal>
    // </>

    <>
    {/* The trigger button is outside the modal */}
    <Button title="Delete" onPress={() => setModalVisible(true)} />

    <Modal visible={isModalVisible} transparent animationType="fade">

      <View style={styles.modalOverlay}>

        <View style={styles.modalContent}>

          <Text> Delete {category.icon} {category.name} category? </Text>

          {/* Confirm deletion */}
          <Button title="Confirm" onPress={handleDelete} color="red" />

          {/* Cancel deletion */}
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />

        </View>

      </View>

    </Modal>

  </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContent: { padding: 20, backgroundColor: "white", borderRadius: 10 },
});