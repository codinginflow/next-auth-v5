/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com", 
        //it is better not to include it here. it has payment. 
        //it is better if you will let user upload their profile pictures
      },
    ],
  },
};

export default nextConfig;
