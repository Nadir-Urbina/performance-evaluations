"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EvaluationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const tabs = [
    {
      name: "All Evaluations",
      href: "/evaluations",
      active: pathname === "/evaluations",
    },
    {
      name: "Schedules",
      href: "/evaluations/schedules",
      active: pathname.startsWith("/evaluations/schedules"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-3 border-b-2 text-sm font-medium ${
                tab.active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {children}
    </div>
  );
} 