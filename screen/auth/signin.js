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
import auth from '@react-native-firebase/auth';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import 'expo-dev-client';

// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);

  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: 'AIzaSyA6kVfG09SlEvFMfhhGC4NHFOk1nI49Qs0.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user's ID token
      const response = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(response.idToken);

      // Sign in the user with the credential and handle response
      const responseGoogle = await auth().signInWithCredential(googleCredential);
      const user = responseGoogle.user;

      console.log("Signed in with Google: ", user);

      // Store user info and navigate to dashboard
      setUserInfo(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      navigation.navigate("Dashboard");

    } catch (error) {
      console.error("Google Sign-In Error", error);
      Alert.alert("Error", "Failed to sign in with Google");
    }
  };

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
            onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
          >
            <Image
              source={require('../../assets/google-signin-button.png')}
              style={styles.googleIcon}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          {userInfo?.photoURL && (
            <Image source={{ uri: userInfo?.photoURL }} style={styles.image} />
          )}
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>Verified: {userInfo.emailVerified ? "yes" : "no"}</Text>
          <Text style={styles.text}>Name: {userInfo.displayName}</Text>
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
