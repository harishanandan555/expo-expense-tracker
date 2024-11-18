import React from "react";
import { View, StyleSheet } from "react-native";

import { cn } from "../lib/utils";

export const Skeleton = ({ className, ...props }) =>  {
  return (
    <View
      style={[styles.skeleton, className && { ...className }, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e0e0e0", // Muted background color
    borderRadius: 8, // Rounded corners
    animation: "pulse 1.5s infinite", // Add pulse animation
    width: "100%",
    height: 60, // Adjust as per the typical skeleton size
  },
});