export type RecipeIngredient = {
  item: string;
  amount: string;
};

export type Emotion = "calm" | "excited" | "romantic" | "reflective";

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
  | "floral";

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
  emotion: Emotion;
  ingredients?: string[];
};

export type ApiResponse =
  | { success: true; data: CocktailRecipe }
  | { success: false; error: string };
