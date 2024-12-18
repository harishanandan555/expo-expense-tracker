// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { SkeletonWrapper } from "../global_components/skeleton-wrapper";
// import { Separator } from "../ui/separator";
// import { CategoryCard } from "./category-card";
// import { CreateCategoryDialog } from "./create-category-dialog";
// import { getUserCategories, getDefaultCategories } from "../services/firebaseSettings";
// import { auth } from "../../config/firebaseConfig";

// export const CategoriesList = ({ type }) => {
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const userId = await AsyncStorage.getItem("userId");
//       setUserId(userId);
//     };
//     fetchUserData();
//   }, []);

//   const fetchCategories = async () => {
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
//         ...defaultCategories.map((category) => ({ ...category, isDefault: true })),
//         ...userCategories.map((category) => ({ ...category, isDefault: false })),
//       ];

//       // console.log("combinedCategories: ", combinedCategories)

//       setCategories(combinedCategories);

//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError(err.message || "Failed to fetch categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchCategories();
//     }
//   }, [userId]);

//   return (
//     <SkeletonWrapper isLoading={isLoading} fullWidth>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitle}>
//             <View style={styles.iconWrapper}>
//               {type === "expense" ? (
//                 <Icon name="arrow-down" style={[styles.icon, styles.expenseIcon]} />
//               ) : (
//                 <Icon name="arrow-up" style={[styles.icon, styles.incomeIcon]} />
//               )}
//               <View>
//                 <Text style={styles.categoryText}>
//                   {type === "expense" ? "Expense" : "Income"} Categories
//                 </Text>
//                 <Text style={styles.sortedText}>Sorted by name</Text>
//               </View>
//             </View>
//             <CreateCategoryDialog type={type} onSuccessCallback={fetchCategories} />
//           </View>
//         </View>

//         <Separator />

//         {categories.length > 0 ? (
//           <View style={styles.categoryList}>
//             {categories.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 category={category}
//                 isDefault={category.isDefault}
//                 onDeleteSuccess={fetchCategories}
//               />
//             ))}
//           </View>
//         ) : (
//           <View style={styles.noDataContainer}>
//             <Text>No categories found. Create one to get started!</Text>
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
//   categoryList: {
//     flexDirection: "row",
//     flexWrap: "wrap", // Allows categories to wrap to the next line
//     justifyContent: "space-between", // Ensures proper spacing for three items per row
//     padding: 10,
//   },
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
//     alignItems: "center",
//     marginTop: 20,
//   },
//   errorContainer: {
//     padding: 10,
//     backgroundColor: "#f8d7da",
//     borderRadius: 5,
//   },
//   errorText: {
//     color: "#721c24",
//     fontWeight: "bold",
//   },
// });




// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { SkeletonWrapper } from "../global_components/skeleton-wrapper";
// import { Separator } from "../ui/separator";
// import { CategoryCard } from "./category-card";
// import { CreateCategoryDialog } from "./create-category-dialog";
// import { getUserCategories, getDefaultCategories } from "../services/firebaseSettings";

// export const CategoriesList = () => {
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const userId = await AsyncStorage.getItem("userId");
//       setUserId(userId);
//     };
//     fetchUserData();
//   }, []);

//   const fetchCategories = async () => {
//     if (!userId) {
//       console.error("User ID is not available. Ensure the user is logged in.");
//       setError("User ID is required.");
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Fetch income and expense categories
//       const [userIncomeCategories, userExpenseCategories] = await Promise.all([
//         getUserCategories(userId, "income") || [],
//         getUserCategories(userId, "expense") || [],
//       ]);

//       const [defaultIncomeCategories, defaultExpenseCategories] = await Promise.all([
//         getDefaultCategories("income") || [],
//         getDefaultCategories("expense") || [],
//       ]);

//       // Combine categories with type differentiation
//       const combinedCategories = [
//         ...defaultIncomeCategories.map((category) => ({ ...category, isDefault: true, type: "income" })),
//         ...userIncomeCategories.map((category) => ({ ...category, isDefault: false, type: "income" })),
//         ...defaultExpenseCategories.map((category) => ({ ...category, isDefault: true, type: "expense" })),
//         ...userExpenseCategories.map((category) => ({ ...category, isDefault: false, type: "expense" })),
//       ];

//       setCategories(combinedCategories);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError(err.message || "Failed to fetch categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchCategories();
//     }
//   }, [userId]);

//   return (
//     <SkeletonWrapper isLoading={isLoading} fullWidth>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitle}>
//             <Text style={styles.categoryText}>All Categories</Text>
//             <Text style={styles.sortedText}>Sorted by name</Text>
//           </View>

//             <CreateCategoryDialog onSuccessCallback={fetchCategories} />

//         </View>

//         <Separator />
//         {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
//         {categories.length > 0 ? (
//           <View style={styles.categoryList}>
//             {categories.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 category={category}
//                 isDefault={category.isDefault}
//                 type={category.type} // Pass type to display income/expense-specific UI
//                 onDeleteSuccess={fetchCategories}
//               />
//             ))}
//           </View>
//         ) : (
//           <View style={styles.noDataContainer}>
//             <Text>No categories found. Create one to get started!</Text>
//           </View>
//         )}

//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}
//         {/* </ScrollView> */}
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
//   // scrollContainer: {
//   //   padding: 10,
//   // },
//   cardHeader: {
//     padding: 10,
//   },
//   cardTitle: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   categoryText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   sortedText: {
//     fontSize: 12,
//     color: "gray",
//   },
//   categoryList: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     padding: 10,
//   },
//   noDataContainer: {
//     alignItems: "center",
//     marginTop: 20,
//   },
//   errorContainer: {
//     padding: 10,
//     backgroundColor: "#f8d7da",
//     borderRadius: 5,
//   },
//   errorText: {
//     color: "#721c24",
//     fontWeight: "bold",
//   },
// });




// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { Separator } from "../ui/separator";
// import { CategoryCard } from "./category-card";
// import { CreateCategoryDialogButton } from "./create-category-dialog";
// import { getAllUserCategories, getAllDefaultCategories } from "../services/firebaseSettings";

// export const CategoriesList = ({ theme }) => {

//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const userId = await AsyncStorage.getItem("userId");
//       setUserId(userId);
//     };
//     fetchUserData();
//   }, []);

//   const fetchCategories = async () => {
//     if (!userId) {
//       console.error("User ID is not available. Ensure the user is logged in.");
//       setError("User ID is required.");
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {

//       const userCategories = await getAllUserCategories(userId) || [];
//       const defaultCategories = await getAllDefaultCategories() || [];
//       const combinedCategories = [
//         ...defaultCategories.map((category) => ({ ...category, isDefault: true })),
//         ...userCategories.map((category) => ({ ...category, isDefault: false })),
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

//   return (
//     <View style={{ padding: 0 }}>

//         <CreateCategoryDialogButton theme={theme} onSuccessCallback={fetchCategories} />

//         <Separator theme={theme} />

//         {categories.length > 0 ? (

//           <View style={styles.categoryList}>

//             {categories.map((category) => (

//               <CategoryCard
//                 theme={theme}
//                 key={category.id}
//                 category={category}
//                 isDefault={category.isDefault}
//                 type={category.type}
//                 onDeleteSuccess={fetchCategories}
//               />

//             ))}

//           </View>

//         ) : (

//           <View style={styles.noDataContainer}>
//             <Text style={[styles.noDataText, { color: theme.textColor }]}>
//               No categories found. Create one to get started!
//             </Text>
//           </View>

//         )}

//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
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
//   categoryText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   sortedText: {
//     fontSize: 12,
//   },
//   categoryList: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     // justifyContent: "space-between",
//     padding: 10,
//   },
//   noDataContainer: {
//     alignItems: "center",
//     marginTop: 20,
//   },
//   noDataText: {
//     fontSize: 16,
//   },
//   errorContainer: {
//     padding: 10,
//     backgroundColor: "#f8d7da",
//     borderRadius: 5,
//   },
//   errorText: {
//     color: "#721c24",
//     fontWeight: "bold",
//   },
// });












import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Separator } from "../ui/separator";
import { CategoryCard } from "./category-card";
import { CreateCategoryDialogButton } from "./create-category-dialog";
import { getAllUserCategories, getAllDefaultCategories } from "../services/firebaseSettings";

export const CategoriesList = ({ theme }) => {
  const [categories, setCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);
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

      // const fetchedUserCategories = await getAllUserCategories(userId) || [];
      // const fetchedDefaultCategories = await getAllDefaultCategories() || [];

      // setUserCategories(fetchedUserCategories);
      // setDefaultCategories(fetchedDefaultCategories);

      const userCategories = await getAllUserCategories(userId) || [];
      const defaultCategories = await getAllDefaultCategories() || [];
      const combinedCategories = [
        ...defaultCategories.map((category) => ({ ...category, isDefault: true })),
        ...userCategories.map((category) => ({ ...category, isDefault: false })),
      ];

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
    <View style={[ styles.cardContainer, { padding: 0 }]}>

      <CreateCategoryDialogButton theme={theme} onSuccessCallback={fetchCategories} />

      <Separator theme={theme} />

      <View style={styles.categoryList} >
        {isLoading ? (
          <Text style={{ color: theme.text, textAlign: "center", paddingTop: 10, fontWeight: "bold" }}>Loading categories...</Text>
        ) : (

        <>
          {categories.length > 0 ? (

            <View style={styles.categoryCard}>

              {categories.map((category) => (

                <CategoryCard
                  theme={theme}
                  key={category.id}
                  category={category}
                  isDefault={category.isDefault}
                  type={category.type}
                  onDeleteSuccess={fetchCategories}
                />

              ))}

            </View>

          ) : (

            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: theme.textColor }]}>
                No categories found. Create one to get started!
              </Text>
            </View>

          )}

            {/* {defaultCategories.length > 0 && (
              <View>
                <View style={styles.defaultCategoryList}>
                  {defaultCategories.map((category) => (
                    <CategoryCard
                      theme={theme}
                      key={category.id}
                      category={category}
                      isDefault={true}
                      type={category.type}
                      onDeleteSuccess={fetchCategories}
                    />
                  ))}
                </View>
              </View>
            )}

            {userCategories.length > 0 && (
              <View>
                <View style={styles.userCategoryList}>
                  {userCategories.map((category) => (
                    <CategoryCard
                      theme={theme}
                      key={category.id}
                      category={category}
                      isDefault={false}
                      type={category.type}
                      onDeleteSuccess={fetchCategories}
                    />
                  ))}
                </View>
              </View>
            )} */}

            {/* {defaultCategories.length === 0 && userCategories.length === 0 && (
              <View style={styles.noDataContainer}>
                <Text style={[styles.noDataText, { color: theme.textColor }]}>
                  No categories found. Create one to get started!
                </Text>
              </View>
            )} */}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          {/* </View> */}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
  },
  categoryList:{
  },
  categoryCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingLeft:10,
  },
  defaultCategoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Align cards starting from the left
    justifyContent: "space-between",
    gap: 10, // Adds spacing between cards
    paddingHorizontal: 5, // Small padding for alignment
  },
  userCategoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 5,
  },
  // defaultCategoryList: {
  //   flex: 1,
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   gap:15,
  //   // justifyContent: "space-between",
  //   // padding: 10,
  // },
  // userCategoryList: {
  //   flex: 1,
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   gap:15,
  //   // justifyContent: "space-between",
  //   // padding: 10,
  // },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: "#f8d7da",
    borderRadius: 5,
  },
  errorText: {
    color: "#721c24",
    fontWeight: "bold",
  },
});