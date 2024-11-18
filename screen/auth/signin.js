import React, { useState,useEffect  } from "react";
import { StyleSheet, Modal } from "react-native";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
// import auth from '@react-native-firebase/auth';
import * as WebBrowser from "expo-web-browser";
import { auth, db } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import "expo-dev-client";
import { useSQLiteContext } from 'expo-sqlite/next';
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail  } from "firebase/auth";
import {GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import {collection, getDocs, query, where,doc, setDoc } from "firebase/firestore";

//---------------------------------------------------------------------------------------------------------------------------
// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const sqlDb = useSQLiteContext();

  const [input, setInput] = useState(""); 
  const [userInfo, setUserInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [emailEntered, setEmailEntered] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const isEmail = (input) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(input);
  };

  const isValidPhoneNumber = (input) => {
    const phoneRegex = /^\+(\d{1,3})(\d{6,14})$/; 
    return phoneRegex.test(input);
  };
  

   // Function to show alert with a custom message
   const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  //========================================
  // const handleContinue = async () => {
  //   const cleanedInput = input.trim();
  //   if (cleanedInput) {

  //     if (isEmail(cleanedInput)) {
  //       console.log("Valid email entered:", cleanedInput);
  //       setEmailEntered(cleanedInput);

  //       try {
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
  
  
  const handlePasswordReset = async () =>{
 if(!isEmail(emailEntered)){
  showAlertMessage("Please enter a valid email address.");
  return;
}
console.log("Sending password reset email to:", emailEntered);  
try{
  await sendPasswordResetEmail(auth, emailEntered);
  showAlertMessage("A password reset email has been sent to your email address.");
}catch(error){
  console.error("Password reset error:", error);
  showAlertMessage("Password reset error:",error.message);
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
      // Check Google services and sign in
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();

      // Get the ID token from Google
      const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Authenticate with Firebase using the Google credentials
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;

      await AsyncStorage.setItem("userId", firebaseUser.uid);
      await AsyncStorage.setItem("userEmail", firebaseUser.email);
      await AsyncStorage.setItem("userInfo", JSON.stringify(firebaseUser));

      // Save the user to Firestore
      await saveUserToFirestore(firebaseUser);

      setUserInfo(userInfo);
      navigation.navigate("main");

      // const email = userInfo?.data?.user?.email;
      // if (email) {
      //   await AsyncStorage.setItem("userEmail", email);
      //   await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo)); 
      //   console.log("UserInfo before navigation:", userInfo);

      //   navigation.navigate("main", { userInfo: userInfo.user });
      // } else {
      //   showAlertMessage("Failed to retrieve Google user information.");
      // }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      showAlertMessage("Google Sign-In failed.");
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailEntered, password);
      const email = userCredential.user.email; // Get the user's email
      await AsyncStorage.setItem("userEmail", email); // Save email to AsyncStorage
      navigation.navigate("main"); // Navigate to main screen
    } catch (error) {
      console.error("Sign-in error:", error);
      showAlertMessage("Sign-in failed. Please check your email and password.");
    }
  };

  const initializeUserData = async (email) => {
    try {
        // Drop tables if they exist (for development/testing purposes)
        await sqlDb.runAsync(`DROP TABLE IF EXISTS income;`);
        await sqlDb.runAsync(`DROP TABLE IF EXISTS expense;`);

        // Create tables with email column
        await sqlDb.runAsync(`
            CREATE TABLE IF NOT EXISTS income (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                amount REAL,
                date TEXT
            );
        `);
        await sqlDb.runAsync(`
            CREATE TABLE IF NOT EXISTS expense (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                amount REAL,
                date TEXT
            );
        `);

        // Insert zero values for income and expense if this user is new
        await sqlDb.runAsync(
            `INSERT OR IGNORE INTO income (email, amount, date) VALUES (?, 0, '')`,
            [email]
        );
        await sqlDb.runAsync(
            `INSERT OR IGNORE INTO expense (email, amount, date) VALUES (?, 0, '')`,
            [email]
        );

        console.log(`Default data initialized for user: ${email}`);
    } catch (error) {
        console.error('Error initializing user data:', error);
        showAlertMessage('Error initializing user data. Please try again.');
    }
  };

  //====================
  const saveUserToFirestore = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid); 
      // Set user data in Firestore with proper field references
      await setDoc(
        userRef,
        {
          id: user.uid, // Firebase UID
          email: user.email,
          name: user.displayName, // Display name, if available
          givenName: userInfo?.data?.user?.givenName || "", // Handle any missing fields
          familyName: userInfo?.data?.user?.familyName || "",
          photo: user.photoURL || "", // Ensure this field exists in user object
          createdAt: new Date(),
        },
        { merge: true }
      );
      console.log("User data saved to Firestore successfully!");
    } catch (error) {
      console.error("Error saving user data to Firestore: ", error);
    }
  };

  const signOutUser = async () => {
    await AsyncStorage.removeItem("userEmail"); // Clear stored email
    setUserInfo(null);
    setEmailEntered("");
    setInput("");
    setPassword("");
  };

  const user = userInfo?.data?.user;

  return (
    <View style={styles.container}>
       <Modal
        visible={showAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
          <View style={styles.alertBackground}>
          <View style={styles.alertContainer}>
             {/* Heading for Alert */}
             <Text style={styles.alertHeading}>Alert</Text>
             
             {/* Alert message */}
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

      {!userInfo ? (
        <View style={styles.authContainer}>
          {/* Logo */}
          <Image
            source={require("../../assets/wallet_logo.png")}
            style={styles.logo}
          ></Image>

          {/* Title */}
          <Text style={styles.title}>Welcome!</Text>
           {/* Email Input */}
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

           {/* Password Input - shown only if email is entered */}
          {emailEntered && (
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
          )}

            <TouchableOpacity onPress={handlePasswordReset}>
            <Text style={styles.resetPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
         
          {/* Sign In Button - shown only after entering password */}
          {emailEntered && (
            <TouchableOpacity style={styles.phoneButton} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          )}
  
          <Text style={styles.infoText}>
            Don't have an account?{" "}
            <Text style={styles.linkText} onPress={handleContinueToSignup}>
              Continue
            </Text>
          </Text>
        
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
        </View>
      ) : (
        <View style={styles.card}>
          {/* <Text>Welcome, {user.name}</Text> */}
          <Text>Email: {user.email}</Text>
        </View>
      )}

      {/* Sign-out button */}
      
      {userInfo && (
        <Button title="Sign Out" onPress={signOutUser} />
      )}
    </View>
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
    color: "#fff",
    padding: 10,
    borderRadius: 9,
    width: 290,
    height:60,
    marginBottom: 10,
    fontFamily: "Poppins, Arial",
    justifyContent:"center"
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
    marginLeft:180,
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
    textAlign:"center",
    fontWeight:"bold",
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
