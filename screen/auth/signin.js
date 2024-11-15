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
import { auth } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import "expo-dev-client";
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail  } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc} from "firebase/firestore";

import { storeUser, storeAccount } from '../services/firebaseSettings'

const db = getFirestore();

//---------------------------------------------------------------------------------------------------------------------------
// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {

  const [input, setInput] = useState(""); 
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [emailEntered, setEmailEntered] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // DefaultCategories insertion
  // async function insertIncomeCategories() {
  //   const incomeCategories = [
  //     { name: "Salary", icon: "💼", type: "income" },
  //     { name: "Gifts", icon: "🎁", type: "income" },
  //     { name: "Education Grants", icon: "🎓", type: "income" },
  //     { name: "Bonus", icon: "💰", type: "income" },
  //     { name: "Commission", icon: "🧾", type: "income" },
  //     { name: "Investment Income", icon: "📈", type: "income" },
  //     { name: "Rental Income", icon: "🏠", type: "income" },
  //     { name: "Freelance Income", icon: "💵", type: "income" },
  //     { name: "Tax Refund", icon: "💸", type: "income" },
  //     { name: "Gambling Winnings", icon: "🎲", type: "income" },
  //     { name: "Interest Income", icon: "🪙", type: "income" },
  //     { name: "Selling Income", icon: "💹", type: "income" },
  //     { name: "Tips", icon: "💳", type: "income" },
  //     { name: "Side Job", icon: "🛠️", type: "income" },
  //     { name: "Other Income", icon: "💲", type: "income" },
  //   ];
  
  //   try {
  //     // Iterate over income categories and store each one in Firestore
  //     for (const category of incomeCategories) {
  //       const sanitizedName = category.name.replace(/[\/\.\#\[\]]/g, '_'); // Replace invalid characters
  //       const categoryRef = doc(db, "DefaultCategories", sanitizedName); // Use sanitized name as document ID
  //       await setDoc(categoryRef, category); // Store the category in Firestore
  //     }
  //     console.log("Income categories inserted successfully.");
  //   } catch (error) {
  //     console.error("Error inserting categories:", error);
  //   }
  // }
  
  // // Call the function to insert income categories
  // insertIncomeCategories();
  
  // async function insertExpenseCategories() {
  //   const expenseCategories = [
  //     { name: "Auto & Transport", icon: "🚗", type: "expense" },
  //     { name: "Bills & Utilities", icon: "💡", type: "expense" },
  //     { name: "Charity", icon: "💛", type: "expense" },
  //     { name: "Clothing & Accessories", icon: "👗", type: "expense" },
  //     { name: "Dining & Restaurants", icon: "🍽️", type: "expense" },
  //     { name: "Education", icon: "📚", type: "expense" },
  //     { name: "Entertainment", icon: "🎮", type: "expense" },
  //     { name: "Fees & Charges", icon: "🏦", type: "expense" },
  //     { name: "Food & Groceries", icon: "🥑", type: "expense" },
  //     { name: "Health & Fitness", icon: "🏥", type: "expense" },
  //     { name: "Home Improvement", icon: "🛠️", type: "expense" },
  //     { name: "Household Supplies", icon: "🧴", type: "expense" },
  //     { name: "Insurance", icon: "🛡️", type: "expense" },
  //     { name: "Loans", icon: "💳", type: "expense" },
  //     { name: "Miscellaneous", icon: "🎉", type: "expense" },
  //     { name: "Personal Care", icon: "🧖", type: "expense" },
  //     { name: "Pet Care", icon: "🐾", type: "expense" },
  //     { name: "Rent/Mortgage", icon: "🏠", type: "expense" },
  //     { name: "Shopping", icon: "🛍️", type: "expense" },
  //     { name: "Subscriptions", icon: "📺", type: "expense" },
  //     { name: "Taxes", icon: "🧾", type: "expense" },
  //     { name: "Travel", icon: "✈️", type: "expense" },
  //     { name: "Utilities", icon: "🔌", type: "expense" },
  //     { name: "Other Expenses", icon: "💲", type: "expense" },
  //   ];
  
  //   try {
  //     // Iterate over expense categories and store each one in Firestore
  //     for (const category of expenseCategories) {
  //       const sanitizedName = category.name.replace(/[\/\.\#\[\]]/g, '_'); // Replace invalid characters
  //       const categoryRef = doc(db, "DefaultCategories", sanitizedName); // Use sanitized name as document ID
  //       await setDoc(categoryRef, category); // Store the category in Firestore
  //     }
  //     console.log("Expense categories inserted successfully.");
  //   } catch (error) {
  //     console.error("Error inserting categories:", error);
  //   }
  // }
  
  // // Call the function to insert expense categories
  // insertExpenseCategories();

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

  const handleContinue = async () => {
    const cleanedInput = input.trim();
    if (cleanedInput) {

      if (isEmail(cleanedInput)) {
        console.log("Valid email entered:", cleanedInput);
        setEmailEntered(cleanedInput);

        try {
          console.log("Checking if email exists in Firebase...");
          const signInMethods = await fetchSignInMethodsForEmail(auth, cleanedInput);
          console.log("Fetched sign-in methods:", signInMethods);
          
          if (signInMethods.length > 0) {
            // Email exists, show password input only
            console.log("Email exists in Firebase, showing password input.");
            setPassword("");
          } else {
            // Email not found, navigate to signup
            console.log("Email not found, navigating to sign up.");
            // navigation.navigate("EmailAuthentication", { email: cleanedInput });
          }
        } catch (error) {
          console.error("Error fetching sign-in methods:", error);
          if (error.code === 'auth/invalid-email') {
            showAlertMessage("The email address is not valid. Please check and try again.");
          } 
          else if (error.code === 'auth/network-request-failed') {
            showAlertMessage("Network error. Please check your connection and try again.");
          }
          else {
            showAlertMessage("An error occurred while checking the email.");
          }
        }
      }
      //  else if (isValidPhoneNumber(cleanedInput)) {
      //   // navigation.navigate("PhoneAuthentication", { phone: cleanedInput });
      // } 
      else {
        showAlertMessage("Please enter a valid email address.");
      }
    }
     else {
      showAlertMessage("Please enter your email.");
    }
  };
  
  
  const handleSignIn = async () => {
    
    if (!emailEntered) {
      showAlertMessage("Please enter a valid email address.");
      return; 
    }
    
    console.log("Attempting to sign in with:", emailEntered, password); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailEntered, password);
      console.log("Sign-in successful", userCredential.user);
      navigation.navigate("main"); 
    } catch (error) {
      console.error("Sign-in error:", error);
      showAlertMessage("Sign-in error Please Check your User ID and password.",error.message);
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

    const cleanedInput = input.trim();

    if (isEmail(cleanedInput)) {

      navigation.navigate("EmailAuthentication", { email: cleanedInput });

      // navigation.navigate("NextScreen", {
      //   email: cleanedInput,
      //   password: password,
      //   googleEmail: userInfo?.user?.email,
      // });

    } else {
      showAlertMessage("Please enter a valid email address before continuing to sign up.");
    }
  };

//-----------------------------------------------------------------------------------------------------------

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [isNewUser, setIsNewUser] = useState(false);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "622095554406-32i6saoa7sn60bu32n33f4um21ep2i65.apps.googleusercontent.com",
    });
  }, []);

  const onGoogleButtonPress = async () => {

    try {
      // Check if device has Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      
      await GoogleSignin.signOut();

      
      const userInfo = await GoogleSignin.signIn();
      
     
      console.log("User Info: ", userInfo);

      const user = await storeUser(userInfo.data.user)

      await storeAccount( user.userId, userInfo.data )
      
      setUserInfo(userInfo);

      navigation.navigate("main");

    } catch (error) {
      console.error(error);
    }
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
