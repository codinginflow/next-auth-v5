import Post from "@/components/Post";
import HomePage from "@/components/homePage";
import prisma from "@/lib/prisma";
import Link from "next/link";
import client from "../../tina/__generated__/client";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc' // Sort by createdAt field in descending order
    },
  });

  
  const res =  await client.queries.page({relativePath: "homePage.json"});
  return (
    <HomePage  data={res.data} query={res.query} variables={res.variables}/>
    // <main className="container mx-auto px-4 py-8 flex justify-center">
    //   <ul className="space-y-4">
    //     {posts.map((post) => (
    //       <li key={post.postId} className="p-4 rounded-md">
    //         <Post 
    //           title={post.title ?? ""}
    //           details={post.details ?? ""}
    //         />
    //         <Link href={`/post/${post.postId}`} className="hover:underline">
    //           <p className="text-blue-500 hover:text-blue-700">{post.title}</p>
    //         </Link>
    //         <div className="text-gray-600">Posted by: {post.user.name}</div>
    //         <div className="text-gray-600">Created at: {new Date(post.createdAt).toLocaleString()}</div>
    //       </li>
    //     ))}
    //   </ul>
    // </main>
  );
}
