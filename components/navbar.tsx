"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center py-4 px-7 border-b sticky top-0 bg-background z-50">
      <Link href="/">
        <h1 className="text-xl font-medium">11</h1>
      </Link>
      <nav>
        <ModeToggle />
      </nav>
    </header>
  );
}
