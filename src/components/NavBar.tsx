import Link from "next/link";

export default function NavBar() {
  // TODO: Show the currently logged-in user

  return (
    <header className="sticky top-0 bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="font-bold">
          Next-Auth v5 Tutorial
        </Link>
      </nav>
    </header>
  );
}
