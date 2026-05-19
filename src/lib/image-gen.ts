import type { CocktailRecipe } from "@/lib/schemas/recipe";

const STYLE_PREFIX =
  "Elegant watercolor cocktail illustration, hand-painted bar menu spot art. " +
  "Single cocktail centered on warm off-white cream background, soft shadow beneath the glass. " +
  "Delicate ink outlines, visible soft brushstrokes, translucent watercolor washes, painterly not photorealistic. " +
  "Editorial lifestyle magazine aesthetic, minimalist composition, generous negative space around the drink. " +
  "No text, no lettering, no logos, no hands, no watermark, no border frame.";

const POLLINATIONS_MODEL = "flux";
const POLLINATIONS_WIDTH = 768;
const POLLINATIONS_HEIGHT = 768;

function imageProvider(): string {
  return (process.env.IMAGE_PROVIDER ?? "pollinations").trim().toLowerCase();
}

function openAiKey(): string | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key?.startsWith("sk-") ? key : null;
}

export function imageGenerationAvailable(): boolean {
  const provider = imageProvider();
  if (provider === "pollinations") return true;
  if (provider === "openai") return openAiKey() !== null;
  return true;
}

function liquidColor(recipe: CocktailRecipe): string {
  if (recipe.liquidColor?.trim()) return recipe.liquidColor.trim();
  if (recipe.visualBrief?.trim()) return recipe.visualBrief.trim();
  return "color true to the listed ingredients, not generic orange";
}

export function buildImagePrompt(recipe: CocktailRecipe): string {
  const color = liquidColor(recipe);
  const glass = recipe.glassStyle?.trim() || "appropriate cocktail glass";
  const garnish = recipe.garnish?.trim() || "minimal garnish";
  return (
    `${STYLE_PREFIX} ` +
    `Liquid color MUST be ${color}. ` +
    `Do not make the drink orange unless the recipe is orange-based. ` +
    `Glass: ${glass}. Garnish: ${garnish}.`
  );
}

async function generatePollinations(prompt: string): Promise<Buffer> {
  const trimmed = prompt.length > 900 ? prompt.slice(0, 900) : prompt;
  const encoded = encodeURIComponent(trimmed);
  // Random seed on every request — Pollinations otherwise returns a cached image for the same prompt.
  const seed = Math.floor(Math.random() * 2_147_483_647);
  const url =
    `https://image.pollinations.ai/prompt/${encoded}` +
    `?width=${POLLINATIONS_WIDTH}&height=${POLLINATIONS_HEIGHT}` +
    `&model=${POLLINATIONS_MODEL}&enhance=false&nologo=true&seed=${seed}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "mood-mix/1.0" },
    cache: "no-store",
    signal: AbortSignal.timeout(180_000),
  });

  if (!res.ok) {
    throw new Error(`Image service failed (${res.status}). Try again.`);
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length < 1000) {
    throw new Error("Image service returned an empty response. Try again.");
  }
  return bytes;
}

async function generateOpenAI(prompt: string): Promise<Buffer> {
  const apiKey = openAiKey();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Use IMAGE_PROVIDER=pollinations (free) or add a key.",
    );
  }

  const genRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!genRes.ok) {
    throw new Error(
      "OpenAI rejected the image request. Check OPENAI_API_KEY in .env.local.",
    );
  }

  const json = (await genRes.json()) as {
    data?: Array<{ url?: string }>;
  };
  const imageUrl = json.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("DALL-E returned no image URL.");
  }

  const res = await fetch(imageUrl, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) {
    throw new Error("Could not download the generated image.");
  }
  return Buffer.from(await res.arrayBuffer());
}

export async function generateRecipeImage(recipe: CocktailRecipe): Promise<Buffer> {
  const prompt = buildImagePrompt(recipe);
  const provider = imageProvider();

  if (provider === "openai") {
    return generateOpenAI(prompt);
  }
  if (provider === "pollinations") {
    return generatePollinations(prompt);
  }

  throw new Error(
    `Unknown IMAGE_PROVIDER=${provider}. Use "pollinations" or "openai".`,
  );
}
