export type MoodId =
  | "cozy"
  | "flirty"
  | "energetic"
  | "feral"
  | "chaotic"
  | "lovestruck"
  | "sultry"
  | "melancholic"
  | "bittersweet"
  | "heartbroken"
  | "nostalgic"
  | "fierce"
  | "unhinged";

export type MoodOption = {
  id: MoodId;
  label: string;
  emoji: string;
};

export const MOODS: MoodOption[] = [
  { id: "cozy",        label: "Cozy",        emoji: "🕯️" },
  { id: "flirty",      label: "Flirty",      emoji: "😘" },
  { id: "energetic",   label: "Energetic",   emoji: "⚡" },
  { id: "feral",       label: "Feral",       emoji: "🐺" },
  { id: "chaotic",     label: "Chaotic",     emoji: "🌀" },
  { id: "lovestruck",  label: "Lovestruck",  emoji: "💘" },
  { id: "sultry",      label: "Sultry",      emoji: "🔥" },
  { id: "melancholic", label: "Melancholic", emoji: "🌧️" },
  { id: "bittersweet", label: "Bittersweet", emoji: "🍂" },
  { id: "heartbroken", label: "Heartbroken", emoji: "💔" },
  { id: "nostalgic",   label: "Nostalgic",   emoji: "📻" },
  { id: "fierce",      label: "Fierce",      emoji: "🦁" },
  { id: "unhinged",    label: "Unhinged",    emoji: "🫠" },
];

export const SUGGESTED_INGREDIENTS = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Whiskey",
  "Prosecco",
  "Lemon",
  "Lime",
  "Orange juice",
  "Ginger beer",
  "Mint",
  "Honey",
  "Soda water",
  "Espresso",
  "Coconut milk",
  "Bitters",
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
