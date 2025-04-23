"use client";

import Link from "next/link";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function UserAccountNav({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col space-y-1 leading-none">
        {user.name && <p className="font-medium">{user.name}</p>}
        {user.email && (
          <p className="w-[200px] truncate text-sm text-muted-foreground">
            {user.email}
          </p>
        )}
      </div>
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Log out
      </Link>
    </div>
  );
} 