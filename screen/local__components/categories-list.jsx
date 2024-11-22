// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { SkeletonWrapper } from "../global_components/skeleton-wrapper";
// import { Separator } from "../ui/separator";
// import { CategoryCard } from "./category-card";
// import { CreateCategoryDialog } from "./create-category-dialog";
// import { getUserCategories, getDefaultCategories, getUserById } from "../services/firebaseSettings";
// import { db, auth } from "../../config/firebaseConfig";

// export const CategoriesList = ({ type }) => {

//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
    
//     const fetchUserData = async () => {
//         const userId = await AsyncStorage.getItem("userId");
//         const email = await AsyncStorage.getItem("userEmail");
//         const userInfo = await AsyncStorage.getItem("userInfo");
//         console.log()
//         setUserId(userId);
//         setUserEmail(email);
//         setUserInfo(userInfo);
//     };

//     fetchUserData();

//   }, [])

//   const fetchCategories = async () => {

//     const auth.currentUser?.uid;

//     console.log("userid:", userid);
//     console.log("userId:", userId);
//     console.log("type:", type);
  
//     if (!userId) {
//       console.error("User ID is not available. Ensure the user is logged in.");
//       setError("User ID is required.");
//       setIsLoading(false);
//       return;
//     }
  
//     setIsLoading(true);
//     setError(null);
  
//     try {

//       const userCategories = await getUserCategories(userId, type) || [];
//       const defaultCategories = await getDefaultCategories(type) || [];
//       const combinedCategories = [
//         ...defaultCategories.map(category => ({
//           ...category,
//           isDefault: true,
//         })),
//         ...userCategories.map(category => ({
//           ...category,
//           isDefault: false,
//         })),
//       ];
//       setCategories(combinedCategories);
//     } 
//     catch (err) {
//       console.error("Error fetching categories:", err);
//       setError(err.message || "Failed to fetch categories");
//     } 
//     finally {
//       setIsLoading(false);
//     }

//   };

//   useEffect(() => {
//     if (userId) {
//       fetchCategories();
//     }
//   }, [userId]);

//   const dataAvailable = categories.length > 0;

//   return (
//     <SkeletonWrapper isLoading={isLoading} fullWidth>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitle}>
//             <View style={styles.iconWrapper}>
//               {
//                 type === "expense" ? (
//                   <Icon name="arrow-down" style={[styles.icon, styles.expenseIcon]} />
//                 ) : (
//                   <Icon name="arrow-up" style={[styles.icon, styles.incomeIcon]} />
//                 )
//               }
//               <View>
//                 <Text style={styles.categoryText}>
//                   {type === "expense" ? "Expense" : "Income"} Categories
//                 </Text>
//                 <Text style={styles.sortedText}>Sorted by name</Text>
//               </View>
//             </View>
//             <CreateCategoryDialog
//               type={type}
//               onSuccessCallback={fetchCategories} // Use fetchCategories directly
//             />
//           </View>
//         </View>

//         <Separator />

//         {!dataAvailable ? (
//           <View style={styles.noDataContainer}>
//             <Text>
//               No{" "}
//               <Text
//                 style={[
//                   styles.noDataText,
//                   type === "expense" ? styles.expenseText : styles.incomeText,
//                 ]}
//               >
//                 {type}
//               </Text>{" "}
//               categories yet
//             </Text>
//             <Text style={styles.noDataSubText}>
//               Create a category to get started!
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.categoryList}>
//             {categories.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 category={category}
//                 isDefault={category.isDefault}
//               />
//             ))}
//           </View>
//         )}

//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}
//       </View>
//     </SkeletonWrapper>
//   );

// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     margin: 10,
//   },
//   cardHeader: {
//     padding: 10,
//   },
//   cardTitle: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   iconWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   icon: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     padding: 8,
//   },
//   expenseIcon: {
//     backgroundColor: "rgba(248, 56, 56, 0.1)",
//     color: "#f83838",
//   },
//   incomeIcon: {
//     backgroundColor: "rgba(0, 204, 118, 0.1)",
//     color: "#00cc76",
//   },
//   categoryText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   sortedText: {
//     fontSize: 12,
//     color: "gray",
//   },
//   noDataContainer: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     height: 160,
//   },
//   noDataText: {
//     fontSize: 16,
//   },
//   noDataSubText: {
//     fontSize: 12,
//     color: "gray",
//   },
//   errorContainer: {
//     padding: 10,
//     backgroundColor: "#f8d7da",
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   errorText: {
//     color: "#721c24",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   categoryList: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     padding: 8,
//   },
//   expenseText: {
//     color: "#f83838",
//   },
//   incomeText: {
//     color: "#00cc76",
//   },
// });



import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SkeletonWrapper } from "../global_components/skeleton-wrapper";
import { Separator } from "../ui/separator";
import { CategoryCard } from "./category-card";
import { CreateCategoryDialog } from "./create-category-dialog";
import { getUserCategories, getDefaultCategories } from "../services/firebaseSettings";
import { auth } from "../../config/firebaseConfig";

export const CategoriesList = ({ type }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const userCategories = await getUserCategories(userId, type) || [];
      const defaultCategories = await getDefaultCategories(type) || [];
      const combinedCategories = [
        ...defaultCategories.map((category) => ({ ...category, isDefault: true })),
        ...userCategories.map((category) => ({ ...category, isDefault: false })),
      ];

      // console.log("combinedCategories: ", combinedCategories)

      setCategories(combinedCategories);

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

  return (
    <SkeletonWrapper isLoading={isLoading} fullWidth>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitle}>
            <View style={styles.iconWrapper}>
              {type === "expense" ? (
                <Icon name="arrow-down" style={[styles.icon, styles.expenseIcon]} />
              ) : (
                <Icon name="arrow-up" style={[styles.icon, styles.incomeIcon]} />
              )}
              <View>
                <Text style={styles.categoryText}>
                  {type === "expense" ? "Expense" : "Income"} Categories
                </Text>
                <Text style={styles.sortedText}>Sorted by name</Text>
              </View>
            </View>
            <CreateCategoryDialog type={type} onSuccessCallback={fetchCategories} />
          </View>
        </View>

        <Separator />

        {categories.length > 0 ? (
          <View style={styles.categoryList}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isDefault={category.isDefault}
                onDeleteSuccess={fetchCategories}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text>No categories found. Create one to get started!</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </SkeletonWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
  },
  cardHeader: { padding: 10 },
  cardTitle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconWrapper: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 48, height: 48, borderRadius: 12, padding: 8 },
  expenseIcon: { backgroundColor: "rgba(248, 56, 56, 0.1)", color: "#f83838" },
  incomeIcon: { backgroundColor: "rgba(0, 204, 118, 0.1)", color: "#00cc76" },
  categoryText: { fontSize: 18, fontWeight: "bold" },
  sortedText: { fontSize: 12, color: "gray" },
  noDataContainer: { alignItems: "center", marginTop: 20 },
  errorContainer: { padding: 10, backgroundColor: "#f8d7da", borderRadius: 5 },
  errorText: { color: "#721c24", fontWeight: "bold" },
  categoryList: { flexDirection: "row", flexWrap: "wrap", padding: 10 },
});
