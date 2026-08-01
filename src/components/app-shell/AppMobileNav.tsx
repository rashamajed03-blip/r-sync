"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles, Library, ListMusic, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/assistant", label: "AI", icon: Sparkles },
  { href: "/library", label: "Library", icon: Library },
  { href: "/crates", label: "Crates", icon: ListMusic },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border py-2 lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 text-[11px]",
              active ? "text-cyan" : "text-muted",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
