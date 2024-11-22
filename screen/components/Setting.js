import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TypographyH2 } from "../global_components/typography-h2";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card";
import { CurrencyComboBox } from "../global_components/currency-combo-box";
import { BillingSection } from "../local__components/billing-section";
import { CategoriesList } from "../local__components/categories-list";

const queryClient = new QueryClient();

const SettingsScreen = () => {

  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
        const userId = await AsyncStorage.getItem("userId");
        const email = await AsyncStorage.getItem("userEmail");
        const userInfo = await AsyncStorage.getItem("userInfo");
        // console.log("userId: ", userId)
        setUserId(userId); // Set email for later use in database
        setUserEmail(email); // Set email for later use in database
        setUserInfo(userInfo); // Set email for later use in database
    };
    fetchUserData();
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        
          {/* Header */}
          <View style={styles.header}>
            <TypographyH2>Settings</TypographyH2>
            <Text style={styles.subtitle}>Manage your settings and categories</Text>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Currency Section */}
          <Card>
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>Set your default currency.</CardDescription>
            </CardHeader>
            <CardContent>
              <CurrencyComboBox />
            </CardContent>
          </Card>
            
          {/* Billing Section (optional) */}
          <BillingSection />

          {/* Categories Lists */}
          <CategoriesList type="income" />
          <CategoriesList type="expense" />
          
        </ScrollView>
      </View>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContainer: {
      padding: 10,
    },
    header: {
      marginBottom: 10,
      padding: 15, // Added padding for spacing inside the header
      borderWidth: 1, // Added border
      borderColor: "#ddd", // Light border color
      borderRadius: 8, // Rounded corners
      backgroundColor: "#f9f9f9", // Light background for better contrast
      shadowColor: "#000", // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.1, // Shadow opacity
      shadowRadius: 4, // Shadow blur radius
      elevation: 3, // Shadow for Android
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333", // Slightly darker text for better readability
    },
    subtitle: {
      fontSize: 16,
      color: "#666", // Muted text for subtitle
      marginTop: 5, // Space between title and subtitle
    },
    card: {
      marginBottom: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    cardDescription: {
      fontSize: 14,
      color: "gray",
    },
    comboBox: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
      alignItems: "center",
    },
});

export default SettingsScreen;