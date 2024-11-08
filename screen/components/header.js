// Header.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { Menu, Provider, Avatar, Divider, Text } from 'react-native-paper';
import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Header = ({ navigation, isDarkMode, toggleTheme }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName ? user.displayName : user.email?.split('@')[0] || 'User';
        setUserName(displayName);
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.navigate("signin");
    } catch (error) {
      console.log(error);
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <Provider>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <Image
          source={require("../../assets/wallet_logo.png")}
          style={styles.logo}
        />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Avatar.Text size={45} label={userName ? userName.charAt(0).toUpperCase() : 'U'} />
            </TouchableOpacity>
          }
          style={[
            styles.menu,
            { backgroundColor: isDarkMode ? '#333' : '#fff' }, // Adjust menu background color
            { marginLeft: -10 }, // Move menu a little left
            { position: 'absolute', top: 1 },
          ]}
        >
          <View style={styles.menuItemContainer}>
            <Menu.Item
              onPress={() => {
                toggleTheme();
                closeMenu();
              }}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              icon={isDarkMode ? "weather-sunny" : "weather-night"}
              titleStyle={styles.menuItemText}
            />
          </View>
          <Divider />
          <View style={styles.menuItemContainer}>
            <Menu.Item
              onPress={() => {
                handleLogout();
                closeMenu();
              }}
              title="Logout"
              icon="logout"
              titleStyle={styles.menuItemText}
            />
          </View>
        </Menu>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    position: 'relative',
  },
  logo: {
    marginTop: 10,
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  menu: {
    width: 100, 
    marginTop: 3,
  },
  menuItemContainer: {
    backgroundColor: '#fff', 
  },
  menuItemText: {
    color: '#000',
  }
});

export default Header;
