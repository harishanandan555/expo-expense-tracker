import React from "react";
import { View, StyleSheet } from "react-native";

import { cn } from "../lib/utils"; // Utility function for class name merging

// Separator component for React Native
export const Separator = React.forwardRef(({ orientation = "horizontal", decorative = true, style, ...props }, ref) => {
  const separatorStyle = [
    styles.separator,
    orientation === "horizontal" ? styles.horizontal : styles.vertical,
    style,
  ];

  return (
    <View ref={ref} accessibilityRole={decorative ? "none" : "separator"} style={separatorStyle} {...props} />
  );
});

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#d1d5db", // Equivalent to "bg-border" in Tailwind CSS
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    width: 1,
    height: "100%",
  },
});
