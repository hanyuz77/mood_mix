"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

import { FlavorProfile } from "@/components/flavor-profile";
import { PremiumButton } from "@/components/premium-button";
import type { CocktailRecipe } from "@/lib/schemas/recipe";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=85";

type Props = {
  recipe: CocktailRecipe;
  imageSrc: string | null;
  imageLoading?: boolean;
  vibe?: string;
  saved: boolean;
  onBack: () => void;
  onSave: () => void;
  onViewFavorites: () => void;
};

export function RecipeDetail({
  recipe,
  imageSrc,
  imageLoading = false,
  saved,
  onBack,
  onSave,
  onViewFavorites,
}: Props) {
  return (
    <div
      className="grid flex-1 grid-cols-1 lg:grid-cols-2"
      style={{ minHeight: "calc(100vh - 0px)" }}
    >
      {/* LEFT — full-bleed image with overlay */}
      <div className="relative flex flex-col overflow-hidden">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={imageSrc.slice(0, 64)}
            src={imageSrc}
            alt={recipe.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={FALLBACK_IMAGE}
            alt={recipe.name}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              imageLoading ? "opacity-60" : "opacity-100",
            )}
            sizes="50vw"
            priority
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-ivory/80" />
          </div>
        )}

        {/* top bar */}
        <div className="relative z-10 p-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-ivory backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* bottom content */}
        <div className="relative z-10 mt-auto p-8">
          <h1 className="font-serif text-5xl font-medium leading-tight text-ivory lg:text-6xl">
            {recipe.name}
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70">
            {recipe.flavorProfile
              .slice(0, 3)
              .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
              .join(" · ")}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/85">
            {recipe.moodExplanation}
          </p>

          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ivory/50">
                Difficulty
              </p>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-2 rounded-full",
                      i <= 1 ? "bg-ivory" : "bg-ivory/30",
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-ivory/80">Easy</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ivory/50">
                Prep Time
              </p>
              <p className="mt-1 text-sm text-ivory/80">{recipe.prepTime}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ivory/50">
                Alcohol by Vol.
              </p>
              <p className="mt-1 text-sm text-ivory/80">~18%</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {saved ? (
              <PremiumButton type="button" className="gap-2" onClick={onViewFavorites}>
                <Check className="size-4" />
                View in Favorites
              </PremiumButton>
            ) : (
              <PremiumButton type="button" className="gap-2" onClick={onSave}>
                Save to Favorites
                <Sparkles className="size-4" />
              </PremiumButton>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — scrollable recipe */}
      <div className="overflow-y-auto bg-[#f7f5f1] px-8 py-8 lg:px-10 lg:py-10">

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-charcoal">
              Ingredients
            </p>
            <p className="mt-1 text-xs text-muted-warm">1 serving</p>
            <ul className="mt-5 space-y-4">
              {recipe.ingredients.map((ing) => (
                <li key={ing.item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-charcoal/40" />
                  <span className="text-sm text-muted-warm">{ing.amount}</span>
                  <span className="text-sm font-medium text-charcoal">{ing.item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-charcoal">
              Instructions
            </p>
            <ol className="mt-5 space-y-5">
              {recipe.steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-warm">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-charcoal/85">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {recipe.tip && (
            <div className="rounded-2xl bg-stone/50 p-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-warm">
                Tip
              </p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/85">{recipe.tip}</p>
            </div>
          )}
          <div className={cn("rounded-2xl bg-stone/50 p-5", !recipe.tip && "sm:col-span-2")}>
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-muted-warm">
              Flavor Profile
            </p>
            <FlavorProfile profile={recipe.flavorProfile} />
          </div>
        </div>

        {recipe.snackPairings && recipe.snackPairings.length > 0 && (
          <div className="mt-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-charcoal">
              Snack Pairing
            </p>
            <p className="mt-1 text-xs text-muted-warm">
              Perfect bites to elevate your moment.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recipe.snackPairings.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">{p.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-warm">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
