    import React, { useState, useEffect } from "react";
    import { StyleSheet } from "react-native";
    import { View, TextInput, Text, Alert, Image, TouchableOpacity } from 'react-native';
    import { useRoute } from '@react-navigation/native';
    import { auth } from '../../config/firebaseConfig'; 
    import { signInWithPhoneNumber } from "firebase/auth";
  
    // import { getAuth, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
    // import 'firebase/auth';
    // import { PhoneAuthProvider,signInWithCredential } from 'firebase/auth';

    export default function PhoneAuth() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmResult, setConfirmResult] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    // const [verificationId, setVerificationId] = useState(null);

    const route = useRoute();
    
        useEffect(() => {
            if (route.params?.phone) {
                setPhoneNumber(route.params.phone);
            }
        }, [route.params?.phone]);  

        const phoneRegex = /^\+\d{1,3}\d{7,14}$/; 

    // Function to send OTP
    // const sendOTP = async () => {
    //     console.log("sendOTP started");
    //     if (!phoneRegex.test(phoneNumber)) {
    //         Alert.alert("Please enter a valid phone number in the format +<country_code><number>.");
    //         console.log("Entered phone:", phoneNumber);
    //         return;
    //     }
    //     try {
    //         const authInstance = getAuth();
    //         const confirmation = await signInWithPhoneNumber(authInstance, phoneNumber);
    //         setVerificationId(confirmation.verificationId);
    //         Alert.alert("OTP has been sent to your phone.");
    //     } catch (error) {
    //         console.error("Error sending OTP:", error);
    //         Alert.alert("Error sending OTP:", error.message);
    //     }
    // };

    const sendOTP = async () => {
         console.log("sendOTP started");
    if (!phoneRegex.test(phoneNumber)) {
        Alert.alert("Please enter a valid phone number in the format +<country_code><number>.");
        console.log("Entered phone:", phoneNumber);
        return;
    }  
    // const auth = getAuth();
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber);
        setConfirmResult(confirmationResult);
        Alert.alert("OTP has been sent to your phone.");
    } catch (error) {
        console.error("Error sending OTP:", error);
        Alert.alert("Error sending OTP:", error.message);
    }
};

    // Function to verify OTP
    
    // const confirmCode = async () => {
    //     try {
    //         const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    //         await signInWithCredential(auth, credential);
    //         Alert.alert("Phone authentication successful!");
    //     } catch (error) {
    //         console.error("Error verifying code:", error);
    //         Alert.alert("Invalid code. Please try again.");
    //     }
    // };
    
    const confirmCode = async () => {
        if (!verificationCode) {
            Alert.alert("Please enter the verification code.");
            return;
        }
        try {
            await confirmResult.confirm(verificationCode);
            Alert.alert("Phone authentication successful!");
        } catch (error) {
            console.error("Error verifying code:", error);
            Alert.alert("Invalid code. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
             <Image
                source={require('../../assets/wallet_logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Confirm Your Mobile Number</Text>
        <TextInput
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
        />
    <TouchableOpacity onPress={sendOTP} style={styles.button}>
                <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>

        {confirmResult && (
            <>
            <TextInput
                placeholder="Enter OTP"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                style={styles.input}
            />
           <TouchableOpacity onPress={confirmCode} style={styles.button}>
                        <Text style={styles.buttonText}>Confirm Code</Text>
                    </TouchableOpacity>
            </>
        )}
        </View>
    );
    };

//     return (
//         <View style={{ padding: 20 }}>
//             <TextInput
//                 placeholder="Enter phone number"
//                 value={phoneNumber}
//                 onChangeText={setPhoneNumber}
//                 keyboardType="phone-pad"
//                 style={{ borderBottomWidth: 1, marginBottom: 15 }}
//             />
//             <Button title="Send OTP" onPress={sendOTP} />

//             {verificationId && (
//                 <>
//                     <TextInput
//                         placeholder="Enter OTP"
//                         value={verificationCode}
//                         onChangeText={setVerificationCode}
//                         keyboardType="number-pad"
//                         style={{ borderBottomWidth: 1, marginTop: 15, marginBottom: 15 }}
//                     />
//                     <Button title="Confirm Code" onPress={confirmCode} />
//                 </>
//             )}
//         </View>
//     );
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: 150, 
        height: 150, 
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#fff",
        fontFamily: "Poppins, Arial",
      },
    input: {
        backgroundColor: "#000",
        borderColor: "#808080",
        borderWidth: 1,
        color: "#fff",
        padding: 10,
        borderRadius: 9,
        width: 250,
        height: 60,
        marginBottom: 10,
        fontFamily: "Poppins, Arial",
        justifyContent: "center"
    },
    button: {
        backgroundColor: 'orange',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});