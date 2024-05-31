import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
  });

  return (
    <main className="flex flex-col items-center gap-6 px-3 py-10">
      <ul className="list-inside list-disc">
        {posts.map((post) => (
          <li key={post.postId} className="flex flex-col items-start space-y-1">
            <Link href={`/post/${post.postId}`} className="hover:underline">
              <span className="text-blue-500 hover:text-blue-700">{post.title}</span>
            </Link>
            <div className="text-gray-600">Posted by: {post.user.email}</div>
            <div className="text-gray-600">Created at: {new Date(post.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
