// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Menu, Provider, Avatar, Divider } from 'react-native-paper';
// import { auth } from '../../config/firebaseConfig';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// const Header = ({ navigation, isDarkMode, toggleTheme }) => {
// const [menuVisible, setMenuVisible] = useState(false);
// const [userName, setUserName] = useState(null);
// const [loading, setLoading] = useState(false);
// const [userPhoto, setUserPhoto] = useState(null);

// useEffect(() => {
//      // Configure Google Sign-In
//      GoogleSignin.configure({
//           webClientId:  "622095554406-32i6saoa7sn60bu32n33f4um21ep2i65.apps.googleusercontent.com",
//        });

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//         const displayName = user.displayName ? user.displayName : user.email?.split('@')[0] || 'User';
//         setUserName(displayName);
//         setUserPhoto(user.photoURL);
//     } else {
//         setUserName(null);
//         setUserPhoto(null);
//     }
//     });

//     return () => unsubscribe();
// }, []);

// const openMenu = () => setMenuVisible(true);
// const closeMenu = () => setMenuVisible(false);

// const handleLogout = async () => {
//     closeMenu();
//     setLoading(true);
//     console.log("logout clicked")
//     try {
//         const currentUser = auth.currentUser;
//         if (currentUser.providerData.some(provider => provider.providerId === 'google.com')) {
//           // Revoke Google token and sign out
//           await GoogleSignin.revokeAccess();
//           await GoogleSignin.signOut();
//         }
//     await signOut(auth);
//     Alert.alert("Logged Out", "You have successfully logged out.");
//     navigation.navigate("signin");
//     } catch (error) {
//     console.log(error);
//     Alert.alert("Logout Error", error.message);

//     } finally {
//     setLoading(false);
//     }
// };

// const getAvatarLabel = () => {
//     if (userName) {
//     return userName.slice(0, 2).toUpperCase();
//     }
//     return 'U';
// };

// return (
//     <Provider>
//     <View style={[styles.header, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
//         <Image
//         source={require('../../assets/wallet_logo.png')}
//         style={styles.logo}
//         />
//         <Menu
//         visible={menuVisible}
//         onDismiss={closeMenu}
//         anchor={
//             <TouchableOpacity onPress={openMenu}>
//             {userPhoto ? (
//                 <Avatar.Image size={45} source={{ uri: userPhoto }}style={[styles.avatar, { backgroundColor: 'transparent' }]} />
//             ) : (
//                 <Avatar.Text size={45} label={getAvatarLabel()} style={[styles.avatar, { backgroundColor: 'transparent' }]}  />
//             )}
//             </TouchableOpacity>
//         }
//         style={[
//             styles.avatarContainer,
//              {
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//             },
//            ]}
//         >
//         <View style={[styles.menuItemContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
//             <Menu.Item
//             onPress={() => {
//                 toggleTheme();
//                 closeMenu();
//             }}
//             title={isDarkMode ? 'Light' : 'Dark'}
//             icon={isDarkMode ? 'weather-sunny' : 'weather-night' }
//             titleStyle={[styles.menuItemText,{ color: isDarkMode ? '#fff' : '#000' },]}
//             />
//         </View>
//         {/* <Divider /> */}
//         {/* <View style={styles.menuItemContainer}>
//             <Menu.Item
//             onPress={() => {
//                 toggleTheme();
//                 closeMenu();
//             }}
//             title={isDarkMode ? 'Dark Mode' : 'Dark Mode'}
//             icon={isDarkMode ? 'weather-night' : 'weather-night'}
//             titleStyle={styles.menuItemText}
//             />
//         </View> */}
//         <Divider />
//         <View style={[styles.menuItemContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
//             <Menu.Item
//             onPress={handleLogout}
//             title="Logout"
//             icon="logout"
//             titleStyle={[ styles.menuItemText, { color: isDarkMode ? '#fff' : '#000' },]}
//             disabled={loading}
//             />
//         </View>
//         </Menu>
//         {loading && (
//         <ActivityIndicator size="small" color="#000" style={styles.loadingIndicator} />
//         )}
//     </View>
//     </Provider>
// );
// };

// const styles = StyleSheet.create({
// header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     //marginBottom: 10,
//     marginTop:15,
//     paddingHorizontal: 10,
//     position: 'fixed',
// },
// avatarContainer:{
//     marginTop: 0,
//     marginBottom: 0,
//   },
//   avatar:{
//     backgroundColor: 'transparent',
//     marginTop: 0,
//     marginBottom: 0,
//     paddingTop: 0,
//     paddingBottom: 0,
//   },
// logo: {
//     marginTop: 10,
//     width: 50,
//     height: 50,
//     marginBottom: 10,
// },
// menu: {
//     width: 100,
//     position: 'absolute',
//     zIndex: 1001,
//     marginTop:10,
//     // backgroundColor: 'transparent',
//     backgroundColor: (props) => props.isDarkMode ? '#000' : '#fff',
// },
// menuItemText: {
//     // color: '#000',
//     color: (props) => (props.isDarkMode ? '#fff' : '#000'),
// },
// menuItemContainer: {
//      backgroundColor: 'transparent',
//     // padding: 5,
//     // borderRadius: 5,
//   },
// loadingIndicator: {
//     position: 'absolute',
//     right: 20,
// },
// });

// export default Header;



import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Menu, Provider, Avatar, Divider } from 'react-native-paper';
import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from '@react-navigation/native';

const Header = ({ isDarkMode, toggleTheme }) => {
  const navigation = useNavigation();
  console.log('Navigation prop:', navigation);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: "622095554406-32i6saoa7sn60bu32n33f4um21ep2i65.apps.googleusercontent.com",
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
    try {
      const currentUser = auth.currentUser;
      if (currentUser?.providerData.some(provider => provider.providerId === 'google.com')) {
        // Revoke Google token and sign out
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      await signOut(auth);
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error(error);
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
        <Image source={require('../../assets/wallet_logo.png')} style={styles.logo} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              {userPhoto ? (
                <Avatar.Image size={45} source={{ uri: userPhoto }} style={[styles.avatar, { backgroundColor: 'transparent' }]} />
              ) : (
                <Avatar.Text size={45} label={getAvatarLabel()} style={[styles.avatar, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]} />
                // <Avatar.Text size={45} label={getAvatarLabel()} style={[styles.avatar, { backgroundColor: 'transparent' }]}/>
              )}
            </TouchableOpacity>
          }
          contentStyle={{
            backgroundColor: isDarkMode ? '#333' : '#f9f9f9', // Menu background color
          }}
        // style={[
        //   styles.menu,
        //   { backgroundColor: isDarkMode ? '#000' : '#fff' },
        // ]}
        >
          <Menu.Item
            onPress={() => {
              toggleTheme();
              closeMenu();
            }}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
            titleStyle={[
              styles.menuItemText,
              { color: isDarkMode ? '#fff' : '#000' },
            ]}
          />
          <Divider />
          <Menu.Item
            onPress={handleLogout}
            title="Logout"
            icon="logout"
            titleStyle={[
              styles.menuItemText,
              { color: isDarkMode ? '#fff' : '#000' },
            ]}
            disabled={loading}
          />
        </Menu>
        {loading && <ActivityIndicator size="small" color="#000" style={styles.loadingIndicator} />}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
    padding: 15,
    marginLeft: 10
  },
  avatar: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
  menu: {
    marginTop: 0,
    // position:'absolute',
    // top:0,
    // left:'60%',
    // right:10,
    // zIndex:10,
  },
  menuItemText: {
    fontSize: 16,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 20,
  },
});

export default Header;