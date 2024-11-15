import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Menu, Provider, Avatar, Divider } from 'react-native-paper';
import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = ({ navigation, isDarkMode, toggleTheme }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);

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
            { backgroundColor: isDarkMode ? '#333' : '#fff' },
            { marginLeft: -10 },
            { position: 'absolute', top: 1, zIndex: 1000},
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
