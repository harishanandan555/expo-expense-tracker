import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Alert, Image, Pressable, StyleSheet, TextInput, Text, View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, Timestamp } from "firebase/firestore"; 

import { storeUser } from "../services/firebaseSettings"  //*

const auth = getAuth();
const db = getFirestore();  

export default function EmailAuth({ navigation, route }) {
  
  const [value, setValue] = useState({
    email: route.params?.email || '',
    password: '',
    confirmPassword: '',
    displayName: '',
    // phoneNumber: '',
    error: ''
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  
  // Password validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validatePassword = (password) => {return passwordRegex.test(password);};

  //* Function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  //* Function to generate a photo URL based on the display name
  const generatePhotoUrl = (displayName) => {
    const firstLetter = displayName.charAt(0).toUpperCase(); // Get the first letter of the display name
    const backgroundColor = getRandomColor(); // Generate a random background color

    // You can either generate an SVG or return a base64 image.
    // Here, I will just construct a URL-like string with the background color and first letter.
    return `https://dummyimage.com/200x200/${backgroundColor.replace('#', '')}/ffffff&text=${firstLetter}`;
  };

  // Step 1: Create a user and send email verification
  const signUp = async () => {
    if (!value.password || !value.confirmPassword || !value.displayName) {
      setValue({ ...value, error: 'All fields are mandatory.' });
      return;
    }

    if (!validatePassword(value.password)) {
      setValue({
        ...value,
        error: 'Password must be at least 8 characters long, with uppercase, lowercase, a number, and a special character.'
      });
      return;
    }

    if (value.password !== value.confirmPassword) {
      setValue({ ...value, error: 'Passwords do not match.' });
      return;
    }

    try {

      console.log("Attempting to create user...");

      const userCredential = await createUserWithEmailAndPassword(auth, value.email, value.password);
      console.log("User created: ", userCredential.user);

      const user = userCredential.user;
      console.log("User UID:", user.uid);

      //* Generate photoURL using the display name
      const photoURL = generatePhotoUrl(value.displayName);

      //* Set the display name for the user in Firebase Auth
      await updateProfile(user, { displayName: value.displayName, photoURL: photoURL || 'default_photo_url' });

      // Send email verification
      await sendEmailVerification(user);
      console.log("Verification email sent.");

      setIsVerificationSent(true);
      Alert.alert("Check Your Email", "A verification email has been sent to your email address.");

      console.log("Attempting to store user data in Firestore...");

      //* Polling function to check email verification status
      const checkEmailVerification = async () => {
        await user.reload(); // Refresh the user data
        if (user.emailVerified) {

          console.log("Your email has been successfully verified.", user.emailVerified);

          let param = {
            id: user.uid,
            displayName: value.displayName,
            email: value.email,
            // phoneNumber: value.phoneNumber,
            emailVerified: user.emailVerified,
            photoURL: photoURL
          };
          
          await storeUser(param).then((response) => {
            console.log("User data saved in Firestore");
          })
          .catch((error) => {
            console.error("Error saving user data in Firestore:", error.message);
          });

        } else {
          // Retry after a delay if email is still not verified
          setTimeout(checkEmailVerification, 5000); // Checks every 5 seconds
        }
      };
      //* Start polling for verification
      checkEmailVerification();

      // await setDoc(doc(db, "users", user.uid), {
      //   displayName: value.displayName,
      //   email: value.email,
      //   emailVerified: false,
      //   createdAt: Timestamp.now(),
      // });

      console.log("User data successfully stored in Firestore.");

      navigation.navigate("signin");

    } catch (error) {
      console.error("Error creating user: ", error);
      setValue({ ...value, error: error.message });
    }
  };

  // Step 2: Check email verification status
  const checkEmailVerificationAndUpdateFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        setIsEmailVerified(true);
        
        // Fetch the latest sign-in metadata
        const metadata = {
          emailVerified: true,
          lastLoginAt:  lastLoginAt,
          expirationTime: stsTokenManager.expirationTime
        };

        await setDoc(
          doc(db, "users", user.uid),
          metadata,
          { merge: true }
        );

        console.log("User data successfully updated in Firestore.");
        Alert.alert("Email Verified", "Your email has been successfully verified.");
      } else {
        setIsEmailVerified(false);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await checkEmailVerificationAndUpdateFirestore();
      const user = auth.currentUser;
      if (user && user.emailVerified) {
        clearInterval(intervalId); // Stop checking once verified
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [])

  //   const signUp = async () => {
  //     console.log("SignUp function started");
  //     if (!value.email || !value.displayName || !value.password || !value.confirmPassword) {
  //     setValue({ ...value, error: 'All fields are mandatory.' });
  //       console.log("Missing fields");
  //       return;
  //     }
  //     if (!validatePassword(value.password)) {
  //       setValue({
  //         ...value,
  //         error: 'Password must be at least 8 characters long, with uppercase, lowercase, a number, and a special character.'
  //       });
  //       console.log("Password validation failed");
  //       return;
  //     }
  //     if (value.password !== value.confirmPassword) {
  //       setValue({ ...value, error: 'Passwords do not match.' });
  //       console.log("Passwords do not match");
  //       return;
  //     }
  //     try {
  //       const userCredential = await createUserWithEmailAndPassword(auth, value.email, value.password);
  //       const user = userCredential.user;
  //       console.log("User created successfully:", user);

  //       // Update user profile with display name
  //       await updateProfile(user, { displayName: value.displayName });
  //       console.log("User profile updated successfully");

  //       // Send email verification after user creation
  //       // await sendEmailVerification(user);
  //       // Alert.alert("Verification Sent", "A verification email has been sent to your email address.");

  //       // Store user details in Firestore
  //       await setDoc(doc(db, "users", user.uid), {
  //         displayName: value.displayName,
  //         email: value.email,
  //         // phoneNumber: value.phoneNumber,
  //         emailVerified: true  
  //       });
  //       console.log("User details saved successfully");

  //       navigation.navigate("signin");
  //     } catch (error) {
  //       console.log("Error creating account:", error);
  //       setValue({ ...value, error: error.message,});
  //     }
  //   };

  //   const verifyEmail = async () => {
  //     try {
  //       console.log("verify button clicked")
  //       const user = auth.currentUser;
  //       if (user && !user.emailVerified) {
  //         await sendEmailVerification(user);
  //         Alert.alert("Verification Sent", "A verification email has been sent to your email address.");
  //       } else {
  //         Alert.alert("Info", "Your email is already verified.");
  //       }
  //     } catch (error) {
  //       console.log("Error sending verification email:", error);
  //       Alert.alert("Error", error.message);
  //     }
  //   };

  // const checkEmailVerification = async () => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     await user.reload(); // Ensure we have the latest user info
  //     if (user.emailVerified) {
  //       setIsEmailVerified(true);
  //       Alert.alert("Email Verified", "Your email has been successfully verified.");
  //     } else {
  //       setIsEmailVerified(false);
  //     } 
  //   }
  // };

  // const getPhoneNumber = async (uid) => {
  //   try {
  //     const userDoc = await getDoc(doc(db, "users", uid));
  //     if (userDoc.exists()) {
  //       const phoneNumber = userDoc.data().phoneNumber;
  //       console.log("Retrieved phone number:", phoneNumber);
  //       return phoneNumber;
  //     } else {
  //       console.log("No phone number found for this user.");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving phone number:", error);
  //   }
  // };

  // const sendOtp = async () => {
  //   const phoneProvider = new PhoneAuthProvider();
  //   try {
  //     const verifier = new RecaptchaVerifier('recaptcha-container', {
  //       'size': 'invisible', // or 'normal'
  //       'callback': () => {
  //           // reCAPTCHA solved, allow signInWithPhoneNumber.
  //       },
  //       'expired-callback': () => {
  //           // Response expired. Ask user to re-enter.
  //       }
  //   }, auth);

  //     const verificationId = await phoneProvider.verifyPhoneNumber({
  //       phoneNumber,
  //       verifier
  //       // Include recaptcha verification here if needed
  //     });
  //     setVerificationId(verificationId);
  //     Alert.alert("OTP Sent", "An OTP has been sent to your phone number.");
  //   } catch (error) {
  //     console.log("Error sending OTP:", error);
  //     Alert.alert("Error", error.message);
  //   }
  // };

  // const sendOtp = async () => {
  //   setRecaptchaVisible(true); // Show reCAPTCHA
  //   const appVerifier = new FirebaseRecaptchaVerifierModal(); // Create recaptcha verifier

  //   try {
  //     const verificationId = await PhoneAuthProvider.verifyPhoneNumber(auth, {
  //       phoneNumber,
  //       appVerifier, // Use the reCAPTCHA verifier
  //     });
  //     setVerificationId(verificationId);
  //     Alert.alert("OTP Sent", "An OTP has been sent to your phone number.");
  //   } catch (error) {
  //     console.log("Error sending OTP:", error);
  //     Alert.alert("Error", error.message);
  //   }
  // };

  // const verifyOtp = async () => {
  //   if (!verificationId) {
  //     Alert.alert("Error", "Verification ID is not set. Please send OTP first.");
  //     return;
  //   }

  //   const credential = PhoneAuthProvider.credential(verificationId, otp);
  //   try {
  //     const userCredential = await auth.currentUser.linkWithCredential(credential);
  //     Alert.alert("Phone Verified", "Your phone number has been verified successfully.");
      
  //     // Store phone number
  //     await updateProfile(userCredential.user, { phoneNumber });
  //     console.log("User's phone number linked:", userCredential.user.phoneNumber);
  //   } catch (error) {
  //     console.log("Error verifying OTP:", error);
  //     Alert.alert("Error", error.message);
  //   }
  // };

  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     const user = auth.currentUser;
  //     if (user) {
  //       await user.reload();
  //       if (user.emailVerified) {
  //         setIsEmailVerified(true);
  //         setIsPasswordFieldsEnabled(true);
  //         clearInterval(intervalId);

  //         // Update Firestore with emailVerified as true
  //         await setDoc(doc(db, "users", user.uid), { emailVerified: true }, { merge: true });
  //         Alert.alert("Email Verified", "Your email has been successfully verified.");
  //       }
  //     }
  //   }, 3000);
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/wallet_logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="person" size={18} color="gray" />
            <TextInput
              placeholder="Display Name"
              placeholderTextColor="#fff"
              style={styles.input}
              onChangeText={(text) => setValue({ ...value, displayName: text })}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="email" size={18} color="gray" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#fff"
              value={value.email}
              style={styles.input}
              editable={false}
              onChangeText={(text) => setValue({ ...value, email: text })}
            />
          </View>

          
          {/* <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="phone" size={18} color="gray" />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#fff"
              style={styles.input}
              onChangeText={(text) => setValue({ ...value, phoneNumber: text })}
            />
          </View> */}

          {/* <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="phone" size={18} color="gray" />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#fff"
              style={styles.input}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Pressable style={styles.verifyButton} onPress={sendOtp}>
              <Text style={styles.verifyButtonText}>Send OTP</Text>
            </Pressable>
          </View>

          <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="lock" size={18} color="gray" />
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="#fff"
              style={styles.input}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
            <Pressable style={styles.verifyButton} onPress={verifyOtp}>
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            </Pressable>
          </View> */}

          <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="lock" size={18} color="gray" />
            <TextInput
              placeholder="Create Password"
              placeholderTextColor="#fff"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(text) => setValue({ ...value, password: text })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="lock" size={18} color="gray" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#fff"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(text) => setValue({ ...value, confirmPassword: text })}
            />
          </View>
          {/* <FirebaseRecaptchaVerifierModal
            ref={ref => setRecaptchaVerifier(ref)}
            firebaseConfig={auth.app.options}
            attemptInvisibleVerification={true}
          /> */}
        </View>

        {value.error ? (  <Text style={styles.errorText}>{value.error}</Text>    ) : null}

        {isVerificationSent && (
          <Text style={styles.successText}>A verification email has been sent!</Text>
        )}

        {isEmailVerified && (
          <Text style={styles.successText}>Your email is verified!</Text>
        )}

        <Pressable style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>SignUp</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("signin")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 20,
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Poppins'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    color: 'white',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  verifyButton: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  link: {
    color: 'orange',
  },
  successText: {
    color: 'green',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorText: {  
    color: 'red',
  },
});
