import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const [input, setInput] = useState(""); 
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
  
  const isEmail = (input) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(input);
  };

  const isValidPhoneNumber = (input) => {
    const phoneRegex = /^\+(\d{1,3})(\d{6,14})$/; 
    return phoneRegex.test(input);
  };

  const handleContinue = () => {
    if (input) {
      // Check if input is email or phone number and navigate accordingly
      if (isEmail(input)) {
        navigation.navigate("EmailAuthentication", { email: input });
      } else if (isValidPhoneNumber(input)) {
        navigation.navigate("PhoneAuthentication", { phone: input });
      } else {
        alert("Please enter a valid email address or a phone number starting with '+', followed by the country code.");
      }
    } else {
      alert("Please enter your email or phone number.");
    }
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <View style={styles.authContainer}>

          {/* Logo */}
          <Image source={require("../../assets/wallet_logo.png")} style={styles.logo}>

          </Image>

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
          />

          {/* Continue Button */}
          <TouchableOpacity style={styles.phoneButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
});
