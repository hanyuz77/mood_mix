"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RecipeDetail } from "@/components/recipe-detail";
import { useFavorites } from "@/lib/favorites";
import type { SavedRecipe } from "@/lib/favorites";

export default function FavoriteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const { favorites, isSaved, addFavorite } = useFavorites();
  const [saved, setSaved] = useState<SavedRecipe | null | undefined>(undefined);

  useEffect(() => {
    if (favorites.length === 0 && saved === undefined) return;
    const found = favorites.find((f) => f.id === id) ?? null;
    setSaved(found);
  }, [favorites, id, saved]);

  if (saved === undefined) return null;

  if (saved === null) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-warm">
        Recipe not found.
      </div>
    );
  }

  const alreadySaved = isSaved(saved.recipe.name);

  return (
    <RecipeDetail
      recipe={saved.recipe}
      imageSrc={saved.imageSrc}
      vibe={saved.vibe}
      saved={alreadySaved}
      onBack={() => router.push("/favorites")}
      onSave={() => addFavorite(saved.recipe, saved.vibe, saved.imageSrc)}
      onViewFavorites={() => router.push("/favorites")}
    />
  );
}
