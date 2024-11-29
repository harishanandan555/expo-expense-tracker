import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themes = {
    cardBackground: "#f9f9f9",
    textColor: "#333333",
    subTextColor: "#888888",
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
    },
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[currentTheme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);