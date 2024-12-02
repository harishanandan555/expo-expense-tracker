import React, { useState, useEffect } from "react";
import { StyleSheet, Modal, ActivityIndicator, StatusBar } from "react-native";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";

import { useTheme } from '../../themeContext';
import { auth, db } from "../../config/firebaseConfig";

//---------------------------------------------------------------------------------------------------------------------------
// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {

  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [emailEntered, setEmailEntered] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmail = (input) => {
    // A robust regex pattern for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input);
  };


  // Function to show alert with a custom message
  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // const handleContinue = async () => {
  //   const cleanedInput = input.trim();
  //   if (cleanedInput) {

  //     if (isEmail(cleanedInput)) {
  //       console.log("Valid email entered:", cleanedInput);
  //       setEmailEntered(cleanedInput);

  //       try {
  //         setLoading(true);
  //         console.log("Checking if email exists in Firebase...");
  //         const signInMethods = await fetchSignInMethodsForEmail(auth, cleanedInput);
  //         console.log("Fetched sign-in methods:", signInMethods);

  //         if (signInMethods.length > 0) {


  //           // Email exists, show password input only
  //           console.log("Email exists in Firebase, showing password input.");
  //           setPassword("");
  //         } else {
  //           // Email not found, navigate to signup
  //           console.log("Email not found, navigating to sign up.");
  //           // navigation.navigate("EmailAuthentication", { email: cleanedInput });
  //         }
  //       } catch (error) {
  //         console.error("Error fetching sign-in methods:", error);
  //         if (error.code === 'auth/invalid-email') {
  //           showAlertMessage("The email address is not valid. Please check and try again.");
  //         }
  //         else if (error.code === 'auth/network-request-failed') {
  //           showAlertMessage("Network error. Please check your connection and try again.");
  //         }
  //         else {
  //           showAlertMessage("An error occurred while checking the email.");
  //         }
  //       }
  //     }
  //     //  else if (isValidPhoneNumber(cleanedInput)) {
  //     //   // navigation.navigate("PhoneAuthentication", { phone: cleanedInput });
  //     // }
  //     else {
  //       showAlertMessage("Please enter a valid email address.");
  //     }
  //   }
  //    else {
  //     showAlertMessage("Please enter your email.");
  //   }
  // };

  const handleContinue = async () => {
    const cleanedInput = input.trim();

    if (!cleanedInput) {
      showAlertMessage("Please enter your email.");
      return;
    }

    if (!isEmail(cleanedInput)) {
      showAlertMessage("Please enter a valid email address.");
      return;
    }

    console.log("Valid email entered:", cleanedInput);
    setEmailEntered(cleanedInput);
    showAlertMessage("Checking your email id...", true);

    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", cleanedInput));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Email found in Firestore, checking Firebase Authentication...");
        try {
          await signInWithEmailAndPassword(auth, cleanedInput, "dummyPassword");
          setPassword("");
        } catch (signInError) {
          setPassword("");
        }
      } else {
        navigation.navigate("EmailAuthentication", { email: cleanedInput });
      }
    } catch (error) {
      console.error("Error during email check:", error);
      showAlertMessage("An error occurred while checking the email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!emailEntered) {
      showAlertMessage("Please enter a valid email address.");
      return;
    }

    console.log("Attempting to sign in with:", emailEntered, password);

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, emailEntered.trim(), password.trim());
      const user = userCredential.user;

      // Check if email verification is required
      if (!user.emailVerified) {
        showAlertMessage("Please verify your email before signing in.");
        return;
      }

      console.log("Sign-in successful", user);
      navigation.navigate("Main");
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message);

      // Display a more specific error message based on Firebase Auth error codes
      let errorMessage = "Sign-in error. Please check your email and password.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This user account has been disabled.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }

      showAlertMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!isEmail(emailEntered)) {
      showAlertMessage("Please enter a valid email address.");
      return;
    }
    console.log("Sending password reset email to:", emailEntered);
    try {
      await sendPasswordResetEmail(auth, emailEntered);
      showAlertMessage("A password reset email has been sent to your email address.");
    } catch (error) {
      console.error("Password reset error:", error);
      showAlertMessage("Password reset error:", error.message);
    }
  };

  const handleContinueToSignup = () => {
    if (isEmail(input.trim())) {
      const cleanedInput = input.trim();
      navigation.navigate("EmailAuthentication", { email: cleanedInput });
    } else {
      showAlertMessage("Please enter a valid email address before continuing to sign up.");
    }
  };

  //-----------------------------------------------------------------------------------------------------------

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "622095554406-32i6saoa7sn60bu32n33f4um21ep2i65.apps.googleusercontent.com",
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      // Check Google services availability
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Check if a user is already logged in
      const existingUser = await GoogleSignin.getCurrentUser();

      if (existingUser) {
        console.log("Existing user found. Attempting silent login...");
        try {
          // Refresh the ID token before silent login
          const refreshedTokens = await GoogleSignin.getTokens();
          const { idToken } = refreshedTokens;

          // Authenticate with Firebase using the refreshed token
          const googleCredential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, googleCredential);
          const firebaseUser = userCredential.user;

          // console.log("Silent sign-in successful:", firebaseUser);

          // Save user info in AsyncStorage
          await AsyncStorage.setItem("userId", firebaseUser.uid);
          await AsyncStorage.setItem("userEmail", firebaseUser.email);
          await AsyncStorage.setItem("userInfo", JSON.stringify(firebaseUser));

          // Save the user to Firestore
          await saveUserToFirestore(firebaseUser);

          // Navigate to the main screen
          navigation.navigate("Main", { userInfo: firebaseUser });

        } catch (error) {
          console.error("Silent login failed, showing account picker...", error);

          // If silent login fails, show account picker
          const userInfo = await GoogleSignin.signIn();
          handleNewGoogleSignIn(userInfo);
        }
      } else {
        console.log("No existing user found. Showing account picker...");
        // Show account picker
        const userInfo = await GoogleSignin.signIn();
        handleNewGoogleSignIn(userInfo);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      // Handle specific error cases
      if (error.code === "SIGN_IN_CANCELLED") {
        console.log("User canceled the sign-in process.");
      } else if (error.code === "IN_PROGRESS") {
        console.log("Google Sign-In is already in progress.");
      } else {
        console.error("Google Sign-In failed:", error);
      }
    }
  };

  const handleNewGoogleSignIn = async (userInfo) => {
    try {
      // Retrieve fresh ID token
      const tokens = await GoogleSignin.getTokens();
      const { idToken } = tokens;

      // Authenticate with Firebase using the Google credentials
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;

      // console.log("Google Sign-In successful:", firebaseUser);

      // Save user info in AsyncStorage
      await AsyncStorage.setItem("userId", firebaseUser.uid);
      await AsyncStorage.setItem("userEmail", firebaseUser.email);
      await AsyncStorage.setItem("userInfo", JSON.stringify(firebaseUser));

      // Save the user to Firestore
      await saveUserToFirestore(firebaseUser);

      // Navigate to the main screen
      navigation.navigate("Main", { userInfo: firebaseUser });
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };






  const saveUserToFirestore = async (user, email) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          id: user.uid,
          email: user.email || "No Email Found",
          name: user.displayName || "No Name",
          photo: user.photoURL || "No Photo",
          createdAt: new Date(),
        },
        { merge: true }
      );
      // console.log("User data saved to Firestore successfully!");
    } catch (error) {
      console.error("Error saving user data to Firestore: ", error);
    }
  };

  const user = userInfo?.data?.user;

  const signOutUser = async () => {
    await AsyncStorage.removeItem("userEmail"); // Clear stored email
    setUserInfo(null);
    setEmailEntered("");
    setInput("");
    setPassword("");
  };

  return (
    <View style={styles.container}>

      {/* Status Bar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
      />

  {/* Body Section */ }
  <Modal
    visible={showAlert}
    transparent
    animationType="fade"
    onRequestClose={() => setShowAlert(false)}
  >
    <View style={styles.alertBackground}>
      <View style={styles.alertContainer}>
        <Text style={styles.alertHeading}>Alert</Text>


        <Text style={styles.alertText}>{alertMessage}</Text>

        <TouchableOpacity
          onPress={() => setShowAlert(false)}
          style={styles.alertButton}
        >
          <Text style={styles.alertButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>

  </Modal>

  {
    !userInfo ? (
      <View style={styles.authContainer}>
        <Image
          source={require("../../assets/wallet_logo.png")}
          style={styles.logo}
        ></Image>

        <Text style={styles.title}>Welcome!</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor={"white"}
          value={input}
          onChangeText={setInput}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          onBlur={handleContinue}
        />


        {emailEntered && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter password*"
              placeholderTextColor={"white"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={styles.resetPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </>
        )}


        {emailEntered && (
          <TouchableOpacity style={styles.phoneButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.infoText}>
          Don't have an account?{" "}
          <Text style={styles.linkText} onPress={handleContinueToSignup}>
            Click Here
          </Text>
        </Text>


        <TouchableOpacity
          style={styles.signInButton}
          onPress={() =>
            onGoogleButtonPress()
            // .then(() =>
            //   // console.log("Signed in with Google!")
            // )
          }
        >
          <Image
            source={require("../../assets/google-signin-button.png")}
            style={styles.googleIcon}
          />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {/* {loading && <Text style={styles.loadingText}>Loading...</Text>}  */}
      </View>
    ) : (
    <View style={styles.input}>
      {/* { <Text>Welcome, {user.name}</Text> } */}
      <Text style={[styles.text, { color: 'white' }]} >{userInfo?.email}</Text>
    </View>
  )
  }

  {
    userInfo && (
      <Button title="Sign Out" onPress={signOutUser} />
    )
  }

    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authContainer: {
    alignItems: "center",
  },
  alertBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  alertHeading: {
    color: "#FFA500",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins, Arial",
    textAlign: "center",
  },
  alertText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins, Arial",
    marginBottom: 10,
  },
  alertButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins, Arial",
  },
  authContainer: {
    alignItems: "center",
  },
  input: {
    backgroundColor: "#000",
    borderColor: "#808080",
    borderWidth: 1,
    color: "#ffff",
    padding: 10,
    borderRadius: 9,
    width: 290,
    height: 60,
    marginBottom: 10,
    fontFamily: "Poppins, Arial",
    justifyContent: "center"
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
    fontFamily: "Poppins, Arial",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    // paddingHorizontal: 15,
    // paddingVertical: 5,
    borderWidth: 1,
    // borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
  },
  linkText: {
    color: '#007BFF', // Link color
    textDecorationLine: 'underline', // Underline for link
    fontSize: 16,
    marginTop: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  resetPasswordText: {
    color: 'orange',
    marginTop: 1,
    marginLeft: 180,
  },
  googleIcon: {
    width: 200,
    height: 50,
    // marginRight: 10,
    marginRight: 10, // Space between icon and text
  },
  card: {
    borderWidth: 1,
    borderRadius: 5,
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
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 20,
  },
  // input: {
  //   width: "100%",
  //   padding: 12,
  //   marginVertical: 10,
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: 8,
  //   backgroundColor: "#f9f9f9",
  // },
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
    marginBottom: 5,
    color: "#fff",
    fontFamily: "Poppins, Arial",
    fontSize: 16,
  },
  switchText: {
    color: "#0A74DA",
    marginVertical: 10,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  phoneButton: {
    width: 100,
    height: 45,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA500",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  phoneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins, Arial",
  },
})