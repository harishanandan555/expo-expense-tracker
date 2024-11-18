// import React from "react";
// import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
// import Toast from "react-native-toast-message";
// import { useStripe } from "../hooks/use-stripe";

// export const BillingSection = () => {
//   const { hasAccess, onManageBilling, isLoading } = useStripe();

//   return (
//     <View style={[styles.card, isLoading && styles.loading]}>
//       <View style={styles.header}>
//         <View style={styles.titleContainer}>
//           <View style={styles.iconContainer}>
//             {/* Replace with an appropriate icon library */}
//             <Text style={styles.icon}>💳</Text>
//           </View>
//           <Text style={styles.title}>Billing Information</Text>
//         </View>
//         <TouchableOpacity onPress={onManageBilling} style={styles.ghostButton}>
//           <Text style={styles.buttonText}>Manage Billing</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.separator} />

//       <View style={styles.content}>
//         <View style={styles.userInfo}>
//           <Text style={styles.userText}>
//             {hasAccess ? "You're A" : "Become A"}{" "}
//             <Text style={styles.premiumText}>Premium</Text> User
//           </Text>
//           <Text style={styles.description}>
//             {hasAccess
//               ? "Enjoy all premium user features."
//               : "Upgrade to premium user and enjoy all features."}
//           </Text>
//         </View>

//         {!hasAccess ? (
//           <Button
//             title="Upgrade"
//             onPress={() => {
//               Toast.show({ text1: "Redirecting to upgrade...", type: "info" });
//               // Navigate to upgrade screen
//             }}
//           />
//         ) : (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>Premium User</Text>
//           </View>
//         )}
//       </View>
//       <Toast ref={(ref) => Toast.setRef(ref)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   loading: {
//     opacity: 0.5,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   iconContainer: {
//     backgroundColor: "#87CEEB33",
//     padding: 8,
//     borderRadius: 8,
//   },
//   icon: {
//     fontSize: 24,
//     color: "#87CEEB",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   ghostButton: {
//     backgroundColor: "transparent",
//   },
//   buttonText: {
//     color: "#1E90FF",
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#EEE",
//     marginVertical: 16,
//   },
//   content: {
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   userInfo: {
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   userText: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   premiumText: {
//     color: "#FFD700",
//   },
//   description: {
//     color: "#888",
//     textAlign: "center",
//     marginTop: 4,
//   },
//   badge: {
//     backgroundColor: "#FFD700",
//     padding: 8,
//     borderRadius: 4,
//   },
//   badgeText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Button, Badge } from "react-native-elements";
import { useStripeMock } from "../hooks/use-media-query"; // mock hook for testing

export const BillingSection = () => {
  const { hasAccess, onManageBilling, isLoading } = useStripeMock();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card containerStyle={{ borderRadius: 8, padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#555" }}>
        Billing Information
      </Text>
      <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", marginVertical: 15 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
            {hasAccess ? "You're A" : "Become A"}{" "}
            <Text style={{ color: "skyblue", fontWeight: "bold" }}>Premium</Text> User
          </Text>
          <Text style={{ fontSize: 14, color: "#777", textAlign: "center", marginVertical: 5 }}>
            {hasAccess
              ? "Enjoy all premium user features."
              : "Upgrade to premium user and enjoy with all features."}
          </Text>
        </View>
        {!hasAccess ? (
          <Button
            title="Upgrade"
            onPress={() => console.log("Navigate to Upgrade")}
            buttonStyle={{ backgroundColor: "orange", paddingHorizontal: 20, marginTop: 10 }}
          />
        ) : (
          <Badge value="Premium User" status="success" containerStyle={{ marginTop: 10 }} />
        )}
      </View>
      <TouchableOpacity onPress={onManageBilling} style={{ marginTop: 10 }}>
        <Text style={{ color: "blue", textAlign: "center", textDecorationLine: "underline" }}>Manage Billing</Text>
      </TouchableOpacity>
    </Card>
  );

};