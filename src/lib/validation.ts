import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

// Define the schema for creating a post
export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  details: z.string().trim().min(1, "Details cannot be empty"),
});

// Define the TypeScript type inferred from the schema
export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export type CreatePostValues = z.infer<typeof createPostSchema>;
