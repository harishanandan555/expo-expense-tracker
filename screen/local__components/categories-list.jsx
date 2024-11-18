// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import Icon from "react-native-vector-icons/FontAwesome";

// import { SkeletonWrapper } from "../global_components/skeleton-wrapper";
// import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card";
// import { Separator } from "../ui/separator";
// import { cn } from "../lib/utils";
// import { CategoryCard } from "./category-card";
// import { CreateCategoryDialog } from "./create-category-dialog";

// export const CategoriesList = ({ type }) => {

//   const categoriesQuery = useQuery({
//     queryKey: ["categories", type],
//     queryFn: () =>
//       fetch(`/api/categories?type=${type}`).then((res) => res.json()),
//   });

//   const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

//   return (
//     <SkeletonWrapper isLoading={categoriesQuery.isLoading} fullWidth>
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
//             <CreateCategoryDialog
//               type={type}
//               onSuccessCallback={() => categoriesQuery.refetch()}
//             />
//           </View>
//         </View>

//         <Separator />

//         {!dataAvailable ? (
//           <View style={styles.noDataContainer}>
//             <Text>
//               No
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
//               Create category to get started!
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.categoryList}>
//             {categoriesQuery.data.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 category={category}
//                 isDefault={category.isDefault}
//               />
//             ))}
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
//   noDataText: {
//     fontSize: 16,
//   },
//   expenseText: {
//     color: "#f83838",
//   },
//   incomeText: {
//     color: "#00cc76",
//   },
//   categoryList: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     padding: 8,
//   },
// });




import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card";
import { SkeletonWrapper } from "../global_components/skeleton-wrapper";
import { Separator } from "../ui/separator";
import { CategoryCard } from "./category-card";
import { CreateCategoryDialog } from "./create-category-dialog";
import { getCategories, getDefaultCategories } from "../services/firebaseSettings";

export const CategoriesList = ({ type, userId }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        
        const userCategories = []; 
        // const userCategories = await getCategories(userId, type) || [];
        const defaultCategories = await getDefaultCategories(type) || [];
  
        const combinedCategories = [
          ...defaultCategories.map(category => ({
            ...category,
            isDefault: true,
          })),
          ...userCategories.map(category => ({
            ...category,
            isDefault: false,
          })),
        ];
  
        setCategories(combinedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCategories();
  }, [type, userId]);

  const dataAvailable = categories.length > 0;

  return (
    <SkeletonWrapper isLoading={isLoading} fullWidth>
      <Card>
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
            <CreateCategoryDialog
              type={type}
              onSuccessCallback={() => fetchCategories()} // Refetch categories on dialog success
            />
          </View>
        </View>

        <Separator />

        {!dataAvailable ? (
          <View style={styles.noDataContainer}>
            <Text>
              No{" "}
              <Text
                style={[
                  styles.noDataText,
                  type === "expense" ? styles.expenseText : styles.incomeText,
                ]}
              >
                {type}
              </Text>{" "}
              categories yet
            </Text>
            <Text style={styles.noDataSubText}>
              Create a category to get started!
            </Text>
          </View>
        ) : (
          <View style={styles.categoryList}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isDefault={category.isDefault}
              />
            ))}
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
      </Card>
    </SkeletonWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
  },
  cardHeader: {
    padding: 10,
  },
  cardTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    padding: 8,
  },
  expenseIcon: {
    backgroundColor: "rgba(248, 56, 56, 0.1)",
    color: "#f83838",
  },
  incomeIcon: {
    backgroundColor: "rgba(0, 204, 118, 0.1)",
    color: "#00cc76",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sortedText: {
    fontSize: 12,
    color: "gray",
  },
  noDataContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 160,
  },
  noDataText: {
    fontSize: 16,
  },
  noDataSubText: {
    fontSize: 12,
    color: "gray",
  },
  errorContainer: {
    padding: 10,
    backgroundColor: "#f8d7da",
    borderRadius: 5,
    marginTop: 10,
  },
  errorText: {
    color: "#721c24",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  expenseText: {
    color: "#f83838",
  },
  incomeText: {
    color: "#00cc76",
  },
});
