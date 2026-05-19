export type RecipeIngredient = {
  item: string;
  amount: string;
};

export type FlavorTag =
  | "light"
  | "herbal"
  | "citrusy"
  | "sparkling"
  | "smooth"
  | "sweet"
  | "aromatic"
  | "smoky"
  | "complex"
  | "bold"
  | "warming"
  | "floral"
  | "bitter"
  | "fruity"
  | "spicy"
  | "earthy";

export type CocktailRecipe = {
  name: string;
  tagline: string;
  flavorProfile: FlavorTag[];
  ingredients: RecipeIngredient[];
  steps: string[];
  prepTime: string;
  moodExplanation: string;
};

export type GenerateRequest = {
  /** Free-text vibe the drink should match; keep concise (max ~200 chars). */
  vibe: string;
  ingredients?: string[];
};

export type ApiResponse =
  | { success: true; data: CocktailRecipe }
  | { success: false; error: string };
