"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { RecipeDetail } from "@/components/recipe-detail";
import { PremiumButton } from "@/components/premium-button";
import {
  buildVibeFromMood,
  MOODS,
  SUGGESTED_INGREDIENTS,
  type MoodId,
} from "@/lib/moods";
import type { CocktailRecipe } from "@/lib/schemas/recipe";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";

const CUSTOM_MAX = 200;

type Step = 1 | 2 | 3;

function parseIngredients(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CreateWizard() {
  const router = useRouter();
  const { addFavorite, isSaved } = useFavorites();
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<MoodId | null>("cozy");
  const [customFeeling, setCustomFeeling] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<CocktailRecipe | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<"recipe" | "photo">("recipe");
  const [error, setError] = useState<string | null>(null);

  const vibe = buildVibeFromMood(mood, customFeeling);
  const canAdvanceStep1 = vibe.length > 0;

  function toggleIngredient(ing: string) {
    setSelectedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing],
    );
  }

  async function fetchCocktailImage(data: CocktailRecipe) {
    setImageLoading(true);
    setImageError(null);
    setImageSrc(null);
    try {
      const imgRes = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: data }),
        cache: "no-store",
      });
      const imgJson = (await imgRes.json()) as {
        success: boolean;
        image?: string;
        error?: string;
      };
      if (!imgJson.success || !imgJson.image) {
        throw new Error(imgJson.error ?? "Photo unavailable.");
      }
      setImageSrc(imgJson.image);
    } catch (e) {
      setImageError(
        e instanceof Error ? e.message : "Photo unavailable — recipe is ready.",
      );
    } finally {
      setImageLoading(false);
    }
  }

  async function generate() {
    setLoading(true);
    setLoadingPhase("recipe");
    setError(null);
    setImageSrc(null);
    setImageError(null);
    const fromInput = parseIngredients(ingredientInput);
    const ingredients = Array.from(
      new Set([...selectedIngredients, ...fromInput]),
    );

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vibe,
          ...(ingredients.length ? { ingredients } : {}),
        }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: CocktailRecipe;
        error?: string;
      };
      if (!json.success || !json.data) {
        throw new Error(json.error ?? "Something went wrong.");
      }
      setRecipe(json.data);
      setStep(3);
      setLoadingPhase("photo");
      await fetchCocktailImage(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not craft your cocktail.");
    } finally {
      setLoading(false);
    }
  }

  if (step === 3 && recipe) {
    return (
      <RecipeDetail
        recipe={recipe}
        imageSrc={imageSrc}
        imageLoading={imageLoading}
        vibe={vibe}
        saved={isSaved(recipe.name)}
        onBack={() => { setStep(1); setRecipe(null); setImageSrc(null); setImageError(null); setShowRecipe(false); }}
        onSave={() => addFavorite(recipe, vibe, imageSrc)}
        onViewFavorites={() => router.push("/favorites")}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10 lg:py-14">
      <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-muted-warm">
        Step {step} of 3
      </p>

      {step === 1 && (
        <>
          <h1 className="mt-4 text-center font-serif text-4xl font-medium text-charcoal">
            How are you feeling?
          </h1>
          <p className="mt-2 text-center text-sm text-muted-warm">
            Choose a mood, then tell us about the moment.
          </p>

          <div className="mt-10 -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:-mx-14 lg:px-14 xl:-mx-20 xl:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MOODS.map((m) => {
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
                    selected
                      ? "border-olive bg-olive text-ivory"
                      : "border-border bg-card text-charcoal hover:border-olive/50 hover:bg-stone/60",
                  )}
                >
                  <span className="mr-1.5">{m.emoji}</span>{m.label}
                </button>
              );
            })}
          </div>

          <label className="mt-10 block">
            <span className="text-sm font-medium text-charcoal">
              What are you feeling right now?
            </span>
            <textarea
              value={customFeeling}
              onChange={(e) =>
                setCustomFeeling(e.target.value.slice(0, CUSTOM_MAX))
              }
              placeholder="ex. cozy rainy evening with jazz and candles…"
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-charcoal shadow-xs transition-shadow placeholder:text-muted-warm/80 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
            />
            <span className="mt-1 block text-right text-xs tabular-nums text-muted-warm">
              {customFeeling.length}/{CUSTOM_MAX}
            </span>
          </label>

          <PremiumButton
            type="button"
            className="mt-8 w-full"
            disabled={!canAdvanceStep1}
            onClick={() => setStep(2)}
          >
            Next
            <ArrowRight className="ml-2 inline size-4" />
          </PremiumButton>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="mt-4 text-center font-serif text-4xl font-medium text-charcoal">
            What ingredients do you have?
          </h1>
          <p className="mt-2 text-center text-sm text-muted-warm">
            Optional — we&apos;ll design around your cabinet.
          </p>

          <label className="mt-10 block">
            <span className="sr-only">Ingredients</span>
            <div className="relative">
              <UtensilsCrossed className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-warm" />
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                placeholder="Type an ingredient and press enter…"
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-charcoal shadow-xs focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = ingredientInput.trim();
                    if (v) {
                      toggleIngredient(v);
                      setIngredientInput("");
                    }
                  }
                }}
              />
            </div>
          </label>

          <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-warm">
            Popular suggestions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_INGREDIENTS.map((ing) => {
              const on = selectedIngredients.includes(ing);
              return (
                <button
                  key={ing}
                  type="button"
                  onClick={() => toggleIngredient(ing)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                    on
                      ? "border-olive bg-olive/10 text-olive-deep"
                      : "border-border bg-card text-charcoal hover:border-olive/40",
                  )}
                >
                  {ing}
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-6 rounded-xl bg-blush/30 px-4 py-3 text-sm text-espresso">
              {error}
            </p>
          )}

          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-border text-sm font-medium text-charcoal transition-colors hover:bg-stone/80"
            >
              Back
            </button>
            <PremiumButton
              type="button"
              className="flex-[2]"
              disabled={loading}
              onClick={generate}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 inline size-4 animate-spin" />
                  {loadingPhase === "photo"
                    ? "Catching the light…"
                    : "Crafting…"}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 inline size-4" />
                  Generate cocktail
                </>
              )}
            </PremiumButton>
          </div>
        </>
      )}
    </div>
  );
}
