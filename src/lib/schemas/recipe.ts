import { z } from "zod";

export const recipeIngredientSchema = z.object({
  item: z.string(),
  amount: z.string(),
});

export const vibeSchema = z
  .string()
  .trim()
  .min(1, "Describe your vibe")
  .max(500);

export const flavorTagSchema = z.enum([
  "light",
  "herbal",
  "citrusy",
  "sparkling",
  "smooth",
  "sweet",
  "aromatic",
  "smoky",
  "complex",
  "bold",
  "warming",
  "floral",
  "bitter",
  "fruity",
  "spicy",
  "earthy",
]);

export const cocktailRecipeSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  flavorProfile: z.array(flavorTagSchema),
  ingredients: z.array(recipeIngredientSchema),
  steps: z.array(z.string()),
  prepTime: z.string(),
  moodExplanation: z.string(),
});

export const generateRequestSchema = z.object({
  vibe: vibeSchema,
  ingredients: z.array(z.string()).optional(),
});

export const apiResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: cocktailRecipeSchema,
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);
