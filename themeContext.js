// import React, { createContext, useState, useContext } from 'react';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {

//   const [currentTheme, setCurrentTheme] = useState('dark');

//   const toggleTheme = () => {
//     setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   const themes = {
//     cardBackground: "#f9f9f9",
//     textColor: "#333333",
//     subTextColor: "#888888",
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
//   };

//   return (
//     <ThemeContext.Provider value={{ theme: themes[currentTheme], toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);



import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native'; // Import Appearance API

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  console.log("system theme: ", Appearance.getColorScheme())
  // const [currentTheme, setCurrentTheme] = useState('dark');
  const [currentTheme, setCurrentTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    // Listener for system theme changes
    const listener = ({ colorScheme }) => {
      setCurrentTheme(colorScheme); // Automatically update the theme
    };

    const subscription = Appearance.addChangeListener(listener);
    return () => subscription.remove(); // Clean up the listener

  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themes = {
    cardBackground: '#f9f9f9',
    textColor: '#333333',
    subTextColor: '#888888',
    light: {
      background: '#ffffff',
      text: '#000000',
      buttonBackground: '#ffffff',
      buttonBorder: '#333',
      buttonText: '#000000',
      tableHeaderBackground: '#ffffff',
      tableHeaderText: '#000000',
      transactionBackground: '#ffffff',
      transactionText: '#000000',
      //-----------------------------------------------
      modalBackground: '#ffffff', // Background for the modal
      modalContainer: '#f0f0f0', // Container background
      inputBackground: '#ffffff', // Input background color
      inputText: '#000000', // Input text color
      cardbackground: '#444',
      inputBorderColor:'#ccc'
    },
    dark: {
      background: '#000000',
      text: '#ffffff',
      buttonBackground: '#333',
      buttonText: '#ffffff',
      tableHeaderBackground: '#333',
      tableHeaderText: '#ffffff',
      transactionBackground: '#121212',
      transactionText: '#ffffff',
      //-------------------------------------
      modalBackground: '#222222', // Background for the modal
      modalContainer: '#333333', // Container background
      inputBackground: '#444444', // Input background color
      inputText: '#ffffff', // Input text color
      cardbackground: '#444',
      inputBorderColor: '#FF6A00'
    },
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[currentTheme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);