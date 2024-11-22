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
          <TouchableOpacity style={styles.button}>
            <Feather name="trash-2" size={20} color="#6b7280" />
          </TouchableOpacity>
        </DeleteCategoryDialog>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 100,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    backgroundColor: "#f9fafb",
  },
  icon: { fontSize: 32 },
  categoryName: { fontSize: 14, marginTop: 5 },
  button: { marginTop: 10 },
});
