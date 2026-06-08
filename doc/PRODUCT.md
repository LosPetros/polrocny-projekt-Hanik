# Product

## Register

brand

## Users

Two primary users:
- **Travelers (guests)**: browsing hotels on desktop/laptop, want to find and book quickly with minimal friction. They're in "planning mode" — relaxed, comparison-shopping, care about price, location, photos.
- **Hotel owners**: listing their properties, uploading images, setting room prices. They want a clean management flow without admin complexity.
- **Admins** (secondary): reviewing and approving hotel listings. Tool-focused, efficiency over aesthetics.

## Product Purpose

Hotelex is a hotel reservation platform — a school project demonstrating a full-stack booking system (Vue + Hono + MySQL). Travelers search hotels by city, view rooms, and book. Hotel owners submit listings for admin approval. The core success metric is a smooth, trustworthy booking experience that feels premium despite being a prototype.

## Brand Personality

Calm confidence. Effortless. Premium-without-attitude.

Three words: **unhurried, precise, airy**.

Emotional goal: the user should feel like they're being taken care of — like a concierge experience, not a search engine.

## Anti-references

- **Booking.com / Expedia**: dense, data-heavy, aggressive CTA stacking, bright orange/yellow urgency patterns — the exact opposite of what Hotelex should feel like.
- **AirBnB 2020-era clutter**: too much information per card, small typography, noisy grid.
- **Generic Tailwind SaaS templates**: the "3 feature cards with gradient icon bubbles" pattern, centered h1 + paragraph + one CTA — this is exactly what the current landing page is and must not remain.
- **Dark hotel booking sites**: this is a light, airy product. No near-black backgrounds.
- **Bounce/elastic CSS animations**: no spring physics, no playful wobble. Smooth, exponential ease-out only.

## Design Principles

1. **Sky as context, not decoration** — the background image earns its place by setting a travel mindset. Every page layer should breathe against it, not fight it.
2. **One action at a time** — every screen has one primary CTA that's visually dominant. Secondary actions step back. No competing gradients.
3. **Type does the heavy lifting** — the design's premium feel should come from strong type hierarchy and generous spacing, not from visual complexity. If the type looks good, the page looks good.
4. **Motion is purposeful, not decorative** — reveals happen on first paint, not on scroll (content must be readable without JS). Hover states are the primary motion surface.
5. **Glass is earned** — frosted glass effects only on elements floating over the sky background. On white/light sections, use clean borders and shadows instead.

## Accessibility & Inclusion

- Target WCAG AA (4.5:1 body text, 3:1 large text).
- Body text must never be lighter than #374151 on white/near-white backgrounds.
- All interactive elements have visible focus rings.
- Reduced-motion alternatives for all entrance animations.
- Date inputs retain native browser accessibility.
