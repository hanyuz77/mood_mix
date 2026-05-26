"use client";

import { useCallback, useEffect, useState } from "react";
import type { CocktailRecipe } from "@/lib/schemas/recipe";

export type SavedRecipe = {
  id: string;
  savedAt: number;
  recipe: CocktailRecipe;
  vibe: string;
  imageSrc: string | null;
};

const STORAGE_KEY = "mood-mix-favorites";

function load(): SavedRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedRecipe[]) : [];
  } catch {
    return [];
  }
}

function save(items: SavedRecipe[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    setFavorites(load());
  }, []);

  const addFavorite = useCallback((recipe: CocktailRecipe, vibe: string, imageSrc: string | null = null): string => {
    const entry: SavedRecipe = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: Date.now(),
      recipe,
      vibe,
      imageSrc,
    };
    setFavorites((prev) => {
      const next = [entry, ...prev];
      save(next);
      return next;
    });
    return entry.id;
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      save(next);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (recipeName: string) => favorites.some((f) => f.recipe.name === recipeName),
    [favorites],
  );

  return { favorites, addFavorite, removeFavorite, isSaved };
}
