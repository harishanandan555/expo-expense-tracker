import axios from 'axios';

import { getCurrentUser } from "../services/user.services";
import { getSettingsByUserId, storeSettings } from "../services/firebaseSettings";
// const { getSettingsByUserId, storeSettings } = require("../screen/services/firebaseSettings");

export async function fetchUserSettings() {
  const user = await getCurrentUser();

  if (!user) {
    // Redirecting is not applicable in React Native. You might want to show a login screen instead.
    throw new Error("User not authenticated. Redirect to login.");
  }

  // Check for existing settings in Firestore
  let settings = await getSettingsByUserId(user.id);

  // If settings do not exist, create new settings with default currency "USD"
  if (!settings) {
    await storeSettings({userId: user.id, currency: "USD"});
    settings = await getSettingsByUserId(user.id); // Retrieve the newly created settings
  }

  return settings; // Return the settings to be used in your component
}