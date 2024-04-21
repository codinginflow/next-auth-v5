import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Page() {
  // TODO: Redirect non-admin users

  return (
    <main className="mx-auto my-10 space-y-3">
      <h1 className="text-center text-xl font-bold">Admin Page</h1>
      <p className="text-center">Welcome, admin!</p>
    </main>
  );
}
