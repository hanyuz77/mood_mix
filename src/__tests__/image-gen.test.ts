import { describe, it, expect } from "vitest";
import { buildImagePrompt, imageGenerationAvailable } from "@/lib/image-gen";
import type { CocktailRecipe } from "@/lib/schemas/recipe";

const BASE_RECIPE: CocktailRecipe = {
  name: "Garden Hour",
  tagline: "Light and floral",
  flavorProfile: ["floral", "light", "citrusy"],
  ingredients: [
    { item: "gin", amount: "2 oz" },
    { item: "elderflower liqueur", amount: "0.5 oz" },
  ],
  steps: ["Build over ice"],
  prepTime: "3 min",
  moodExplanation: "For sunny afternoons.",
};

describe("buildImagePrompt", () => {
  it("includes the glass style when provided", () => {
    const recipe = { ...BASE_RECIPE, glassStyle: "coupe glass" };
    const prompt = buildImagePrompt(recipe);
    expect(prompt).toContain("coupe glass");
  });

  it("includes the garnish when provided", () => {
    const recipe = { ...BASE_RECIPE, garnish: "lemon twist" };
    const prompt = buildImagePrompt(recipe);
    expect(prompt).toContain("lemon twist");
  });

  it("detects elderflower and sets pale green color", () => {
    const prompt = buildImagePrompt(BASE_RECIPE);
    expect(prompt.toLowerCase()).toContain("pale clear with a light green hue");
  });

  it("detects espresso and sets dark color", () => {
    const recipe: CocktailRecipe = {
      ...BASE_RECIPE,
      ingredients: [
        { item: "espresso", amount: "1 oz" },
        { item: "vodka", amount: "2 oz" },
        { item: "coffee liqueur", amount: "0.5 oz" },
      ],
    };
    const prompt = buildImagePrompt(recipe);
    expect(prompt.toLowerCase()).toContain("dark brown");
  });

  it("falls back to liquidColor from recipe when no ingredient match", () => {
    const recipe: CocktailRecipe = {
      ...BASE_RECIPE,
      ingredients: [{ item: "mystery spirit", amount: "2 oz" }],
      liquidColor: "deep violet",
    };
    const prompt = buildImagePrompt(recipe);
    expect(prompt.toUpperCase()).toContain("DEEP VIOLET");
  });
});

describe("imageGenerationAvailable", () => {
  it("returns true when using pollinations (default)", () => {
    expect(imageGenerationAvailable()).toBe(true);
  });
});
