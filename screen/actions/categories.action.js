import * as Yup from 'yup';

import { getUserByEmail, storeCategory, updateCategoryAttempts, deleteCategoryByUserId } from "../services/firebaseSettings"
import { hasSubscription } from "../services/stripe.services";

// Define a schema using Yup for validation
const CreateCategorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  icon: Yup.string().required('Icon is required'),
  type: Yup.string().required('Type is required'),
});

const DeleteCategorySchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name must be at least 3 characters').max(20, 'Name must be less than 20 characters').required('Name is required'),
  type: Yup.mixed().oneOf(['income', 'expense'], 'Type must be either "income" or "expense"').required('Type is required'),
});

// Create a category
export async function createCategory(value) {

  console.log("111 - Incoming value:", value); // Log the value before validation

  try {
    // Validate the value
    const parsedBody = await CreateCategorySchema.validate(value, { abortEarly: false });
    
    console.log("Validated value:", parsedBody);

    if (!parsedBody.success) {
      throw new Error(parsedBody.error.message);
    }

    const { name, icon, type } = parsedBody;

    console.log("Parsed and validated values:", { name, icon, type });


    // const user = await getCurrentUser();

    // if (!user) {
    //   // Return an object indicating that the user should be redirected to sign in
    //   return { error: true, redirect: "/auth/sign-in" };
    // }

    const hasAccess = await hasSubscription();

    if (!hasAccess && user.categoriesAttemps === 0) {
      return { error: true, redirect: "/upgrade?categoriesLimit=true" };
    }

    let data = {
      name: name,
      icon: icon,
      type: type,
    };

    // Store category
    const categories = await storeCategory(userId, data);

    // Update category attempts
    await updateCategoryAttempts(userId, hasAccess ? 0 : -1); // Pass -1 to decrement

    return { categories };
  } catch (error) {
    console.error("Error during category creation:", error);
    throw error;
  }

}

export async function deleteCategory(form) {

  const parsedBody = await DeleteCategorySchema.validate(form, { abortEarly: false });

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { name, type } = parsedBody;

  // const user = await getCurrentUser();

  // if (!user) {
  //   return { error: true, redirect: "/auth/sign-in" };
  // }

  let categoryData = {
    name: name,
    type: type,
  }

  const deleteResponse = await deleteCategoryByUserId(userId, categoryData);

  return deleteResponse.success ? 'Category deleted.' : deleteResponse.message ;
}
