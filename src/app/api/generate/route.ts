import { NextResponse } from "next/server";

import { generateCocktail } from "@/lib/generate";
import {
  apiResponseSchema,
  generateRequestSchema,
} from "@/lib/schemas/recipe";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = generateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiResponseSchema.parse({
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid request",
        }),
        { status: 400 },
      );
    }

    const data = await generateCocktail(parsed.data);
    return NextResponse.json(
      apiResponseSchema.parse({ success: true, data }),
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not craft your cocktail.";
    return NextResponse.json(
      apiResponseSchema.parse({ success: false, error: message }),
      { status: 500 },
    );
  }
}
