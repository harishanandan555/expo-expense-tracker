import React, { useState} from "react";
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
import auth from '@react-native-firebase/auth';
import * as WebBrowser from "expo-web-browser";

// Complete any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInPage({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
 
  // // Google OAuth configuration
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: "382896848352-664l10kdn3j8f880srb1f83t6leg67db.apps.googleusercontent.com",
  //   iosClientId: "382896848352-664l10kdn3j8f880srb1f83t6leg67db.apps.googleusercontent.com",
  //   webClientId: "",
  // });

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
          <Text style={styles.title}>Plan and Track {"\n"} Your Budget!</Text>

          {/* Sign In with Google Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("main")} // Triggers Google OAuth flow
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
  input: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    marginBottom: 10,
  },
  recaptchaContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
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
    marginRight: 10,
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
    color: "#fff",
  },
  phoneButton: {
    backgroundColor: "#FFA500", // Orange color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  phoneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
