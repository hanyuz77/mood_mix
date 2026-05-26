import { describe, it, expect } from "vitest";
import { buildVibeFromMood, MOODS } from "@/lib/moods";

describe("buildVibeFromMood", () => {
  it("returns mood label when only mood is selected", () => {
    const result = buildVibeFromMood("cozy", "");
    expect(result).toBe("Feeling cozy");
  });

  it("returns custom feeling alone when no mood is selected", () => {
    const result = buildVibeFromMood(null, "rainy afternoon with tea");
    expect(result).toBe("rainy afternoon with tea");
  });

  it("combines mood and custom feeling with em dash", () => {
    const result = buildVibeFromMood("melancholic", "missing someone");
    expect(result).toBe("Melancholic — missing someone");
  });

  it("returns empty string when neither mood nor feeling is provided", () => {
    const result = buildVibeFromMood(null, "");
    expect(result).toBe("");
  });

  it("trims whitespace from custom feeling", () => {
    const result = buildVibeFromMood(null, "  late night vibes  ");
    expect(result).toBe("late night vibes");
  });
});

describe("MOODS", () => {
  it("every mood has an id, label, and emoji", () => {
    for (const mood of MOODS) {
      expect(mood.id).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.emoji).toBeTruthy();
    }
  });
});
