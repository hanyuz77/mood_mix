# SPEC.md  
Project: Emotion-Based Cocktail Generator  
Proposer: Janice Zhou  
Developer: Chuhan Ji
Agreed Development Fee: 25 GIX Bucks  

---

# 1. Project Overview

This project is an AI-powered cocktail generator that creates drink recipes based on a user’s emotional state. Instead of searching by ingredients or known recipes, users select how they feel (e.g., relaxed, excited, sad), and the system generates a tailored cocktail experience including flavor profile, ingredients, and preparation steps.

The goal is to transform drink discovery from a functional search task into an emotional and experiential interaction.

---

# 2. User Stories

### Core Users
- Individuals at home choosing a drink
- Social users preparing for gatherings
- Casual users who don’t know cocktail recipes

### User Stories

1. As a user, I want to select my current emotion so that I can get a drink that matches how I feel.  
2. As a user, I want to optionally input ingredients I have so that I can get realistic and usable recipes.  
3. As a user, I want to receive a complete cocktail recipe so that I can easily make the drink.  
4. As a user, I want to understand why a drink fits my mood so that the experience feels intentional.  
5. As a user, I want to explore different moods so that I can discover new types of drinks.  
6. As a user, I want a clean and visually appealing interface so that the experience feels premium and engaging.  

---

# 3. Functional Specifications

## Core Features

### 1. Emotion Selection Interface
- Users can choose from predefined emotions:
  - Calm / Relaxed
  - Excited / Party
  - Romantic
  - Reflective / Late-night
- UI should be visual (cards, colors, or icons), not just dropdown

---

### 2. Ingredient Input (Optional)
- Users can input available ingredients (free text or tags)
- System should still work if no ingredients are provided

---

### 3. AI Recipe Generation
System generates:
- Cocktail name
- Flavor profile (e.g., light, citrusy, strong)
- Ingredient list
- Step-by-step instructions
- Estimated preparation time
- Short explanation: “Why this matches your mood”

---

### 4. Structured Output
- AI response should be structured (JSON or similar)
- Frontend displays content in clear sections

---

### 5. Results Display Page
- Clean card layout
- Sections:
  - Title + mood
  - Flavor profile
  - Ingredients
  - Steps
  - Explanation

---

## Stretch Features (Optional)
- Adjust strength (light / strong)
- Regenerate variations
- Save favorite recipes
- Suggest substitutions

---

# 4. Non-Functional Requirements

- Responsive web app (desktop-first acceptable)
- Fast response time (<3–5 seconds for generation)
- Clean and intuitive UI (UX is important for this project)
- Maintainable and readable code

---

# 5. Technical Specifications

## Suggested Stack
- Frontend: Next.js
- Backend: API routes (Next.js or lightweight backend)
- Database: Supabase (optional, for saving recipes)
- AI: OpenAI / Claude API

---

## Data Model (Minimal)

Table: recipes (optional)
- id
- emotion
- ingredients_input
- generated_recipe (JSON)
- timestamp

---

# 6. AI Behavior Specification

The AI should:
- Map emotions → flavor profiles:
  - Calm → light, herbal, low alcohol
  - Party → strong, citrus, sparkling
  - Romantic → smooth, sweet, aromatic
- Generate realistic and makeable recipes
- Avoid unsafe or extreme ingredient combinations
- Always return structured output

---

# 7. Success Criteria

- User can generate a cocktail in <10 seconds
- Output is understandable and usable without confusion
- At least 80% of generated recipes are realistic and coherent
- Users can clearly perceive the connection between emotion and result

---

# 8. Development Fee Agreement

- Agreed Fee: **25 GIX Bucks**
- Rationale:
  - Moderate complexity (AI + frontend UI)
  - Requires prompt design + structured output
  - UI/UX is important but scope is controlled

---

# 9. Project Scope Breakdown (GitHub Issues)

## Issue 1 — Project Setup & Structure
- Initialize repository and project (Next.js or chosen stack)
- Setup basic routing and folder structure
- Configure environment variables (API keys)

---

## Issue 2 — Emotion Selection UI
- Design and implement emotion selection interface
- Use visual elements (cards, colors, icons) instead of dropdown
- Allow single emotion selection

---

## Issue 3 — Ingredient Input (Optional)
- Implement ingredient input field (text or tag-based)
- Allow users to submit with or without ingredients
- Basic validation (non-empty or optional)

---

## Issue 4 — AI Integration & Prompt Design
- Connect to AI API (OpenAI / Claude)
- Design prompt to map emotion → cocktail recipe
- Ensure structured response (JSON format preferred)

---

## Issue 5 — Recipe Display Page
- Build results UI to display generated cocktail
- Include:
  - Name
  - Flavor profile
  - Ingredients
  - Steps
  - Explanation (why it matches mood)
- Handle loading and error states

---

## Issue 6 — UI Polish & Output Validation
- Improve layout, spacing, and typography
- Ensure recipes are readable and usable
- Refine prompt for more consistent outputs