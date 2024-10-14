import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // // Google OAuth configuration
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: "382896848352-664l10kdn3j8f880srb1f83t6leg67db.apps.googleusercontent.com",
  //   iosClientId: "382896848352-664l10kdn3j8f880srb1f83t6leg67db.apps.googleusercontent.com",
  //   webClientId: "",
  // });

  // useEffect(() => {
  //   handleEffect();
  // }, [response, token]);

  // const handleEffect = async () => {
  //   const user = await getLocalUser();
  //   if (!user) {
  //     if (response?.type === "success") {
  //       getUserInfo(response.authentication.accessToken);
  //     }
  //   } else {
  //     setUserInfo(user);
  //     console.log("Loaded user from local storage");
  //   }
  // };

  // const getUserInfo = async (token) => {
  //   if (!token) return;
  //   try {
  //     const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const user = await res.json();
  //     await AsyncStorage.setItem("@user", JSON.stringify(user));
  //     setUserInfo(user);
  //     navigation.navigate("Dashboard"); // Navigate to the dashboard after login
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to fetch user info");
  //   }
  // };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <View style={styles.authContainer}>
          {/* Title */}
          <Text style={styles.title}>
            Plan and Track {"\n"} Your Budget!
          </Text>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('dashboard')} // Triggers Google OAuth flow
          >
            <Image
              source={require('../../assets/google-signin-button.png')}
              style={styles.googleIcon}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo?.picture }} style={styles.image} />
          )}
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>
            Verified: {userInfo.verified_email ? "yes" : "no"}
          </Text>
          <Text style={styles.text}>Name: {userInfo.name}</Text>
        </View>
      )}

      {/* Sign-out button */}
      {userInfo && (
        <Button
          title="Sign Out"
          onPress={async () => {
            await AsyncStorage.removeItem("@user");
            setUserInfo(null);
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30, // Space between the logo and the title
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff", // White text for title
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
  },
  googleIcon: {
    width: 200,
    height: 50,
    marginRight: 10, // Space between icon and text
  },
  buttonText: {
    color: "#000", // Text color for button
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff", // White text for user info
  },
});
