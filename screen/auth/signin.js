import React, { useState, useEffect  } from "react";
import { StyleSheet, Modal } from "react-native";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import auth from '@react-native-firebase/auth';
import * as WebBrowser from "expo-web-browser";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail  } from "firebase/auth";

// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const [input, setInput] = useState(""); 
  const [userInfo, setUserInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [emailEntered, setEmailEntered] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // // Google OAuth configuration
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: "382896848352-664l10kdn3j8f880srb1f83t6leg67db.apps.googleusercontent.com",
  //   iosClientId: "382896848352-664l10kdn3j8f880srb1f83t6leg67db.apps.googleusercontent.com",
  //   webClientId: "",
  // });

  // const onGoogleButtonPress = async () => {
  //   try {
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
  //     // Get the user's ID token
  //     const response = await GoogleSignin.signIn();

  //     // Create a Google credential with the token
  //     const googleCredential = auth.GoogleAuthProvider.credential(response.idToken);

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
  //   }
  // };

  
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
            navigation.navigate("EmailAuthentication", { email: cleanedInput });
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
      } else if (isValidPhoneNumber(cleanedInput)) {
        // navigation.navigate("PhoneAuthentication", { phone: cleanedInput });
      } 
      else {
        showAlertMessage("Please enter a valid email address or a phone number starting with '+'.");
      }
    } else {
      showAlertMessage("Please enter your email or phone number.");
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
            placeholder="Enter email or phone number*"
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
            <Text style={styles.linkText} onPress={handleContinue}>
              Continue
            </Text>
          </Text>

          {/* Sign In with Google Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("main")}
          >
            <Image
              source={require("../../assets/google-signin-button.png")}
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
  },
  card: {
    borderWidth: 1,
    borderRadius: 5,
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
    color: "#fff",
    fontFamily: "Poppins, Arial", 
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
