    import React, { useEffect, useState } from 'react';
    import { View, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
    import { Menu, Provider, Avatar, Divider } from 'react-native-paper';
    import { auth } from '../../config/firebaseConfig';
    import { onAuthStateChanged, signOut } from 'firebase/auth';
    import { GoogleSignin } from "@react-native-google-signin/google-signin";;

    const Header = ({ navigation, isDarkMode, toggleTheme }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState(null);

    useEffect(() => {
         // Configure Google Sign-In
         GoogleSignin.configure({
              webClientId:  "622095554406-32i6saoa7sn60bu32n33f4um21ep2i65.apps.googleusercontent.com", // Replace with your Web Client ID
           });

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

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleLogout = async () => {
        closeMenu();
        setLoading(true); 
        console.log("logout clicked")
        try {
            const currentUser = auth.currentUser;
            if (currentUser.providerData.some(provider => provider.providerId === 'google.com')) {
              // Revoke Google token and sign out
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
            }
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

    const getAvatarLabel = () => {
        if (userName) {
        return userName.slice(0, 2).toUpperCase();
        }
        return 'U';
    };

    return (
        <Provider>
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <Image
            source={require('../../assets/wallet_logo.png')}
            style={styles.logo}
            />
            <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
                <TouchableOpacity onPress={openMenu}>
                {userPhoto ? (
                    <Avatar.Image size={45} source={{ uri: userPhoto }} />
                ) : (
                    <Avatar.Text size={45} label={getAvatarLabel()} />
                )}
                </TouchableOpacity>
            }
            style={[
                styles.menu,
                { backgroundColor: isDarkMode ? '#000' : '#fff' },
                { marginLeft: -10 },
                { position: 'absolute', top:5, zIndex: 1000 },
            ]}
            >
            <View style={styles.menuItemContainer}>
                <Menu.Item
                onPress={() => {
                    toggleTheme();
                    closeMenu();
                }}
                title={isDarkMode ? 'Light' : 'Dark'}
                icon={isDarkMode ? 'weather-sunny' : 'weather-night' }
                titleStyle={styles.menuItemText}
                />
            </View>
            {/* <Divider /> */}
            {/* <View style={styles.menuItemContainer}>
                <Menu.Item
                onPress={() => {
                    toggleTheme();
                    closeMenu();
                }}
                title={isDarkMode ? 'Dark Mode' : 'Dark Mode'}
                icon={isDarkMode ? 'weather-night' : 'weather-night'}
                titleStyle={styles.menuItemText}
                />
            </View> */}
            {/* <Divider /> */}
            <View style={styles.menuItemContainer}>
                <Menu.Item
                onPress={handleLogout}
                title="Logout"
                icon="logout"
                titleStyle={styles.menuItemText}
                disabled={loading}
                />
            </View>
            </Menu>
            {loading && (
            <ActivityIndicator size="small" color="#000" style={styles.loadingIndicator} />
            )}
        </View>
        </Provider>
    );
    };

    const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //marginBottom: 10,
        marginTop:15,
        paddingHorizontal: 10,
        position: 'fixed',
    },
    logo: {
        marginTop: 10,
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    menu: {
        width: 100, 
        marginTop: 29,
        position: 'absolute',
        zIndex: 1001,
        backgroundColor: (props) => props.isDarkMode ? '#000' : '#fff', 
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
