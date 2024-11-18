// export function cn(...inputs) {
//     return inputs.filter(Boolean).join(' ');
// }


import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to merge class names for React Native
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}