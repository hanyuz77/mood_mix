# ARCHITECTURE.md
**Project:** Emotion-Based Cocktail Generator  
**Proposer:** Janice Zhou | **Developer:** Chuhan Ji  
**Version:** 1.0 — Initial Architecture

---

## 1. Tech Stack & Justification

### Frontend — Next.js 14 (App Router)
The spec names Next.js explicitly, and it's a strong fit here. The App Router enables React Server Components for fast initial loads, and API Routes eliminate the need for a separate backend service. Server-side rendering means the emotion selection UI renders instantly without a loading flash, which matters for the "premium and engaging" feel the spec calls for.

### AI — Anthropic Claude API (claude-sonnet-4-20250514)
Claude is well-suited to this use case over OpenAI for two reasons: (1) it reliably follows structured output instructions and produces valid JSON without hallucinating extra fields, and (2) its instruction-following for constrained creative tasks (generate a *realistic, makeable* recipe) is strong. We'll use a system prompt that enforces a strict JSON schema, with a Zod validation layer on the server before the response reaches the client.

### Styling — Tailwind CSS + shadcn/ui
Tailwind gives us the design control needed for the visual emotion-card interface without the overhead of a custom design system. shadcn/ui provides accessible, unstyled primitives (cards, badges, loaders) we can fully skin to match the moody, atmospheric aesthetic this project calls for.

### Database — Supabase (optional, for stretch features)
Supabase is listed in the spec and is the right call for optional persistence. It's a hosted Postgres with a generous free tier and a JavaScript client that integrates seamlessly with Next.js. We'll architect the app so the database layer is completely optional — the core generate flow works without it — and can be dropped in when the "Save Favorites" stretch feature is tackled.

### Deployment — Vercel
Natural fit for Next.js. Zero-config deployments, edge functions for low-latency API routes, and environment variable management built in.

---

## 2. Data Model

### Runtime (In-Memory / Client State)

These types live in TypeScript and are never persisted unless Supabase is enabled.

```typescript
// The emotion the user has selected
type Emotion = "calm" | "excited" | "romantic" | "reflective";

// Optional user-supplied ingredients
type IngredientsInput = string[]; // e.g. ["gin", "lemon", "honey"]

// The structured output the AI returns
interface CocktailRecipe {
  name: string;                   // e.g. "Midnight Reverie"
  emotion: Emotion;
  flavorProfile: string[];        // e.g. ["herbal", "light", "low-alcohol"]
  ingredients: Ingredient[];
  steps: string[];                // Ordered preparation steps
  estimatedPrepMinutes: number;   // e.g. 5
  moodExplanation: string;        // "Why this matches your mood" copy
}

interface Ingredient {
  name: string;                   // e.g. "Elderflower liqueur"
  quantity: string;               // e.g. "1 oz"
  optional: boolean;
}
```

### Supabase Table — `recipes` (optional)

```sql
CREATE TABLE recipes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion      TEXT NOT NULL,
  ingredients_input  TEXT[],          -- raw user input tags
  generated_recipe   JSONB NOT NULL,  -- full CocktailRecipe object
  is_favorite        BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

The `generated_recipe` column stores the full `CocktailRecipe` JSON blob. This avoids a complex relational schema for a v1 and makes it trivial to display saved recipes without joins.

---

## 3. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                    │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  /  (Home)   │    │  /generate   │    │  /saved      │  │
│  │  Emotion     │───▶│  Result      │    │  Favorites   │  │
│  │  Selection   │    │  Display     │    │  (Stretch)   │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │  API Route      │                      │
│                    │  POST /api/     │                      │
│                    │  generate       │                      │
│                    └────────┬────────┘                      │
└─────────────────────────────┼───────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
     ┌────────▼──────┐  ┌────▼────────┐  ┌───▼──────────┐
     │  Claude API   │  │  Zod Schema │  │  Supabase    │
     │  (AI recipe   │  │  Validation │  │  (optional   │
     │   generation) │  │             │  │   save/fetch)│
     └───────────────┘  └─────────────┘  └──────────────┘
```

### Page Structure

| Route | Purpose |
|---|---|
| `/` | Emotion selection + optional ingredient input |
| `/generate` | Calls API, shows loading state, displays result |
| `/saved` | (Stretch) Lists saved favorite recipes |
| `/api/generate` | Server-side: calls Claude, validates, returns JSON |
| `/api/recipes` | (Stretch) Supabase CRUD for saved recipes |

---

## 4. AI Prompt Design

The prompt is the core engineering artifact of this project. It lives in a versioned file (`lib/prompts/cocktail.ts`) so it can be iterated without touching application logic.

### System Prompt Strategy

```
You are a creative mixologist AI. When given an emotion and optional 
ingredients, generate a single cocktail recipe that authentically 
matches the emotional state.

Emotion → Flavor Profile Mapping:
- calm/relaxed     → light, herbal, floral, low-alcohol (≤10% ABV)
- excited/party    → strong, citrus, sparkling, high-energy
- romantic         → smooth, sweet, aromatic, candlelit
- reflective/late  → smoky, complex, spirit-forward, contemplative

Rules:
1. Return ONLY valid JSON matching the schema below. No preamble, no markdown.
2. Ingredients must be real, commonly available items.
3. Steps must be specific and ordered (max 6 steps).
4. moodExplanation: 2–3 sentences connecting the drink to the emotion.
5. If user provides ingredients, incorporate at least one of them.

Schema: { name, emotion, flavorProfile[], ingredients[{name, quantity, optional}], 
          steps[], estimatedPrepMinutes, moodExplanation }
```

### Validation Layer (Zod)

```typescript
// All AI responses are validated before reaching the client
const RecipeSchema = z.object({
  name: z.string().min(1).max(60),
  emotion: z.enum(["calm", "excited", "romantic", "reflective"]),
  flavorProfile: z.array(z.string()).min(1).max(5),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    optional: z.boolean()
  })).min(2).max(10),
  steps: z.array(z.string()).min(2).max(6),
  estimatedPrepMinutes: z.number().int().min(1).max(30),
  moodExplanation: z.string().min(20).max(300)
});
```

If validation fails, the API route retries once with an amended prompt before returning a 500 error to the client.

---

## 5. Agentic Engineering Plan

The six GitHub issues from the spec map to the following implementation order. Each issue is a vertical slice that can be tested independently.

### Issue 1 — Project Setup & Structure
Set up Next.js 14 with App Router, Tailwind, shadcn/ui, and TypeScript. Create the folder structure, configure `.env.local` with `ANTHROPIC_API_KEY`, and add the Zod dependency. Establish the `CocktailRecipe` TypeScript interface as the shared contract between frontend and API.

**Done when:** `npm run dev` starts, all dependencies resolve, TypeScript compiles clean.

---

### Issue 2 — Emotion Selection UI
Build the home page (`/`) with four emotion cards. Each card uses a distinct color palette and icon to communicate the mood visually — no dropdowns. Cards animate on hover and show a selected state. A "Generate My Drink" CTA button activates once an emotion is chosen.

Emotion → Color mapping:
- Calm → soft sage/teal (`#8FBC8F` / `#4A9B8E`)
- Excited → vibrant coral/amber (`#FF6B6B` / `#FFB347`)
- Romantic → deep rose/wine (`#C2185B` / `#880E4F`)
- Reflective → slate/indigo (`#546E7A` / `#37474F`)

**Done when:** User can click an emotion card, it highlights, and the button becomes enabled.

---

### Issue 3 — Ingredient Input
Below the emotion cards, add an optional ingredient tag input (type a name, press Enter to add as a badge, click badge to remove). The input is clearly labeled "optional." The generate button works with zero ingredients entered.

**Done when:** Tags can be added/removed, state is correctly captured, passes as array to API.

---

### Issue 4 — AI Integration & Prompt Design
Implement `POST /api/generate`. It receives `{ emotion, ingredients }`, constructs the prompt, calls the Claude API, parses and Zod-validates the JSON response, and returns the `CocktailRecipe` object. Includes the one-retry logic on validation failure and proper error responses (400 for bad input, 500 for AI failure).

Wire the frontend form to this endpoint with a loading state (skeleton or spinner).

**Done when:** End-to-end flow produces a valid recipe object logged to the console.

---

### Issue 5 — Recipe Display Page
Build `/generate` as a results page that reads recipe state (passed via URL params or React state/context) and renders it in structured sections: cocktail name + mood badge, flavor profile chips, ingredient list, numbered steps, and the mood explanation callout. Implement a skeleton loading state for the 2–4 second generation window, and a graceful error state with a retry button.

**Done when:** All recipe fields render correctly across three test emotions, loading and error states both work.

---

### Issue 6 — UI Polish & Output Validation
Tighten spacing, typography, and transitions. Run 10+ test generations across all four emotions and refine the prompt if outputs are unrealistic or repetitive. Add a "Generate Another" button that returns to home with the emotion pre-selected. Confirm mobile responsiveness.

**Done when:** UI passes a visual review, prompt produces coherent recipes in >80% of test runs.

---

## 6. Key Technical Decisions & Tradeoffs

| Decision | Choice | Rationale |
|---|---|---|
| State passing between pages | React Context + URL param | Avoids full database dependency for core flow |
| AI output format | JSON via system prompt | More reliable than function calling for creative tasks |
| Retry on validation failure | 1 retry max | Balances reliability vs. latency budget |
| Supabase opt-in | Feature-flagged | Core product works without it; avoids blocking on DB setup |
| Single file for prompt | `lib/prompts/cocktail.ts` | Centralizes the highest-maintenance artifact |

---

## 7. File Structure

```
/
├── app/
│   ├── page.tsx                  # Emotion selection (Issue 2)
│   ├── generate/
│   │   └── page.tsx              # Recipe display (Issue 5)
│   ├── saved/
│   │   └── page.tsx              # Favorites — stretch
│   └── api/
│       ├── generate/
│       │   └── route.ts          # AI integration (Issue 4)
│       └── recipes/
│           └── route.ts          # Supabase CRUD — stretch
├── components/
│   ├── EmotionCard.tsx
│   ├── IngredientInput.tsx
│   ├── RecipeCard.tsx
│   ├── FlavorBadge.tsx
│   └── RecipeSkeleton.tsx
├── lib/
│   ├── prompts/
│   │   └── cocktail.ts           # Versioned AI prompt
│   ├── schemas/
│   │   └── recipe.ts             # Zod schema (shared)
│   └── supabase/
│       └── client.ts             # Optional DB client
├── types/
│   └── recipe.ts                 # CocktailRecipe interface
└── ARCHITECTURE.md
```

---
