# orthogonalish

An illustrated, interactive lesson starring Rosencrantz and Guildenstern as
they reason from perfect right angles to the useful, crowded geometry of a
language model's shared representation space.

## What it teaches

The story introduces orthogonal vectors as directions meeting at exactly 90°,
then relaxes that condition to *near*-orthogonality. It uses the idea to explain
superposition: many features can share a high-dimensional space while producing
relatively little interference. The Shared Board finale connects that picture to
how language models can make room for meaning.

## How to read it

Move through one story beat at a time with the on-screen ↑ and ↓ controls, or
with Up and Down (Page Up, Page Down, and Space also work). Speech bubbles carry
the characters' argument; narrator sidebars add the mathematical context.
Optional term tooltips offer a little more depth on hover, keyboard focus, or
touch without interrupting the story.

## Mathematical scope

The exact baseline is deliberately simple: in `d` dimensions, exactly `d`
mutually orthogonal basis directions fit at 90°. The large near-orthogonal
totals shown later are illustrative estimates, not exact maxima or guarantees.
They make the geometric contrast vivid rather than model the full complexity of
learned representations, whose directions use continuous values.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Project structure

- `lib/story-deck.ts` is the source of truth for the ordered story, numerical
  inputs, illustration metadata, bubble placement, narration, tooltips, and
  overlay props.
- `app/guided-story.tsx` owns story position and one-axis navigation.
- `app/story-panel.tsx` renders each illustrated scene and its accessible
  supporting content.
- `app/page.tsx` is the lesson shell; `app/layout.tsx` owns document and social
  metadata.
- `public/images/` holds the WebP illustration series, and `public/og.png` is
  the social-preview image.

## Verification

Run `npm test` for the story, navigation, rendering, and metadata contracts.
Run `npm run lint` and `npm run build` before shipping changes. The test suite
also guards the 90° baseline and the framing of large totals as estimates.
