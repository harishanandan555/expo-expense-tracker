import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import "expo-dev-client";

export default function SignInPage({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "460628319637-dntmu7vjb3r6bfehrtdp38h1152qcsob.apps.googleusercontent.com",
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      // Check if device has Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      
      await GoogleSignin.signOut();

      
      const userInfo = await GoogleSignin.signIn();
      
     
      console.log("User Info: ", userInfo);

      
      setUserInfo(userInfo);
      navigation.navigate("dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  // Email Login or Signup
  const handleEmailLoginOrSignUp = async () => {
    if (isNewUser) {
      // Sign-up Flow
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("User signed up: ", userCredential.user);
          generateAuthToken(userCredential.user);
        })
        .catch((error) => {
          console.error("Error signing up: ", error);
        });
    } else {
      // Login Flow
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Logged in with email");
          generateAuthToken(userCredential.user);
        })
        .catch((error) => console.error("Error logging in: ", error));
    }
  };

  // Generate Token After Login/SignUp
  const generateAuthToken = async (user) => {
    const token = await user.getIdToken(); // Get Firebase ID Token
    console.log("Generated Token: ", token);
    await AsyncStorage.setItem("@token", token);
  };

  const user = userInfo?.data?.user;

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <View style={styles.authContainer}>
          <Text style={styles.title}>Plan and Track {"\n"} Your Budget!</Text>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log("Signed in with Google!")
              )
            }
          >
            <Image
              source={require("../../assets/google-signin-button.png")}
              style={styles.googleIcon}
            />
          </TouchableOpacity>

          {/* Input Card for Email/Password Login */}
   
        </View>
      ) : (
        <View style={styles.card}>
          <Text>Welcome, {user.name}</Text>
          <Text>Email: {user.email}</Text>
        </View>
      )}

      {/* Sign-out button */}
      {userInfo && (
        <Button
          title="Sign Out"
          onPress={async () => {
            await AsyncStorage.removeItem("@token");
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
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    width: "80%",
    marginVertical: 20,
  },
  inputCard: {
    width: "80%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  loginButton: {
    backgroundColor: "#0A74DA",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchText: {
    color: "#0A74DA",
    marginVertical: 10,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
