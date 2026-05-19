import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { PremiumButton } from "@/components/premium-button";
import {
  FEATURED_MOODS,
  RECENT_CREATIONS,
} from "@/lib/explore-data";
import { cn } from "@/lib/utils";

export function ExploreView() {
  return (
    <div className="flex-1 px-6 py-10 lg:px-14 lg:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-medium text-charcoal">
            Explore
          </h1>
          <p className="mt-2 max-w-md text-muted-warm">
            Saved pours, mood collections, and recent creations from your bar.
          </p>
        </div>
        <PremiumButton href="/create">Create new</PremiumButton>
      </div>

      <section className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
          Explore by mood
        </h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {FEATURED_MOODS.map((m) => (
            <Link
              key={m.id}
              href={`/create`}
              className={cn(
                "flex h-28 min-w-[7.5rem] shrink-0 flex-col justify-end rounded-2xl p-4 transition-transform duration-300 hover:scale-[1.02]",
                m.surface,
              )}
            >
              <span className="text-sm font-medium text-charcoal">{m.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
          Recent creations
        </h2>
        <ul className="mt-6 divide-y divide-border/80">
          {RECENT_CREATIONS.map((c) => (
            <li key={c.id}>
              <Link
                href="/create"
                className="flex items-center gap-5 py-5 transition-colors hover:bg-stone/30"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-stone">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-charcoal">{c.name}</p>
                  <p className="mt-0.5 text-sm text-muted-warm">
                    {c.tags.join(" · ")}
                  </p>
                </div>
                <Heart
                  className={cn(
                    "size-5 shrink-0",
                    c.favorited ? "fill-blush text-blush" : "text-border",
                  )}
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
