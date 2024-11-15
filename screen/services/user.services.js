import { db } from "../lib/db";
import { fetchUserByEmail, getSettingsByUserId } from "./firebaseSettings";
import React from 'react';
import { useRoute } from '@react-navigation/native';

// const route = useRoute();
// const { email, password, googleEmail } = route.params;


// console.log("Email:", email);
// console.log("Password:", password);
// console.log("googleEmail:", googleEmail);

export async function getCurrentUser() {

  const route = useRoute();
  const { email, password, googleEmail } = route.params;

  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Google Email:", googleEmail);

  const user = await fetchUserByEmail(email);
  if (!user) {
    redirect("/auth/sign-in");
  }
  return user;
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    const user = await fetchUserByEmail(email);
    return user;
  } catch {
    return null;
  }
}


export async function getSettings() {
  const user = await getCurrentUser();

  if (user.error) {
    return { error: true, redirect: user.redirect };
  }

  // Retrieve settings by user ID from Firestore
  const settings = await getSettingsByUserId(user.id);
  return settings;
}
