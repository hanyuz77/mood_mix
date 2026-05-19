import { z } from "zod";

export const recipeIngredientSchema = z.object({
  item: z.string(),
  amount: z.string(),
});

export const vibeSchema = z
  .string()
  .trim()
  .min(1, "Describe your vibe")
  .max(200, "Keep it under 200 characters");

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
  liquidColor: z.string().optional(),
  visualBrief: z.string().optional(),
  garnish: z.string().optional(),
  glassStyle: z.string().optional(),
});

export const generateRequestSchema = z.object({
  vibe: vibeSchema,
  ingredients: z.array(z.string()).optional(),
});

export type FlavorTag = z.infer<typeof flavorTagSchema>;
export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
export type CocktailRecipe = z.infer<typeof cocktailRecipeSchema>;

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
