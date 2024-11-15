import { Alert } from 'react-native';

// import { SettingsSchema } from "../schemas/settings.schema";
import { getCurrentUser } from "../services/user.services";
import { updateCurrencyUser } from "../services/firebaseSettings";


export async function updateUserCurrency(currency) {
  
  const parsedBody = SettingsSchema.validate({ currency })
    .then(() => true)
    .catch((error) => {
      Alert.alert("Validation Error", error.errors.join(", "));
      return false;
    });

  if (!(await parsedBody)) {
    return; // Stop execution if validation fails
  }

  const user = await getCurrentUser();

  if (!user) {
    Alert.alert("Error", "You must be signed in to update currency.");
    return;
  }

  try {
    // Update the user's currency in Firestore
    const updatedSettings = await updateCurrencyUser(user.id, currency);

    if (!updatedSettings) {
      throw new Error("Failed to update user currency in Firestore.");
    }

    return updatedSettings; // Return the updated settings if successful
  } catch (error) {
    Alert.alert("Error", error.message || "An error occurred while updating currency.");
  }
}
