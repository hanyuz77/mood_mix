"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { generateRequestSchema } from "@/lib/schemas/recipe";

const VIBE_MAX = 200;

function parseIngredientList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function VibeForm() {
  const [vibe, setVibe] = useState("");
  const [ingredientsRaw, setIngredientsRaw] = useState("");

  const vibeTrimmed = vibe.trim();
  const canSubmit = vibeTrimmed.length > 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    const ingredients = parseIngredientList(ingredientsRaw);
    const parsed = generateRequestSchema.safeParse({
      vibe: vibeTrimmed,
      ...(ingredients.length > 0 ? { ingredients } : {}),
    });
    if (!parsed.success) return;
    // Future: POST /api/generate with parsed.data
    void parsed.data;
  }

  const inputClass =
    "w-full min-h-0 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="vibe" className="text-sm font-medium text-foreground">
          Your vibe
        </label>
        <p className="text-sm text-muted-foreground">
          Try something like:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>&ldquo;rainy sunday, no plans&rdquo;</li>
          <li>&ldquo;just got promoted, feeling nostalgic&rdquo;</li>
          <li>&ldquo;chaotic energy, celebrating with friends&rdquo;</li>
        </ul>
        <textarea
          id="vibe"
          name="vibe"
          value={vibe}
          onChange={(e) => setVibe(e.target.value.slice(0, VIBE_MAX))}
          placeholder='e.g. "rainy sunday, no plans" — or anything that captures your mood'
          rows={4}
          maxLength={VIBE_MAX}
          className={`${inputClass} resize-y`}
          aria-describedby="vibe-counter"
        />
        <p
          id="vibe-counter"
          className="text-right text-xs text-muted-foreground tabular-nums"
        >
          {vibe.length}/{VIBE_MAX}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="ingredients"
          className="text-sm font-medium text-foreground"
        >
          Ingredients you have{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={ingredientsRaw}
          onChange={(e) => setIngredientsRaw(e.target.value)}
          placeholder="e.g. gin, lime, simple syrup — commas or new lines are fine"
          rows={3}
          className={`${inputClass} resize-y`}
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!canSubmit}>
        Mix my cocktail
      </Button>
    </form>
  );
}
