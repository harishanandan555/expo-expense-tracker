// import { useEffect, useState } from "react";
// import { Dimensions } from "react-native";

// export function useMediaQuery(query) {
//   const [value, setValue] = useState(false);

//   useEffect(() => {
//     const { width } = Dimensions.get("window");

//     // Check the query and set the value accordingly
//     const checkMediaQuery = () => {
//       if (query.includes("min-width")) {
//         const minWidth = parseInt(query.split("min-width:")[1], 10);
//         setValue(width >= minWidth);
//       } else if (query.includes("max-width")) {
//         const maxWidth = parseInt(query.split("max-width:")[1], 10);
//         setValue(width <= maxWidth);
//       }
//     };

//     checkMediaQuery(); // Initial check

//     const handleResize = () => {
//       checkMediaQuery(); // Check on resize
//     };

//     // Add event listener for screen dimension changes
//     const subscription = Dimensions.addEventListener("change", handleResize);

//     return () => {
//       // Clean up the event listener
//       subscription?.remove();
//     };
//   }, [query]);

//   return value;
// }



export const useStripeMock = () => ({
  hasAccess: false, // or true to simulate premium access
  onManageBilling: () => console.log("Manage Billing clicked"),
  isLoading: false,
});