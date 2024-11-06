import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function TypographyH2({ children }) {
  return (
    <Text style={styles.heading}>
      {children}
    </Text>
  );
}

// Styles
const styles = StyleSheet.create({
  heading: {
    marginTop: 20, // Equivalent to scroll-m-20
    paddingBottom: 8, // Equivalent to pb-2
    fontSize: 24, // Equivalent to text-3xl
    fontWeight: '600', // Equivalent to font-semibold
    letterSpacing: 0.5, // Approximation of tracking-tight
  },
});
