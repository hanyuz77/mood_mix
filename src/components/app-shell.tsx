"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Home,
  Martini,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home, match: "exact" as const },
  { href: "/create", label: "My Creations", icon: Sparkles, match: "prefix" as const },
  { href: "/favorites", label: "Favorites", icon: Bookmark, match: "prefix" as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grain flex min-h-screen bg-ivory">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border/80 bg-[#faf8f4] px-5 py-8 lg:flex">
        <Link href="/" className="mb-10 flex items-center gap-2.5">
          <Martini className="size-6 text-olive" strokeWidth={1.5} />
          <span className="font-serif text-xl font-medium tracking-tight text-charcoal">
            Mood Mix
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-300",
                  isActive
                    ? "bg-stone/80 font-medium text-charcoal"
                    : "text-muted-warm hover:bg-stone/50 hover:text-charcoal",
                )}
              >
                <item.icon className="size-4 opacity-70" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/60 px-5 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-olive/10 text-olive">
              <Martini className="size-3.5" strokeWidth={1.5} />
            </span>
            <span className="font-serif text-lg text-charcoal">Mood Mix</span>
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-olive px-4 py-2 text-xs font-medium text-ivory"
          >
            Create
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
