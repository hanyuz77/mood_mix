import type { MoodId } from "@/lib/moods";

export type ExploreCocktail = {
  id: string;
  name: string;
  mood: MoodId;
  tags: string[];
  image: string;
  favorited?: boolean;
};

export const FEATURED_MOODS: { id: MoodId; label: string; surface: string }[] = [
  { id: "relaxed", label: "Relaxed", surface: "bg-[#d4e3d0]" },
  { id: "romantic", label: "Romantic", surface: "bg-[#e8d4cf]" },
  { id: "reflective", label: "Reflective", surface: "bg-[#ddd6eb]" },
  { id: "excited", label: "Excited", surface: "bg-[#ebe4d4]" },
  { id: "adventurous", label: "Adventurous", surface: "bg-[#ddd8ce]" },
  { id: "confident", label: "Confident", surface: "bg-[#e5ddd2]" },
];

export const RECENT_CREATIONS: ExploreCocktail[] = [
  {
    id: "1",
    name: "Velvet Dusk",
    mood: "relaxed",
    tags: ["smooth", "warming", "aromatic"],
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1e?w=400&q=80",
    favorited: true,
  },
  {
    id: "2",
    name: "Memory Lane",
    mood: "reflective",
    tags: ["sweet", "complex", "warming"],
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
  },
  {
    id: "3",
    name: "Garden Hour",
    mood: "romantic",
    tags: ["floral", "light", "citrusy"],
    image:
      "https://images.unsplash.com/photo-1546171753-97d7676a8d7b?w=400&q=80",
    favorited: true,
  },
  {
    id: "4",
    name: "Midnight Orchard",
    mood: "adventurous",
    tags: ["fruity", "bold", "sparkling"],
    image:
      "https://images.unsplash.com/photo-1551538827-9b05f5a1c0ef?w=400&q=80",
  },
];
