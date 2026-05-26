import type { FlavorTag } from "@/lib/schemas/recipe";

const SLIDER_LABELS: { key: string; tags: FlavorTag[] }[] = [
  { key: "Sweet", tags: ["sweet", "fruity", "floral"] },
  { key: "Bitter", tags: ["bitter", "citrusy", "herbal"] },
  { key: "Strong", tags: ["bold", "complex", "smoky", "warming", "spicy"] },
  { key: "Creamy", tags: ["smooth", "light", "sparkling"] },
];

function level(tags: FlavorTag[], profile: FlavorTag[]): number {
  const hits = tags.filter((t) => profile.includes(t)).length;
  if (!profile.length) return 50;
  return Math.min(92, Math.max(18, 28 + hits * 24));
}

export function FlavorProfile({ profile }: { profile: FlavorTag[] }) {
  return (
    <div className="space-y-3.5">
      {SLIDER_LABELS.map(({ key, tags }) => (
        <div key={key} className="grid grid-cols-[4.5rem_1fr] items-center gap-4">
          <span className="text-sm text-muted-warm">{key}</span>
          <div className="h-1.5 w-full rounded-full bg-border/60">
            <div
              className="h-full rounded-full bg-charcoal/70 transition-all duration-700"
              style={{ width: `${level(tags, profile)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
