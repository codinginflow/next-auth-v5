// Import the Prisma client for database operations
import prisma from "@/lib/prisma";
// Import the Image component from Next.js for optimized images
import Image from "next/image";
// Import the notFound function to handle 404 errors
import { notFound } from "next/navigation";
// Import the cache function from React to cache data
import { cache } from "react";

// Define the shape of the page's props
interface PageProps {
  params: { id: string }; // Page parameters include a user ID
}

// Function to get user data, caching the result for performance
const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id }, // Find user by ID
    select: { id: true, name: true, image: true, createdAt: true }, // Select specific fields
  });
});

// Function to generate static parameters for dynamic routes
export async function generateStaticParams() {
  const allUsers = await prisma.user.findMany(); // Get all users from the database

  return allUsers.map(({ id }) => ({ id })); // Return an array of user IDs
}

// Function to generate metadata for each page
export async function generateMetadata({ params: { id } }: PageProps) {
  const user = await getUser(id); // Get user data by ID

  return {
    title: user?.name || `User ${id}`, // Set the page title to the user's name or default to "User [ID]"
  };
}

// Main page component
export default async function Page({ params: { id } }: PageProps) {
  // Artificial delay to simulate loading time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const user = await getUser(id); // Get user data by ID

  if (!user) notFound(); // If no user is found, show a 404 error

  return (
    <div className="mx-3 my-10 flex flex-col items-center gap-3">
      {user.image && (
        <Image
          src={user.image} // Display user's profile picture
          width={100}
          alt="User profile picture"
          height={100}
          className="rounded-full"
        />
      )}
      <h1 className="text-center text-xl font-bold">
      {/* Display user's name or default to "User [ID]" */}
        {user?.name || `User ${id}`}  
      </h1>
      <p className="text-muted-foreground">
      {/* Display the date when the user joined */}
        User since: {new Date(user.createdAt).toLocaleDateString()} 
      </p>
    </div>
  );
}
