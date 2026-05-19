import os
import random
import ssl
from urllib.parse import quote
from urllib.request import Request, urlopen

import certifi
from dotenv import load_dotenv

from schemas import CocktailRecipe

load_dotenv()
load_dotenv(".env.local", override=True)

STYLE_PREFIX = (
    "Elegant watercolor cocktail illustration, hand-painted bar menu spot art. "
    "Single cocktail centered on warm off-white cream background, soft shadow beneath the glass. "
    "Delicate ink outlines, visible soft brushstrokes, translucent watercolor washes, painterly not photorealistic. "
    "Editorial lifestyle magazine aesthetic, minimalist composition, generous negative space around the drink. "
    "No text, no lettering, no logos, no hands, no watermark, no border frame."
)

POLLINATIONS_MODEL = "flux"
POLLINATIONS_WIDTH = 768
POLLINATIONS_HEIGHT = 768


def _image_provider() -> str:
    return (os.getenv("IMAGE_PROVIDER") or "pollinations").strip().lower()


def _openai_key() -> str | None:
    key = (os.getenv("OPENAI_API_KEY") or "").strip()
    return key if key.startswith("sk-") else None


def image_generation_available() -> bool:
    provider = _image_provider()
    if provider == "pollinations":
        return True
    if provider == "openai":
        return _openai_key() is not None
    return True


def _liquid_color(recipe: CocktailRecipe) -> str:
    if recipe.liquidColor.strip():
        return recipe.liquidColor.strip()
    if recipe.visualBrief.strip():
        return recipe.visualBrief.strip()
    return "color true to the listed ingredients, not generic orange"


def build_image_prompt(recipe: CocktailRecipe) -> str:
    color = _liquid_color(recipe)
    glass = recipe.glassStyle or "appropriate cocktail glass"
    garnish = recipe.garnish or "minimal garnish"
    return (
        f"{STYLE_PREFIX} "
        f"Liquid color MUST be {color}. "
        f"Do not make the drink orange unless the recipe is orange-based. "
        f"Glass: {glass}. Garnish: {garnish}."
    )


def _fetch_url(url: str, timeout: int = 180) -> bytes:
    ctx = ssl.create_default_context(cafile=certifi.where())
    req = Request(url, headers={"User-Agent": "emotional-cocktail/1.0"})
    with urlopen(req, timeout=timeout, context=ctx) as resp:
        return resp.read()


def _generate_pollinations(prompt: str) -> bytes:
    if len(prompt) > 900:
        prompt = prompt[:900]
    encoded = quote(prompt)
    seed = random.randint(0, 2_147_483_646)
    url = (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width={POLLINATIONS_WIDTH}&height={POLLINATIONS_HEIGHT}"
        f"&model={POLLINATIONS_MODEL}&enhance=false&nologo=true&seed={seed}"
    )
    data = _fetch_url(url, timeout=180)
    if len(data) < 1000:
        raise RuntimeError("Image service returned an empty response. Try again.")
    return data


def _generate_openai(prompt: str) -> bytes:
    from openai import OpenAI, AuthenticationError as OpenAIAuthError

    api_key = _openai_key()
    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Use IMAGE_PROVIDER=pollinations (free) "
            "or add a key from https://platform.openai.com/api-keys"
        )

    client = OpenAI(api_key=api_key)
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="hd",
            n=1,
        )
    except OpenAIAuthError:
        raise RuntimeError(
            "OpenAI rejected the API key (401). Update OPENAI_API_KEY in .env.local."
        ) from None

    url = response.data[0].url
    if not url:
        raise RuntimeError("DALL-E returned no image URL.")

    return _fetch_url(url, timeout=120)


def generate_recipe_image(recipe: CocktailRecipe) -> bytes:
    prompt = build_image_prompt(recipe)
    provider = _image_provider()

    if provider == "openai":
        return _generate_openai(prompt)
    if provider == "pollinations":
        return _generate_pollinations(prompt)

    raise RuntimeError(
        f"Unknown IMAGE_PROVIDER={provider!r}. Use 'pollinations' or 'openai'."
    )
