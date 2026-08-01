"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Search,
  Sparkles,
  Library,
  ListMusic,
  Route,
  User,
  LayoutDashboard,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Library },
  { href: "/crates", label: "Crates", icon: ListMusic },
  { href: "/planner", label: "Set Planner", icon: Route },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-purple">
          <Radio className="h-4 w-4 text-background" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">R-SYNC</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-cyan/10 text-cyan"
                  : "text-muted hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm text-muted">Account</span>
          </div>
        </SignedIn>
        <SignedOut>
          <Link href="/login">
            <Button variant="secondary" className="w-full" size="sm">
              Log in
            </Button>
          </Link>
        </SignedOut>
      </div>
    </aside>
  );
}
