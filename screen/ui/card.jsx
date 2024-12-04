// import React from "react";
// import { View, Text } from "react-native";

// import { cn } from "../lib/utils";

// export const Card = React.forwardRef(({ className, ...props }, ref) => (
//   <View
//     ref={ref}
//     style={[
//       {
//         borderRadius: 8,
//         borderWidth: 1,
//         backgroundColor: '#fff', // Adjust this based on your theme
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 1,
//         elevation: 1, // For Android shadow
//       },
//       className && cn(className), // If `cn` utility can be adapted for styles
//     ]}
//     {...props}
//   />
// ));
// Card.displayName = "Card";

// export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
//   <View
//     ref={ref}
//     style={[
//       { padding: 16, flexDirection: "column" },
//       className && cn(className),
//     ]}
//     {...props}
//   />
// ));
// CardHeader.displayName = "CardHeader";

// export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
//   <Text
//     ref={ref}
//     style={[
//       { fontSize: 24, fontWeight: "600", lineHeight: 28, textAlign: "center"},
//       className && cn(className),
//     ]}
//     {...props}
//   />
// ));
// CardTitle.displayName = "CardTitle";

// export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
//   <Text
//     ref={ref}
//     style={[
//       { fontSize: 14, color: 'gray', textAlign: "center"},
//       className && cn(className),
//     ]}
//     {...props}
//   />
// ));
// CardDescription.displayName = "CardDescription";

// export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
//   <View
//     ref={ref}
//     style={[
//       { padding: 16, paddingTop: 0 },
//       className && cn(className),
//     ]}
//     {...props}
//   />
// ));
// CardContent.displayName = "CardContent";

// export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
//   <View
//     ref={ref}
//     style={[
//       { padding: 16, flexDirection: "row", alignItems: "center" },
//       className && cn(className),
//     ]}
//     {...props}
//   />
// ));
// CardFooter.displayName = "CardFooter";






import React from "react";
import { View, Text } from "react-native";

export const Card = React.forwardRef(({ theme, className, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      {
        padding:5,
        // borderRadius: 8,
        // borderWidth: 1,
        backgroundColor: theme?.cardBackground || "#fff", // Use theme background
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        // elevation: 4,
        // shadowRadius: 1,
        // elevation: 1, // For Android shadow
        // borderColor: theme?.text || "#000", // Use theme text color for border
        marginBottom: 25,
        //==========================
        shadowColor: '#000',
        borderRadius: 10,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 1, 
        
      },
      className, // Assuming `cn` is already resolved to styles
    ]}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ theme, className, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      { padding: 10, flexDirection: "column" },
      className,
    ]}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(({ theme, className, ...props }, ref) => (
  <Text
    ref={ref}
    style={[
      {
        fontSize: 25,
        fontWeight: "600",
        lineHeight: 28,
        textAlign: "center",
        color: theme?.text || "#000", // Use theme text color
      },
      className,
    ]}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(({ theme, className, ...props }, ref) => (
  <Text
    ref={ref}
    style={[
      {
        fontSize: 14,
        color: theme?.text || "gray", // Use theme text color
        textAlign: "center",
      },
      className,
    ]}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ theme, className, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      { padding: 0, paddingTop: 0, paddingBottom: 10 },
      className,
    ]}
    {...props}
  />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef(({ theme, className, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      { padding: 16, flexDirection: "row", alignItems: "center" },
      className,
    ]}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";