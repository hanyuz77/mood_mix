import { VibeForm } from "@/components/vibe-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Emotional cocktail
          </h1>
          <p className="text-pretty text-muted-foreground">
            Describe your vibe. We&apos;ll match it to a drink—optionally using
            what you already have on hand.
          </p>
        </header>
        <VibeForm />
      </div>
    </div>
  );
}
