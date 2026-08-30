import { createAnthropicClient } from "@/lib/anthropic";
import {
  cocktailRecipeSchema,
  type GenerateRequestInput,
} from "@/lib/schemas/recipe";

const SYSTEM_PROMPT = `You are a creative mixologist who designs cocktails to match emotional vibes.
Return ONLY valid JSON matching this shape (no markdown, no commentary):
{
  "name": string,
  "tagline": string,
  "flavorProfile": array of tags from: light, herbal, citrusy, sparkling, smooth, sweet, aromatic, smoky, complex, bold, warming, floral, bitter, fruity, spicy, earthy,
  "ingredients": [{"item": string, "amount": string}, ...],
  "steps": [string, ...],
  "prepTime": string (e.g. "5 min"),
  "moodExplanation": string (1-2 sentences tying the drink to the vibe — poetic, editorial, warm),
  "liquidColor": string (exact drink color from ingredients; do NOT default to orange unless appropriate),
  "visualBrief": string (one sentence: foam/ice, garnish, glass, lighting),
  "garnish": string (short),
  "glassStyle": string (short),
  "tip": string (one bartender tip, 1 sentence),
  "snackPairings": [{"name": string, "description": string}, ...] (3 food pairings that complement the drink)
}
Prefer realistic home-bar ingredients. Match liquidColor to spirits and mixers. If the user lists ingredients on hand, use those when possible.`;

function buildUserMessage(input: GenerateRequestInput): string {
  const parts = [`Vibe: ${input.vibe}`];
  if (input.ingredients?.length) {
    parts.push(`Ingredients on hand: ${input.ingredients.join(", ")}`);
  }
  return parts.join("\n");
}

export async function generateCocktail(input: GenerateRequestInput) {
  const client = createAnthropicClient();

  let message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(input) }],
    });
  } catch (err: unknown) {
    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 0;
    if (status === 401) {
      throw new Error(
        "Anthropic rejected the API key. Check ANTHROPIC_API_KEY in .env.local.",
      );
    }
    throw err;
  }

  const textBlocks = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text);
  let raw = textBlocks.join("").trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/```\s*$/, "").trim();
  }

  const parsed = JSON.parse(raw) as unknown;
  return cocktailRecipeSchema.parse(parsed);
}
