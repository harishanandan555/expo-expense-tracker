import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Menu, Provider, Avatar, Divider } from 'react-native-paper';
import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ navigation, toggleTheme  }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userInfos, setUserInfos] = useState(null);
  const [theme, setTheme] = useState('dark'); // Set default theme to dark

  const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? '#000' : '#fff';
    const cardBackgroundColor = isDarkMode ? '#121212' : '#f4f4f4';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBackgroundColor = isDarkMode ? '#333' : '#fff';
    const modalTextColor = isDarkMode ? '#fff' : '#000';
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName ? user.displayName : user.email?.split('@')[0] || 'User';
        setUserName(displayName);
        setUserPhoto(user.photoURL);
      } else {
        setUserName(null);
        setUserPhoto(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleThemeSwitch = (mode) => {
    setTheme(mode);
};

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const handleGoogleLogout = async () => {
    try {
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem('userInfo');
        await AsyncStorage.removeItem('userEmail'); // Clear stored email if needed
        setUserInfos(null);
        navigation.replace('signin'); // Navigate back to the SignInPage
    } catch (error) {
        console.error('Error signing out from Google:', error);
    }
};
  const handleLogout = async () => {
    closeMenu();
    setLoading(true); 
    console.log("logout clicked")
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.navigate("signin");
    } catch (error) {
      console.log(error);
      Alert.alert("Logout Error", error.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const storedUserInfo = await AsyncStorage.getItem("userInfo");
            if (storedUserInfo) {
                setUserInfos(storedUserInfo ? JSON.parse(storedUserInfo) : {});

            } else {
                console.log("No User Info found.");
            }
        } catch (error) {
            console.error("Error retrieving user info:", error);
        }
    };

    fetchUserInfo();
}, []);

console.log("user info in header", userInfos)
  const getAvatarLabel = () => {
    if (userName) {
      return userName.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Provider>
    <ScrollView
        contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: backgroundColor },
        ]}
    >
        {/* Header Section */}
        <View style={styles.header}>
            {/* Right-aligned Avatar */}
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <View style={styles.header}>
                        <TouchableOpacity onPress={openMenu} style={styles.avatarContainer}>

                            {userInfos?.photoURL ? (
                                <Avatar.Image
                                    size={40}
                                    source={{ uri: userInfos.photoURL }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <Avatar.Text
                                    size={40}
                                    label={userInfos?.displayName ? userInfos.displayName[0] : '?'}
                                    style={styles.avatar}
                                />
                            )}



                        </TouchableOpacity>
                    </View>
                }
                style={[
                    styles.menuItem,
                    {

                        paddingVertical: 0,
                        marginVertical: 0,
                        // Remove height to allow dynamic sizing
                    },
                ]}
            >
                <Menu.Item
                    onPress={() => {
                        handleThemeSwitch('light');
                        closeMenu();
                    }}
                    title="Light"
                    icon="weather-sunny"
                    style={{

                        paddingVertical: 4, // Slight padding adjustment
                        marginVertical: 0,
                    }}

                />
                <Menu.Item
                    onPress={() => {
                        handleThemeSwitch('dark');
                        closeMenu();
                    }}
                    title="Dark"
                    icon="weather-night"
                    style={{

                        paddingVertical: 4,
                    }}

                />
                <Divider style={{ height: 1, backgroundColor: isDarkMode ? '#444' : '#e0e0e0' }} />
                <Menu.Item
                    onPress={handleLogout}
                    title="Logout"
                    icon="logout"
                    style={{

                        paddingVertical: 4,
                    }}

                />
            </Menu>

        </View>
        </ScrollView>
        </Provider>

  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1, // Ensures the content can grow and scroll
    padding: 20, // Adjust padding as needed
},
header: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 10,  // Add a little space below the avatar
},
  logo: {
    marginTop: 10,
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'flex-end',
    margin: 10, // Example, adjust as necessary for positioning
},
avatarRight: {
  position: 'absolute',
  right: 10,
},
avatar: {
  backgroundColor: '#6200ee', // Customize avatar color
},
menuItem: {

  marginTop: 50,

},
  menu: {
    width: 100, 
    marginTop: 3,
    position: 'absolute',
    zIndex: 1001,
  },
  menuItemContainer: {
    backgroundColor: '#fff', 
  },
  menuItemText: {
    color: '#000',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 20,
  },
});

export default Header;
