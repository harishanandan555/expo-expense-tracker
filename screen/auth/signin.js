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
import { GoogleSignin, GoogleSigninButton} from "@react-native-google-signin/google-signin";
import 'expo-dev-client';

// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [initialized, setInitialized] = useState(false);
  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: '460628319637-dntmu7vjb3r6bfehrtdp38h1152qcsob.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    try {
      // Check if device has Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Sign in user and get user info
      const userInfo = await GoogleSignin.signIn();
      
      // Log user details to the console
      console.log("User Info: ", userInfo);

      // Set the user info to state
      setUserInfo(userInfo);
      setInitialized(true);
    } catch (error) {
      console.error(error);
    }
  };

  const user = userInfo?.data?.user;
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
          <Text>Welcome, {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Google ID: {user.id}</Text>
          <Text>Given Name: {user.givenName}</Text>
          <Text>Family Name: {user.familyName}</Text>
          <Text>Profile Picture: {user.photo}</Text>
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
