import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Alert, Image, Pressable, StyleSheet, TextInput, Text, View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export default function EmailAuth({ navigation, route }) {
  const [value, setValue] = useState({
    email: route.params?.email || '',
    password: '',
    confirmPassword: '',
    error: ''
  });

  // Password validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validatePassword = (password) => {
    return passwordRegex.test(password);
  };

  const signUp = async () => {
    console.log("SignUp function started");
    if (!value.email || !value.password || !value.confirmPassword) {
      setValue({ ...value, error: 'All fields are mandatory.' });
      console.log("Missing fields");
      return;
    }
    if (!validatePassword(value.password)) {
      setValue({
        ...value,
        error: 'Password must be at least 8 characters long, with uppercase, lowercase, a number, and a special character.'
      });
      console.log("Password validation failed");
      return;
    }
    if (value.password !== value.confirmPassword) {
      setValue({ ...value, error: 'Passwords do not match.' });
      console.log("Passwords do not match");
      return;
    }
    try {

      await createUserWithEmailAndPassword(auth, value.email, value.password);
      console.log("User created successfully");
      Alert.alert("Success", "Account created successfully! Please sign in.");
      navigation.navigate("signin");
    } catch (error) {
      console.log("Error creating account:", error);
      setValue({
        ...value,
        error: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
       <Image source={require("../../assets/wallet_logo.png")} style={styles.logo} />

        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon style={styles.icon} name="email" size={18} color="gray" />
            <TextInput
              placeholder='Email'
              placeholderTextColor="#fff"
              value={value.email}
              style={styles.input}
              onChangeText={(text) => setValue({ ...value, email: text })}
            />
          </View>

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
        </View>

        {value.error ? <Text style={styles.errorText}>{value.error}</Text> : null}

        <Pressable style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>SignUp</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Have an account? <Text style={styles.link} onPress={() => navigation.navigate('signin')}>Sign In</Text>
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
  footerText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  link: {
    color: 'orange',
  },
  errorText: {
    color: 'red',
  },
});
