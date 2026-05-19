import { NextResponse } from "next/server";

import { generateRecipeImage } from "@/lib/image-gen";
import { cocktailRecipeSchema } from "@/lib/schemas/recipe";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const rawRecipe =
      body && typeof body === "object" && "recipe" in body
        ? (body as { recipe: unknown }).recipe
        : undefined;
    const parsed = cocktailRecipeSchema.safeParse(rawRecipe);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid recipe payload." },
        { status: 400 },
      );
    }

    const bytes = await generateRecipeImage(parsed.data);
    const base64 = bytes.toString("base64");
    const mime = bytes[0] === 0x89 && bytes[1] === 0x50 ? "image/png" : "image/jpeg";

    return NextResponse.json({
      success: true,
      image: `data:${mime};base64,${base64}`,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not generate the cocktail photo.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
