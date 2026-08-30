import json
import os
from typing import Any

from anthropic import Anthropic, AuthenticationError
from dotenv import load_dotenv

from schemas import CocktailRecipe, GenerateRequest

# .env.local wins over a stale shell ANTHROPIC_API_KEY (common with Streamlit)
load_dotenv()
load_dotenv(".env.local", override=True)

SYSTEM_PROMPT = """You are a creative mixologist who designs cocktails to match emotional vibes.
Return ONLY valid JSON matching this shape (no markdown, no commentary):
{
  "name": string,
  "tagline": string,
  "flavorProfile": array of tags from: light, herbal, citrusy, sparkling, smooth, sweet, aromatic, smoky, complex, bold, warming, floral, bitter, fruity, spicy, earthy,
  "ingredients": [{"item": string, "amount": string}, ...],
  "steps": [string, ...],
  "prepTime": string (e.g. "5 min"),
  "moodExplanation": string (1-2 sentences tying the drink to the vibe),
  "liquidColor": string (REQUIRED — exact drink color from ingredients, e.g. "pale straw yellow", "deep ruby red", "clear silver", "lavender grey", "coffee brown". Must NOT default to orange unless the recipe uses orange ingredients),
  "visualBrief": string (one sentence: foam/ice, garnish on rim, glass type, lighting — do NOT repeat liquidColor here),
  "garnish": string (short, e.g. "dehydrated orange wheel"),
  "glassStyle": string (short, e.g. "nick and nora coupe")
}
Prefer realistic home-bar ingredients. Match liquidColor to spirits and mixers (gin+lemon=yellow, whiskey=amber, campari=red, crème de violette=purple, coffee=tan, etc.). If the user lists ingredients on hand, use those when possible."""


def _api_key() -> str:
    key = (os.getenv("ANTHROPIC_API_KEY") or "").strip()
    if not key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. Add it to .env.local in the project root."
        )
    if not key.startswith("sk-ant-"):
        raise RuntimeError(
            "ANTHROPIC_API_KEY does not look valid. Copy a fresh key from "
            "https://console.anthropic.com/settings/keys into .env.local"
        )
    return key


def _client() -> Anthropic:
    return Anthropic(api_key=_api_key())


def _build_user_message(req: GenerateRequest) -> str:
    parts = [f"Vibe: {req.vibe}"]
    if req.ingredients:
        parts.append("Ingredients on hand: " + ", ".join(req.ingredients))
    return "\n".join(parts)


def generate_cocktail(req: GenerateRequest) -> CocktailRecipe:
    client = _client()
    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_user_message(req)}],
        )
    except AuthenticationError:
        raise RuntimeError(
            "Anthropic rejected the API key (401). Update ANTHROPIC_API_KEY in "
            ".env.local, then restart Streamlit (`Ctrl+C`, then `streamlit run app.py`). "
            "If you recently fixed the key, a stale value in your shell may have been "
            "used—restart fixes that too."
        ) from None

    text_blocks = [b.text for b in message.content if b.type == "text"]
    raw = "".join(text_blocks).strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1]
        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0]
        raw = raw.strip()

    data: dict[str, Any] = json.loads(raw)
    return CocktailRecipe.model_validate(data)
