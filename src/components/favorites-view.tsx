"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { useFavorites } from "@/lib/favorites";
import { PremiumButton } from "@/components/premium-button";
import { cn } from "@/lib/utils";
import type { FlavorTag } from "@/lib/schemas/recipe";

const FLAVOR_COLORS: Record<FlavorTag, string> = {
  light:     "bg-[#ebe4d4]",
  herbal:    "bg-[#d4e3d0]",
  citrusy:   "bg-[#e8dfc5]",
  sparkling: "bg-[#d6e4eb]",
  smooth:    "bg-[#e8d4cf]",
  sweet:     "bg-[#ebd4dc]",
  aromatic:  "bg-[#ddd6eb]",
  smoky:     "bg-[#ddd8ce]",
  complex:   "bg-[#d4d0e3]",
  bold:      "bg-[#e3d0d0]",
  warming:   "bg-[#e8dbc5]",
  floral:    "bg-[#e8d4e3]",
  bitter:    "bg-[#d4ddd0]",
  fruity:    "bg-[#e8d4c5]",
  spicy:     "bg-[#e3d4c5]",
  earthy:    "bg-[#ddd4c5]",
};

function RecipeThumb({ imageSrc, tag }: { imageSrc: string | null; tag: FlavorTag | undefined }) {
  const color = tag ? (FLAVOR_COLORS[tag] ?? "bg-stone") : "bg-stone";

  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt=""
        className="size-14 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-full text-xl", color)}>
      🍸
    </div>
  );
}

export function FavoritesView() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="flex-1 px-6 py-10 lg:px-14 lg:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-medium text-charcoal">Favorites</h1>
          <p className="mt-2 max-w-md text-muted-warm">
            Your saved cocktail creations, always ready to pour.
          </p>
        </div>
        <PremiumButton href="/create">Create new</PremiumButton>
      </div>

      {favorites.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <span className="text-5xl">🍹</span>
          <p className="text-lg font-medium text-charcoal">No favorites yet</p>
          <p className="text-sm text-muted-warm">
            Generate a cocktail and hit &ldquo;Save to Favorites&rdquo; to see it here.
          </p>
          <PremiumButton href="/create" className="mt-2">
            Create your first
          </PremiumButton>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-border/80">
          {favorites.map((saved) => (
            <li key={saved.id} className="flex items-center gap-5 py-5">
              <Link
                href={`/favorites/${saved.id}`}
                className="flex min-w-0 flex-1 items-center gap-5 transition-opacity hover:opacity-70"
              >
                <RecipeThumb imageSrc={saved.imageSrc} tag={saved.recipe.flavorProfile[0]} />
                <div className="min-w-0">
                  <p className="font-medium text-charcoal">{saved.recipe.name}</p>
                  <p className="mt-0.5 text-sm text-muted-warm">
                    {saved.recipe.flavorProfile.slice(0, 3).join(" · ")}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => removeFavorite(saved.id)}
                className="rounded-full p-2 text-muted-warm transition-colors hover:bg-stone/80 hover:text-charcoal"
                aria-label="Remove from favorites"
              >
                <Trash2 className="size-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
