import { describe, it, expect } from "vitest";
import { cocktailRecipeSchema } from "@/lib/schemas/recipe";

const VALID_RECIPE = {
  name: "Velvet Dusk",
  tagline: "A smooth evening pour",
  flavorProfile: ["smooth", "warming", "aromatic"],
  ingredients: [
    { item: "Bourbon", amount: "2 oz" },
    { item: "Honey syrup", amount: "0.5 oz" },
  ],
  steps: ["Combine all ingredients", "Stir with ice for 30 seconds", "Strain into glass"],
  prepTime: "5 min",
  moodExplanation: "Like a warm blanket on a cold night.",
};

describe("cocktailRecipeSchema", () => {
  it("accepts a valid recipe", () => {
    const result = cocktailRecipeSchema.safeParse(VALID_RECIPE);
    expect(result.success).toBe(true);
  });

  it("accepts optional fields when omitted", () => {
    const result = cocktailRecipeSchema.safeParse(VALID_RECIPE);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.garnish).toBeUndefined();
      expect(result.data.tip).toBeUndefined();
    }
  });

  it("rejects an unknown flavor tag", () => {
    const bad = { ...VALID_RECIPE, flavorProfile: ["unknown-tag"] };
    const result = cocktailRecipeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const withoutName = { ...VALID_RECIPE };
    delete (withoutName as { name?: string }).name;
    const result = cocktailRecipeSchema.safeParse(withoutName);
    expect(result.success).toBe(false);
  });

  it("accepts all known flavor tags", () => {
    const allTags = [
      "light", "herbal", "citrusy", "sparkling", "smooth", "sweet",
      "aromatic", "smoky", "complex", "bold", "warming", "floral",
      "bitter", "fruity", "spicy", "earthy",
    ];
    const result = cocktailRecipeSchema.safeParse({ ...VALID_RECIPE, flavorProfile: allTags });
    expect(result.success).toBe(true);
  });
});
