import type { CocktailRecipe } from "@/lib/schemas/recipe";

const STYLE_PREFIX =
  "Professional cocktail photography, shot on a full-frame DSLR, 85mm lens, shallow depth of field. " +
  "The drink fills the entire frame — glass crops slightly at edges, no empty space around it. " +
  "Soft diffused natural light, subtle condensation on the glass. " +
  "Background: warm beige, soft linen, creamy off-white, or pale sand — NOT gray, NOT white, NOT amber, NOT orange. " +
  "Background should feel like warm parchment or aged linen; only the drink itself carries strong color. " +
  "Photorealistic, high-resolution, editorial Kinfolk / Wallpaper* magazine aesthetic. " +
  "No text, no lettering, no logos, no hands, no watermark, no border frame.";

const POLLINATIONS_MODEL = "flux";
const POLLINATIONS_WIDTH = 1024;
const POLLINATIONS_HEIGHT = 1365;

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

function deriveColor(recipe: CocktailRecipe): string {
  const items = recipe.ingredients.map((i) => i.item.toLowerCase()).join(" ");

  if (items.includes("blue curacao") || items.includes("butterfly pea"))
    return "deep electric blue";
  if (items.includes("matcha")) return "opaque green";
  if (items.includes("espresso") || (items.includes("coffee") && items.includes("liqueur")))
    return "near-black dark brown with a thick ivory foam head";
  if (items.includes("blackberry") || items.includes("cassis") || items.includes("blueberry"))
    return "deep purple";
  if (items.includes("grenadine") || items.includes("campari") || items.includes("cranberry"))
    return "deep red to ruby";
  if (items.includes("raspberry") || items.includes("strawberry") || items.includes("watermelon"))
    return "bright pink";
  if (items.includes("elderflower") || items.includes("cucumber") || items.includes("green tea"))
    return "pale clear with a light green hue";
  if (items.includes("lavender")) return "soft pale purple";
  if (items.includes("mango") || items.includes("passion fruit") || items.includes("peach"))
    return "golden yellow";
  if (items.includes("champagne") || items.includes("prosecco"))
    return "pale gold with fine rising bubbles";
  if (items.includes("gin") || items.includes("vodka"))
    return "crystal clear or very pale";
  if (items.includes("bourbon") || items.includes("whiskey") || items.includes("rum"))
    return "amber — but only the liquid, not the background";

  // fallback to AI-provided then to generic
  if (recipe.liquidColor?.trim()) return recipe.liquidColor.trim();
  return "pale clear";
}

export function buildImagePrompt(recipe: CocktailRecipe): string {
  const color = deriveColor(recipe);
  const glass = recipe.glassStyle?.trim() || "appropriate cocktail glass";
  const garnish = recipe.garnish?.trim() || "minimal garnish";
  return (
    `${STYLE_PREFIX} ` +
    `Close-up: a ${glass} fills the entire frame. ` +
    `THE LIQUID COLOR IS ${color.toUpperCase()} — this is the most important detail, do not change it. ` +
    `Do NOT default to amber, orange, or brown unless explicitly stated above. ` +
    `Garnish: ${garnish}.`
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
