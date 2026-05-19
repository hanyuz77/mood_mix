import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import { PremiumButton } from "@/components/premium-button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=85";

export function LandingHero() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative grid min-h-[calc(100vh-0px)] flex-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:px-14 lg:py-16 xl:px-20">
        <div className="flex max-w-xl flex-col justify-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-warm">
            Emotionally intelligent mixology
          </p>
          <h1 className="font-serif text-5xl font-medium leading-[1.08] tracking-tight text-charcoal sm:text-6xl lg:text-[4.25rem]">
            Cocktails for how you feel.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-warm">
            AI-crafted drinks tailored to your mood and moment — like a quiet
            bar that already knows your night.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <PremiumButton href="/create" className="gap-2 pr-7">
              Get Started
              <ArrowRight className="size-4" />
            </PremiumButton>
            <a
              href="/explore"
              className="text-sm font-medium text-espresso underline-offset-4 transition-colors hover:text-olive hover:underline"
            >
              Browse creations
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full max-w-lg justify-self-center lg:max-w-none lg:justify-self-end">
          <div className="shadow-card absolute -inset-3 rounded-[2rem] bg-stone/40" />
          <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-stone">
            <Image
              src={HERO_IMAGE}
              alt="Espresso martini in soft light"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-ivory/5" />
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-[#faf8f4]/80 px-6 py-8 lg:px-14">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Personalized to your vibe",
              text: "Mood, moment, and memory shape every pour.",
            },
            {
              icon: Sparkles,
              title: "Smart AI recipe crafting",
              text: "Recipes that read like a sommelier's note, not a spreadsheet.",
            },
            {
              icon: Sparkles,
              title: "Ingredients you actually have",
              text: "Build from your cabinet, or dream without limits.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon
                className="mt-0.5 size-4 shrink-0 text-olive"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-sm font-medium text-charcoal">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-warm">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
