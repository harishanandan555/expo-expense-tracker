// import React from "react";
// import { TouchableOpacity, Text } from 'react-native';

// const SettingScreen = () =>{
//     return (
//         <TouchableOpacity>
//         <Text>Setting Screen</Text>
//       </TouchableOpacity>
//       );
// }

// export default SettingScreen;


// import React from "react";
// import { View, Text, ScrollView, StyleSheet } from 'react-native';

// import { TypographyH2 } from "../global_components/typography-h2";
// import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card";
// import { CurrencyComboBox } from "../global_components/currency-combo-box"; 
// import { BillingSection } from "../local__components/billing-section"; 
// import { CategoriesList } from "../local__components/categories-list"; 

// const SettingsScreen = () => {
// 	return (
//     <View style={styles.container}>

//     <View style={styles.header}>
//         <TypographyH2>Settings</TypographyH2>
//         <Text style={styles.subtitle}>Manage your settings and categories</Text>
//     </View>

//     {/* <View style={styles.card}>
//         <Text style={styles.cardTitle}>Currency</Text>
//         <Text style={styles.cardDescription}>Set your default currency.</Text>
//         Replace with your CurrencyComboBox component
//         <TouchableOpacity style={styles.comboBox}>
//             <Text>Select Currency</Text>
//         </TouchableOpacity>
//     </View> */}

//     <Card>
//       <CardHeader>
//         <CardTitle>Currency</CardTitle>
//         <CardDescription>Set your default currency.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <CurrencyComboBox />
//       </CardContent>
//     </Card>

//     {/* Replace with your BillingSection component */}
//     <BillingSection />
//     {/* <View style={styles.card}>
//         <Text style={styles.cardTitle}>Billing Section</Text>
//     </View> */}

//     {/* Replace with your CategoriesList component for income */}
//     {/* <View style={styles.card}>
//         <Text style={styles.cardTitle}>Income Categories</Text>
//     </View> */}

//     <CategoriesList type="income" />

//     {/* Replace with your CategoriesList component for expense */}
//     {/* <View style={styles.card}>
//         <Text style={styles.cardTitle}>Expense Categories</Text>
//     </View> */}
    
//     <CategoriesList type="expense" />

// </View>
// 	);
// };

// const styles = StyleSheet.create({
//   container: {
//       padding: 10,
//       backgroundColor: '#fff',
//       flex: 1,
//   },
//   header: {
//       marginBottom: 10,
//   },
//   title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//   },
//   subtitle: {
//       fontSize: 16,
//       color: 'gray',
//   },
//   card: {
//       marginBottom: 10,
//       padding: 15,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 8,
//   },
//   cardTitle: {
//       fontSize: 18,
//       fontWeight: '600',
//   },
//   cardDescription: {
//       fontSize: 14,
//       color: 'gray',
//   },
//   comboBox: {
//       marginTop: 10,
//       padding: 10,
//       backgroundColor: '#f0f0f0',
//       borderRadius: 5,
//       alignItems: 'center',
//   },
// });

// export default SettingsScreen;




import React from "react";
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { TypographyH2 } from "../global_components/typography-h2";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card";

import { CurrencyComboBox } from "../global_components/currency-combo-box"; 

import { BillingSection } from "../local__components/billing-section"; 

import { CategoriesList } from "../local__components/categories-list"; 

const SettingsScreen = () => {
	return (
    <View style={styles.container}>

    <View style={styles.header}>
        <TypographyH2>Settings</TypographyH2>
        <Text style={styles.subtitle}>Manage your settings and categories</Text>
    </View>

    <Card>
      <CardHeader>
        <CardTitle>Currency</CardTitle>
        <CardDescription>Set your default currency.</CardDescription>
      </CardHeader>
      <CardContent>

        <CurrencyComboBox />

      </CardContent>
    </Card>

    <BillingSection />

    <CategoriesList type="income" />
    
    <CategoriesList type="expense" />

</View>
	);
};

const styles = StyleSheet.create({
  container: {
      padding: 10,
      backgroundColor: '#fff',
      flex: 1,
  },
  header: {
      marginBottom: 10,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  subtitle: {
      fontSize: 16,
      color: 'gray',
  },
  card: {
      marginBottom: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: '600',
  },
  cardDescription: {
      fontSize: 14,
      color: 'gray',
  },
  comboBox: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      alignItems: 'center',
  },
});

export default SettingsScreen;
