from typing import Literal

from pydantic import BaseModel, Field, field_validator

VIBE_MAX = 200

FlavorTag = Literal[
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
]


class RecipeIngredient(BaseModel):
    item: str
    amount: str


class CocktailRecipe(BaseModel):
    name: str
    tagline: str
    flavorProfile: list[FlavorTag]
    ingredients: list[RecipeIngredient]
    steps: list[str]
    prepTime: str
    moodExplanation: str
    liquidColor: str = ""
    visualBrief: str = ""
    garnish: str = ""
    glassStyle: str = ""


class GenerateRequest(BaseModel):
    vibe: str = Field(min_length=1, max_length=VIBE_MAX)
    ingredients: list[str] | None = None

    @field_validator("vibe")
    @classmethod
    def strip_vibe(cls, v: str) -> str:
        return v.strip()
