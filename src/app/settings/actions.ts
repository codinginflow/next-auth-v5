"use server";

import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";

// To learn more about server actions, watch my YT tutorial: https://www.youtube.com/watch?v=XD5FpbVpWzk

export async function updateProfile(values: UpdateProfileValues) {
  // TODO: Get the currently authenticated user

  const { name } = updateProfileSchema.parse(values);

  // TODO: Update user
}
