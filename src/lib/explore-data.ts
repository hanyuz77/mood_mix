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
  { id: "cozy",        label: "Cozy",        surface: "bg-[#d4e3d0]" },
  { id: "lovestruck",  label: "Lovestruck",  surface: "bg-[#e8d4cf]" },
  { id: "melancholic", label: "Melancholic", surface: "bg-[#ddd6eb]" },
  { id: "energetic",   label: "Energetic",   surface: "bg-[#ebe4d4]" },
  { id: "feral",       label: "Feral",       surface: "bg-[#ddd8ce]" },
  { id: "fierce",      label: "Fierce",      surface: "bg-[#e5ddd2]" },
];

export const RECENT_CREATIONS: ExploreCocktail[] = [
  {
    id: "1",
    name: "Velvet Dusk",
    mood: "cozy",
    tags: ["smooth", "warming", "aromatic"],
    image:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80",
    favorited: true,
  },
  {
    id: "2",
    name: "Memory Lane",
    mood: "melancholic",
    tags: ["sweet", "complex", "warming"],
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
  },
  {
    id: "3",
    name: "Garden Hour",
    mood: "lovestruck",
    tags: ["floral", "light", "citrusy"],
    image:
      "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=400&q=80",
    favorited: true,
  },
  {
    id: "4",
    name: "Midnight Orchard",
    mood: "feral",
    tags: ["fruity", "bold", "sparkling"],
    image:
      "https://images.unsplash.com/photo-1527761939622-933d68f3dc1c?w=400&q=80",
  },
];
