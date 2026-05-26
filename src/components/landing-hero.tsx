import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { PremiumButton } from "@/components/premium-button";

const HERO_IMAGE = "/hero.png";

export function LandingHero() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[calc(100vh-0px)] flex-1 items-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt="Espresso martini in soft light"
            fill
            className="object-cover"
            style={{ transform: "scale(1.2) translateX(6%)", transformOrigin: "center center" }}
            sizes="100vw"
            priority
          />
        </div>
<div className="relative z-10 flex flex-col justify-center px-6 py-10 lg:px-14 lg:py-16 xl:px-20">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-warm">
            Drinks made for how you feel
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
          </div>
        </div>
      </section>
    </div>
  );
}
