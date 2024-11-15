// import { CreateCategorySchema, DeleteCategorySchema } from "@/schemas/categories.schema";
import { db } from "../lib/db";
import { getCurrentUser } from "../services/user.services";
import { hasSubscription } from "../services/stripe.services";

// Create a category
export async function createCategory(form) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { name, icon, type } = parsedBody.data;
  const user = await getCurrentUser();

  if (!user) {
    // Return an object indicating that the user should be redirected to sign in
    return { error: true, redirect: "/auth/sign-in" };
  }

  const hasAccess = await hasSubscription();

  if (!hasAccess && user.categoriesAttemps === 0) {
    return { error: true, redirect: "/upgrade?categoriesLimit=true" };
  }

  const [category] = await db.$transaction([
    db.category.create({
      data: {
        userId: user.id,
        name,
        icon,
        type,
      },
    }),
    // Decrease categories attempts
    db.user.update({
      where: {
        id: user.id,
      },
      data: {
        categoriesAttemps: {
          decrement: hasAccess ? 0 : 1,
        },
      },
    }),
  ]);

  return { category };
}

// Delete a category
export async function deleteCategory(form) {
  const parsedBody = DeleteCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { name, type } = parsedBody.data;
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, redirect: "/auth/sign-in" };
  }

  await db.category.delete({
    where: {
      name_userId_type: {
        name,
        type,
        userId: user.id,
      },
    },
  });

  return { success: true };
}
