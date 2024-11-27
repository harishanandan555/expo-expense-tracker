// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import DashboardScreen from './dashboard';
// import TransactionScreen from './transaction';
// import SettingScreen from './Setting';

// const Tab = createBottomTabNavigator();

// export default function FooterNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarStyle: styles.tabBar,
//         tabBarLabelStyle: styles.tabBarLabel,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === 'Dashboard') iconName = 'dashboard';
//           else if (route.name === 'Transactions') iconName = 'attach-money';
//           else if (route.name === 'Settings') iconName = 'settings';
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
//       <Tab.Screen name="Transactions" component={TransactionScreen} options={{ headerShown: false }} />
//       <Tab.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />
//     </Tab.Navigator>
//   );
// }

// const styles = {
//   tabBar: {
//     backgroundColor: '#000', // Footer background color
//     height: 50, // Footer height
//   },
//   tabBarLabel: {
//     fontSize: 12, // Font size for labels
//   },
// };



// import React from 'react';
// import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// export default function Footer({ setCurrentScreen }) {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => setCurrentScreen('Dashboard')} style={styles.button}>
//         <Icon name="home-outline" size={24} color="#000" />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => setCurrentScreen('Transactions')} style={styles.button}>
//         <Icon name="wallet-outline" size={24} color="#000" />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => setCurrentScreen('Settings')} style={styles.button}>
//         <Icon name="settings-outline" size={24} color="#000" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: '100%',
//     backgroundColor: '#ddd',
//   },
//   button: {
//     flex: 1,
//     alignItems: 'center',
//   },
// });




import React from 'react'; 
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Footer({ theme, setCurrentScreen }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.buttonBackground }]}>
      <TouchableOpacity 
        onPress={() => setCurrentScreen('Dashboard')} 
        style={styles.button}
        accessibilityLabel="Go to Dashboard"
      >
        <Icon name="home-outline" size={24} color={theme.text} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setCurrentScreen('Transactions')} 
        style={styles.button}
        accessibilityLabel="Go to Transactions"
      >
        <Icon name="wallet-outline" size={24} color={theme.text} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setCurrentScreen('Settings')} 
        style={styles.button}
        accessibilityLabel="Go to Settings"
      >
        <Icon name="settings-outline" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10, // Adds some padding to the edges
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Ensures icons are vertically centered
  },
});