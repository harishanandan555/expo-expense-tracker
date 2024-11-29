// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// import Header from './header';
// import Footer from './footer';


// const themes = {
//     light: {
//       background: '#ffffff',
//       text: '#000000',
//       buttonBackground: '#ffffff',
//       buttonBorder: '#333',
//       buttonText: '#000000',
//       tableHeaderBackground: '#ffffff',
//       tableHeaderText: '#000000',
//       transactionBackground: '#ffffff',
//       transactionText: '#000000',

//     },
//     dark: {
//       background: '#000000',
//       text: '#ffffff',
//       buttonBackground: '#333',
//       buttonText: '#ffffff',
//       tableHeaderBackground: '#333',
//       tableHeaderText: '#ffffff',
//       transactionBackground: '#121212',
//       transactionText: '#ffffff',
//     },
// };

// export default function MainScreen() {

//     const [theme, setTheme] = useState('dark');

//     const navigation = useNavigation();

//     const toggleTheme = () => {
//         setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//     };

//     return (
//         <View style={styles.container}>

//           {/* Header Section */}
//           <View style={styles.header}>
//               <Header isDarkMode={theme === "dark"} toggleTheme={toggleTheme} navigation={navigation} />
//           </View>

//           {/* Body Section */}
//           <View style={styles.body}>
//               <Footer />
//           </View>

//         </View>
//     );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: '10%', // 10% of the screen height
//     backgroundColor: '#f8f8f8', // Header background color
//   },
//   body: {
//     flex: 1, // Remaining 90% of the screen
//   },
// });



// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// import Header from './header';
// import Footer from './footer';
// import DashboardScreen from './dashboard';
// import TransactionScreen from './transaction';
// import SettingScreen from './Setting';

// const themes = {
//   light: {
//     background: '#ffffff',
//     text: '#000000',
//     buttonBackground: '#ffffff',
//     buttonBorder: '#333',
//     buttonText: '#000000',
//     tableHeaderBackground: '#ffffff',
//     tableHeaderText: '#000000',
//     transactionBackground: '#ffffff',
//     transactionText: '#000000',
//   },
//   dark: {
//     background: '#000000',
//     text: '#ffffff',
//     buttonBackground: '#333',
//     buttonText: '#ffffff',
//     tableHeaderBackground: '#333',
//     tableHeaderText: '#ffffff',
//     transactionBackground: '#121212',
//     transactionText: '#ffffff',
//   },
// };

// export default function MainScreen() {
//   const [theme, setTheme] = useState('dark');
//   const [currentScreen, setCurrentScreen] = useState('Dashboard');
//   const navigation = useNavigation();

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   const renderCurrentScreen = () => {
//     switch (currentScreen) {
//       case 'Dashboard':
//         return <DashboardScreen />;
//       case 'Transactions':
//         return <TransactionScreen />;
//       case 'Settings':
//         return <SettingScreen />;
//       default:
//         return <DashboardScreen />;
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: themes[theme].background }]}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Header isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} navigation={navigation} />
//       </View>

//       {/* Body Section */}
//       <View style={styles.body}>{renderCurrentScreen()}</View>

//       {/* Footer Section */}
//       <View style={styles.footer}>
//         <Footer setCurrentScreen={setCurrentScreen} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: '10%', // 10% of the screen height
//     backgroundColor: '#f8f8f8',
//   },
//   body: {
//     flex: 1, // Remaining space (80% of the screen)
//   },
//   footer: {
//     height: '8%', // 10% of the screen height
//     backgroundColor: '#f8f8f8',
//   },
// });





import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../themeContext';
import Header from './header';
import Footer from './footer';
import DashboardScreen from './dashboard';
import TransactionScreen from './transaction';
import SettingScreen from './Setting';

export default function MainScreen() {
  const { theme, toggleTheme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  // const [currentScreen, setCurrentScreen] = useState('Settings');

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen theme={theme} />;
      case 'Transactions':
        return <TransactionScreen theme={theme} />;
      case 'Settings':
        return <SettingScreen theme={theme} />;
      default:
        return <DashboardScreen theme={theme} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Status Bar */}
      <StatusBar
        barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Header isDarkMode={theme.text === '#ffffff'} toggleTheme={toggleTheme} />
      </View>

      {/* Body Section */}
      <View style={styles.body}>{renderCurrentScreen()}</View>

      {/* Footer Section */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <Footer theme={theme} setCurrentScreen={setCurrentScreen} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // position:'absolute',
    top:0,
    left:'10',
    right:10,
    zIndex:10,
    height: '10%',
  },
  body: {
    flex: 1,
    height: '80%',
  },
  footer: {
    height: '8%',
  },
});