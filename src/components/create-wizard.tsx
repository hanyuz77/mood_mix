"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { FlavorProfile } from "@/components/flavor-profile";
import { PremiumButton } from "@/components/premium-button";
import {
  buildVibeFromMood,
  MOODS,
  SUGGESTED_INGREDIENTS,
  type MoodId,
} from "@/lib/moods";
import type { CocktailRecipe } from "@/lib/schemas/recipe";
import { cn } from "@/lib/utils";

const CUSTOM_MAX = 200;
const RESULT_IMAGE =
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1e?w=900&q=85";

type Step = 1 | 2 | 3;

function parseIngredients(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatTags(profile: CocktailRecipe["flavorProfile"]): string {
  return profile
    .slice(0, 4)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(" · ");
}

export function CreateWizard() {
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<MoodId | null>("relaxed");
  const [customFeeling, setCustomFeeling] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<CocktailRecipe | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showRecipe, setShowRecipe] = useState(false);
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
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-14 lg:py-12">
        <button
          type="button"
          onClick={() => {
            setStep(1);
            setRecipe(null);
            setImageSrc(null);
            setImageError(null);
            setShowRecipe(false);
          }}
          className="mb-8 flex items-center gap-2 text-sm text-muted-warm transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="size-4" />
          Start over
        </button>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10 lg:gap-14">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-warm">
              Your cocktail
            </p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
              {recipe.name}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-warm">
              {formatTags(recipe.flavorProfile)}
            </p>
            <p className="mt-6 text-base leading-relaxed text-charcoal/90">
              {recipe.moodExplanation}
            </p>
            <p className="mt-4 font-serif text-lg italic text-muted-warm">
              &ldquo;{recipe.tagline}&rdquo;
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border/80 py-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-warm">
                  Difficulty
                </p>
                <p className="mt-1 text-sm text-charcoal">Easy</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-warm">
                  Prep time
                </p>
                <p className="mt-1 text-sm text-charcoal">{recipe.prepTime}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-warm">
                  Alcohol
                </p>
                <p className="mt-1 text-sm text-charcoal">Moderate</p>
              </div>
            </div>

            <div className="mt-8">
              <FlavorProfile profile={recipe.flavorProfile} />
            </div>

            <PremiumButton
              type="button"
              className="mt-10 w-full sm:w-auto"
              onClick={() => setShowRecipe((v) => !v)}
            >
              {showRecipe ? "Hide full recipe" : "View full recipe"}
            </PremiumButton>

          </div>

          <div className="relative mx-auto w-full max-w-[15rem] shrink-0 sm:mx-0 sm:w-64 lg:w-72">
            <div className="relative aspect-[3/4] w-full bg-ivory">
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={imageSrc.slice(0, 64)}
                  src={imageSrc}
                  alt={recipe.name}
                  className="h-full w-full object-contain object-center mix-blend-multiply"
                />
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={RESULT_IMAGE}
                    alt=""
                    fill
                    className={cn(
                      "object-contain object-center transition-opacity duration-500",
                      imageLoading ? "opacity-40" : "opacity-100",
                    )}
                    sizes="(max-width: 768px) 100vw, 18rem"
                  />
                </div>
              )}
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="size-8 animate-spin text-olive" />
                  <p className="text-sm font-medium text-muted-warm">
                    Catching the light…
                  </p>
                </div>
              )}
            </div>
            {imageError && !imageLoading && (
              <p className="mt-2 text-center text-xs text-muted-warm sm:text-left">
                {imageError}
              </p>
            )}
          </div>
        </div>

        {showRecipe && (
          <div className="mt-12 max-w-3xl space-y-10 border-t border-border/80 pt-12">
            <div>
              <h2 className="font-serif text-2xl text-charcoal">Ingredients</h2>
              <ul className="mt-4 space-y-2">
                {recipe.ingredients.map((ing) => (
                  <li
                    key={ing.item}
                    className="flex gap-4 text-sm text-charcoal"
                  >
                    <span className="w-20 shrink-0 text-right text-muted-warm">
                      {ing.amount}
                    </span>
                    <span>{ing.item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-charcoal">Instructions</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-charcoal/90">
                {recipe.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            {(recipe.garnish || recipe.glassStyle) && (
              <div className="rounded-2xl bg-stone/60 p-6 text-sm text-charcoal">
                {recipe.garnish && (
                  <p>
                    <span className="text-muted-warm">Garnish · </span>
                    {recipe.garnish}
                  </p>
                )}
                {recipe.glassStyle && (
                  <p className={recipe.garnish ? "mt-2" : ""}>
                    <span className="text-muted-warm">Glass · </span>
                    {recipe.glassStyle}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
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
            Choose a mood, then tell us about the night.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MOODS.map((m) => {
              const Icon = m.icon;
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border px-4 py-5 text-left transition-all duration-300",
                    m.surface,
                    selected
                      ? "ring-2 ring-olive ring-offset-2 ring-offset-ivory"
                      : "hover:shadow-soft",
                    m.border,
                  )}
                >
                  <Icon className="mb-3 size-5 text-charcoal/70" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-charcoal">{m.label}</span>
                  <span className="mt-1 text-xs leading-snug text-charcoal/60">
                    {m.description}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-10 block">
            <span className="text-sm font-medium text-charcoal">
              What kind of night is this?
            </span>
            <textarea
              value={customFeeling}
              onChange={(e) =>
                setCustomFeeling(e.target.value.slice(0, CUSTOM_MAX))
              }
              placeholder="cozy rainy evening with jazz and candles…"
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
              <ShoppingBag className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-warm" />
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
