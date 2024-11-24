// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
// import Feather from "react-native-vector-icons/Feather";

// import { DeleteCategoryDialog } from "./delete-category-dialog";

// const screenWidth = Dimensions.get("window").width;
// const cardSize = (screenWidth - 60) / 5;

// const CategoryCard = ({ category, isDefault }) => {
//   return (
//     <View style={[styles.card, isDefault ? styles.defaultCard : null]}>
//       <View style={styles.content}>
//         <Text style={styles.icon} accessibilityRole="image">
//           {category.icon || "❓"}
//         </Text>
//         <Text style={styles.categoryName}>{category.name}</Text>
//       </View>
//       {!isDefault && (
//         <DeleteCategoryDialog category={category}>
//           <TouchableOpacity style={styles.button}>
//             <Feather name="trash-2" size={20} color="#6b7280" style={styles.iconSpacing} />
//             <Text style={styles.buttonText}>Remove</Text>
//           </TouchableOpacity>
//         </DeleteCategoryDialog>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: cardSize,
//     height: cardSize,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderStyle: "dashed",
//     borderRadius: 8,
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f9fafb",
//     margin: 5,
//   },
//   content: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 8,
//   },
//   icon: {
//     fontSize: 32,
//   },
//   categoryName: {
//     fontSize: 14,
//     color: "#6b7280",
//     fontWeight: "500",
//     textAlign: "center",
//   },
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 4,
//     backgroundColor: "transparent",
//   },
//   buttonText: {
//     color: "#6b7280",
//     fontSize: 12,
//   },
//   iconSpacing: {
//     marginRight: 4,
//   },
// });

// export { CategoryCard };



import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { DeleteCategoryDialog } from "./delete-category-dialog";

export const CategoryCard = ({ category, isDefault, onDeleteSuccess }) => {
  return (
    <View style={[styles.card, isDefault ? styles.defaultCard : null]}>
      <Text style={styles.icon}>{category.icon || "❓"}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
      {!isDefault && (
        <DeleteCategoryDialog category={category} onSuccessCallback={onDeleteSuccess}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Feather name="trash-2" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </DeleteCategoryDialog>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "30%", // Adjust percentage width to ensure three items per row
    height: 120, // Increase height slightly for better touchable area
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15, // Adjust spacing between rows
    backgroundColor: "#f9fafb",
  },
  icon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center", // Ensure text aligns properly
  },
  buttonContainer: {
    marginTop: 10,
    zIndex: 10, // Ensure button is on top of other components
  },
  button: {
    padding: 8, // Increase touchable area of the button
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});