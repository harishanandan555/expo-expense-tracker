
    import React, { useState, useEffect, useRef } from "react";
    import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
    import { auth } from '../../config/firebaseConfig';
    import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
    import firestore from "@react-native-firebase/firestore";
    import { useNavigation } from "@react-navigation/native";
    // import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'; 

    export default function PhoneAuth() {
        const [phoneNumber, setPhoneNumber] = useState("");
        const [code, setCode] = useState("");
        const [confirm, setConfirm] = useState(null);
        // const recaptchaVerifier = useRef(null);
        const navigation = useNavigation();

        const signInWithPhoneNumberHandler = async () => {
            if (!phoneNumber.startsWith('+')) {
                Alert.alert("Phone number must start with '+' followed by country code.");
                return;
            }
            try {
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
                setConfirm(confirmation);
                Alert.alert("OTP has been sent to your phone.");
            } catch (error) {
                console.log("Error sending code:", error);
                Alert.alert("Error sending OTP:", error.message);
            }
        };

        const confirmCode = async () => {
            try {
                if (!confirm) {
                    Alert.alert("No confirmation ID found. Please resend the OTP.");
                    return;
                }
    
                const credential = PhoneAuthProvider.credential(confirm.verificationId, code);
                const userCredential = await signInWithCredential(auth, credential);
                const user = userCredential.user;
    
                // Check if user exists in Firestore
                const userDocument = await firestore().collection("users").doc(user.uid).get();
    
                if (userDocument.exists) {
                    navigation.navigate("main");
                } else {
                    navigation.navigate("signin", { uid: user.uid });
                }
            } catch (error) {
                console.log("Invalid code.", error);
                Alert.alert("Invalid code:", error.message);
            }
        };

        return (
            <View style={styles.container}>

                {/* Firebase reCAPTCHA verifier modal */}
            {/* <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={auth.app.options} // Pass Firebase config
            /> */}
                <Text style={styles.headerText}>Sign in with Phone</Text>
                {!confirm ? (
                    <>
                        <Text style={styles.labelText}>Enter Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., +1234567891"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholderTextColor={"grey"}
                        />
                        <TouchableOpacity onPress={signInWithPhoneNumberHandler} style={styles.button}>
                            <Text style={styles.buttonText}>Send OTP</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.labelText}>Enter OTP</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Code"
                            value={code}
                            onChangeText={setCode}
                            placeholderTextColor={"grey"}
                        />
                        <TouchableOpacity onPress={confirmCode} style={styles.button}>
                            <Text style={styles.buttonText}>Confirm Code</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: "#000",
        },
        headerText: {
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 40,
            marginLeft: 50,
            marginTop: 150,
            color: "white",
        },
        labelText: {
            marginBottom: 20,
            fontSize: 18,
            color: "white",
        },
        input: {
            height: 50,
            width: "100%",
            borderColor: "grey",
            borderWidth: 1,
            marginBottom: 30,
            paddingHorizontal: 10,
            color: "white",
        },
        button: {
            width: 150,
            backgroundColor: "orange",
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
            marginLeft: 100,
            alignItems: "center",
        },
        buttonText: {
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
        },
    });
