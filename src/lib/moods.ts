import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Flame,
  Heart,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";

export type MoodId =
  | "relaxed"
  | "romantic"
  | "reflective"
  | "excited"
  | "adventurous"
  | "confident";

export type MoodOption = {
  id: MoodId;
  label: string;
  description: string;
  icon: LucideIcon;
  surface: string;
  border: string;
};

export const MOODS: MoodOption[] = [
  {
    id: "relaxed",
    label: "Relaxed",
    description: "Unhurried, soft, and grounding",
    icon: Moon,
    surface: "bg-[#d4e3d0] border-[#c5d4c0]",
    border: "border-[#b8c9b3]",
  },
  {
    id: "romantic",
    label: "Romantic",
    description: "Intimate, warm, and candlelit",
    icon: Heart,
    surface: "bg-[#e8d4cf] border-[#ddc4be]",
    border: "border-[#d4b8ae]",
  },
  {
    id: "reflective",
    label: "Reflective",
    description: "Quiet, thoughtful, inward",
    icon: Sparkles,
    surface: "bg-[#ddd6eb] border-[#d0c8e0]",
    border: "border-[#c4bad8]",
  },
  {
    id: "excited",
    label: "Excited",
    description: "Bright, social, effervescent",
    icon: Sun,
    surface: "bg-[#ebe4d4] border-[#e0d8c8]",
    border: "border-[#d4cbb8]",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    description: "Bold, curious, off-menu",
    icon: Compass,
    surface: "bg-[#ddd8ce] border-[#d0cbc0]",
    border: "border-[#c4bfb4]",
  },
  {
    id: "confident",
    label: "Confident",
    description: "Assured, polished, decisive",
    icon: Flame,
    surface: "bg-[#e5ddd2] border-[#dbd2c6]",
    border: "border-[#cfc4b6]",
  },
];

export const SUGGESTED_INGREDIENTS = [
  "Rum",
  "Vodka",
  "Gin",
  "Bourbon",
  "Tequila",
  "Campari",
  "Lime",
  "Lemon",
  "Simple syrup",
  "Honey",
  "Mint",
  "Ginger beer",
  "Orange bitters",
  "Egg white",
  "Coffee liqueur",
  "Champagne",
];

export function buildVibeFromMood(
  mood: MoodId | null,
  customFeeling: string,
): string {
  const moodLabel = MOODS.find((m) => m.id === mood)?.label;
  const custom = customFeeling.trim();
  if (moodLabel && custom) {
    return `${moodLabel} — ${custom}`;
  }
  if (custom) return custom;
  if (moodLabel) return `Feeling ${moodLabel.toLowerCase()}`;
  return "";
}
