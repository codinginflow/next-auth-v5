"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreatePostValues, createPostSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function createPost(values: CreatePostValues) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw Error("Unauthorized");
  }

  const { title, details } = createPostSchema.parse(values);

  await prisma.post.create({
    data: {
      title,
      details,
      user: {
        connect: { id: userId }
      }
    },
  });  

  revalidatePath("/");
}
