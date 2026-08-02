# Task 7: responsive and accessibility verification

## Scope completed

- Added viewport contracts for `100dvh`, clipped scene overflow, the 700px-height and 620px-width breakpoints, short-landscape handling, and the narrow-panel ordering: speech remains on artwork in row 2 while the narrator panel moves below it to row 3.
- Added rendered accessibility contracts for collapsed tooltip buttons: `aria-expanded`, stable `aria-describedby`/`role="tooltip"` linkage, and tooltip identity.
- Centralized tooltip state transitions used by the live component. Touch/click toggles, hover and keyboard focus open, and Escape and blur close. Existing mouse-leave logic still preserves an open tooltip while its trigger retains focus.
- Retained the established one-step navigation and final-boundary contracts in `app/guided-story.test.ts` and `lib/story-deck.test.ts`.
- Reduced-motion support remains covered by the existing rendered-HTML contract and the navigation scroll-behavior test.

## TDD evidence

1. Added a tooltip interaction-state test before the transition helper existed; it failed with `TypeError: tooltipNextState is not a function`.
2. Implemented the minimal shared transition helper and routed the existing handlers through it; the focused test passed.
3. Added hover as an explicit interaction requirement; the test failed with `expected false to be true`, then passed after the hover transition was added.

## Verification

- Focused suite: `npm test -- tests/rendered-html.test.mjs app/story-panel.test.ts app/guided-story.test.ts app/page-review.test.ts` — 16 tests passed.
- Full suite: `npm test` — 9 files, 51 tests passed.
- `npm run lint` — passed.
- `npm run build` — passed; vinext reported `Build complete`.
- `git diff --check` — passed with no output.

## Visual-review limitation

I attempted to start the local preview for the five required viewport sizes (1440x900, 1280x650, 768x1024, 390x844, and 844x390). The managed environment rejected the server socket with `listen EPERM` on `0.0.0.0:9229`, so no live visual review was possible here. I did not infer or claim browser results. The static CSS and rendered-HTML contracts above remain in place; perform the viewport-by-viewport visual pass in an unrestricted running preview before release.

## Self-review

- Changes are limited to tooltip interaction behavior and responsive/accessibility regression coverage.
- No deployment or Vercel configuration was modified.
- Existing CSS already met the narrow-panel layering contract, so no speculative layout change was made without a reproduced defect.
