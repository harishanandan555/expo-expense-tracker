// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Trash } from "react-native-vector-icons/Feather"; // Assuming `react-native-vector-icons` is used

// import { DeleteCategoryDialog } from "./delete-category-dialog";

// const CategoryCard = ({ category, isDefault }) => {
//   return (
//     <View style={[styles.card, isDefault ? styles.defaultCard : null]}>
//       <View style={styles.content}>
//         <Text style={styles.icon} accessibilityRole="image">
//           {category.icon}
//         </Text>
//         <Text style={styles.categoryName}>{category.name}</Text>
//       </View>
//       {!isDefault && (
//         <DeleteCategoryDialog category={category}>
//           <TouchableOpacity style={styles.button}>
//             <Trash name="trash-2" size={16} color="#6b7280" style={styles.iconSpacing} />
//             <Text style={styles.buttonText}>Remove</Text>
//           </TouchableOpacity>
//         </DeleteCategoryDialog>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderWidth: 1,
//     borderColor: "#d1d5db", // Equivalent to border color
//     borderStyle: "dashed",
//     borderRadius: 8,
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: 160,
//     padding: 16,
//     backgroundColor: "#f9fafb",
//   },
//   content: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 8,
//   },
//   icon: {
//     fontSize: 24,
//   },
//   categoryName: {
//     fontSize: 18,
//     color: "#6b7280", // Equivalent to text-muted-foreground
//     fontWeight: "500",
//   },
//   button: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 8,
//     backgroundColor: "transparent",
//   },
//   buttonText: {
//     color: "#6b7280",
//     fontSize: 16,
//   },
//   iconSpacing: {
//     marginRight: 8,
//   },
// });

// export { CategoryCard };


import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Trash } from "react-native-vector-icons/Feather"; // Assuming `react-native-vector-icons` is used

import { DeleteCategoryDialog } from "./delete-category-dialog";

const screenWidth = Dimensions.get("window").width; // Get screen width
const cardSize = (screenWidth - 60) / 5; // Space for 5 cards per row, including padding

const CategoryCard = ({ category, isDefault }) => {
  return (
    <View style={[styles.card, isDefault ? styles.defaultCard : null]}>
      <View style={styles.content}>
        <Text style={styles.icon} accessibilityRole="image">
          {category.icon}
        </Text>
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
      {!isDefault && (
        <DeleteCategoryDialog category={category}>
          <TouchableOpacity style={styles.button}>
            <Trash name="trash-2" size={20} color="#6b7280" style={styles.iconSpacing} />
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </DeleteCategoryDialog>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardSize, // Ensure equal width for all cards
    height: cardSize, // Ensure square cards
    borderWidth: 1,
    borderColor: "#d1d5db", // Border color
    borderStyle: "dashed",
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    margin: 5, // Add spacing between cards
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 32, // Increased icon size
  },
  categoryName: {
    fontSize: 14,
    color: "#6b7280", // Muted text color
    fontWeight: "500",
    textAlign: "center", // Center-align text
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#6b7280",
    fontSize: 12,
  },
  iconSpacing: {
    marginRight: 4,
  },
});

export { CategoryCard };