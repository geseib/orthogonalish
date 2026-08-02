# Single-Axis Story Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a viewport-fitted theatrical story deck in which Down and Up traverse every beat, including Rosencrantz’s 12,288-dimensional cold open and the exponential numerical reveal, without requiring Left or Right.

**Architecture:** Replace the split hero/intro navigation with one ordered `storySteps` model and a `GuidedStory` client component. The component owns the active guided step, changes dialogue in place within a scene, scrolls exactly one viewport when the scene changes, and sends guided calculator inputs to `Home` through a callback. Existing estimate functions remain the only numerical source.

**Tech Stack:** React 19, Next.js/Vinext, TypeScript, CSS, Vitest, Web Worker calculator experiment, generated WebP illustration.

## Global Constraints

- Down advances exactly one step; Up reverses exactly one step.
- No required content depends on Left or Right.
- Narrative stages fit ordinary desktop, tablet, phone portrait, and phone landscape visual viewports.
- Guided figures come from `estimateRandomSet()` plus `estimateStoryTotal()`.
- 12,288/88–92° must display 1,388,864; 1,000 must display 2,658; 10,000 must display 540,586.
- Exact 90°/90° remains one vector per dimension.
- The guided sequence never launches the construction worker.
- Inputs retain native ArrowUp/ArrowDown behavior.
- Reduced-motion users receive immediate changes.
- Preserve the engraved black, ivory, brass, and cyan visual system.

---

## File Structure

- Create `lib/story-deck.ts`: ordered story data, guided-input types, estimate derivation, and pure step navigation.
- Create `lib/story-deck.test.ts`: order, numerical, boundary, and scene-transition tests.
- Create `app/guided-story.tsx`: viewport deck, active-step controller, keyboard/click navigation, live dialogue, and calculator callback.
- Create `app/guided-story.test.ts`: component source contracts and prohibited horizontal-navigation checks.
- Modify `app/page.tsx`: replace hero plus `IntroSequence`, accept guided values, mark the calculator destination.
- Modify `app/page-review.test.ts`: story order, calculator bridge, and accessibility regressions.
- Modify `app/globals.css`: fixed visual-viewport stages, compact height breakpoints, narrow layouts, and persistent controls.
- Create `public/images/rosencrantz-discovery.webp`: matching cold-open illustration.
- Delete `app/intro-sequence.tsx`, `app/intro-sequence.test.ts`, `lib/intro-story.ts`, and `lib/intro-story.test.ts` after their responsibilities move to the deck.
- Modify `lib/story-navigation.ts` and `lib/story-navigation.test.ts`: retain shared reduced-motion and interactive-target helpers; remove obsolete horizontal decision behavior.

---

### Task 1: Ordered Story and Pure Navigation

**Files:**
- Create: `lib/story-deck.ts`
- Create: `lib/story-deck.test.ts`
- Modify: `lib/story-navigation.ts`
- Modify: `lib/story-navigation.test.ts`

**Interfaces:**
- Produces `GuidedInput`, `StoryStep`, `StoryScene`, `storySteps`, `getGuidedEstimate(step)`, and `moveStoryStep(currentIndex, direction)`.
- `getGuidedEstimate` returns `StoryEstimate | null` by calling the existing estimate module.
- `moveStoryStep` returns `{ index: number; sceneChanged: boolean }`.

- [ ] **Step 1: Write failing story-data and navigation tests**

```ts
expect(storySteps[0]).toMatchObject({
  scene: "cold-open",
  guidedInput: { dimension: 12_288, lowerAngle: 88, upperAngle: 92 },
});
expect(getGuidedEstimate(storySteps[0])?.total).toBe(1_388_864);
expect(getGuidedEstimate(findStep(1_000))?.total).toBe(2_658);
expect(getGuidedEstimate(findStep(10_000))?.total).toBe(540_586);
expect(storySteps.map((step) => step.rosencrantz).join(" ")).toMatch(
  /That seems more than I put in/i,
);
expect(storySteps.map((step) => step.guildenstern ?? "").join(" ")).toMatch(
  /exponential growth with dimension/i,
);
expect(moveStoryStep(0, "previous")).toEqual({ index: 0, sceneChanged: false });
expect(moveStoryStep(0, "next")).toEqual({
  index: 1,
  sceneChanged: storySteps[0].scene !== storySteps[1].scene,
});
```

- [ ] **Step 2: Run the tests and confirm RED**

Run: `npm test -- lib/story-deck.test.ts lib/story-navigation.test.ts`

Expected: failure because `lib/story-deck.ts` and the new interfaces do not exist.

- [ ] **Step 3: Implement the story model**

Define:

```ts
export type StoryScene =
  | "cold-open"
  | "title"
  | "right-angle"
  | "one-more"
  | "failed-demo"
  | "growth";

export type GuidedInput = {
  dimension: number;
  lowerAngle: number;
  upperAngle: number;
};

export type StoryStep = {
  id: string;
  scene: StoryScene;
  eyebrow: string;
  title: string;
  image?: string;
  alt?: string;
  rosencrantz: string;
  guildenstern?: string;
  aside: string;
  guidedInput?: GuidedInput;
};
```

Populate the approved order: two cold-open beats at 12,288, title, three right-angle beats, three one-more beats, four failed-demonstration beats at 10, and growth beats at 100, 1,000, 10,000, comparison, and naming. Use concise dialogue so each step fits.

Implement estimates only through:

```ts
export function getGuidedEstimate(step: StoryStep): StoryEstimate | null {
  if (!step.guidedInput) return null;
  const { dimension, lowerAngle, upperAngle } = step.guidedInput;
  return estimateStoryTotal(
    estimateRandomSet(dimension, lowerAngle, upperAngle),
  );
}
```

Replace horizontal navigation decisions in `lib/story-navigation.ts` with shared `isInteractiveTarget()` and `getPreferredScrollBehavior()` helpers only.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `npm test -- lib/story-deck.test.ts lib/story-navigation.test.ts lib/estimate.test.ts`

Expected: all focused tests pass, including exact guided totals.

- [ ] **Step 5: Commit the model**

```bash
git add lib/story-deck.ts lib/story-deck.test.ts lib/story-navigation.ts lib/story-navigation.test.ts
git commit -m "feat: define the single-axis story sequence"
```

---

### Task 2: Guided Story Controller and Calculator Bridge

**Files:**
- Create: `app/guided-story.tsx`
- Create: `app/guided-story.test.ts`
- Modify: `app/page.tsx`
- Modify: `app/page-review.test.ts`
- Delete: `app/intro-sequence.tsx`
- Delete: `app/intro-sequence.test.ts`
- Delete: `lib/intro-story.ts`
- Delete: `lib/intro-story.test.ts`

**Interfaces:**
- Consumes `storySteps`, `moveStoryStep`, `getGuidedEstimate`, `isInteractiveTarget`, and `getPreferredScrollBehavior`.
- Produces `GuidedStory({ onGuidedInput })`, where `onGuidedInput(input: GuidedInput): void` updates the existing calculator fields without starting the worker.

- [ ] **Step 1: Write failing component and page integration tests**

Test the source contracts:

```ts
expect(source).toMatch(/storySteps/);
expect(source).toMatch(/aria-label="Previous story step"/);
expect(source).toMatch(/aria-label="Next story step"/);
expect(source).toMatch(/event\.key === "ArrowDown"/);
expect(source).toMatch(/event\.key === "ArrowUp"/);
expect(source).not.toMatch(/ArrowRight|ArrowLeft/);
expect(source).not.toMatch(/Next dialogue beat|Previous dialogue beat/);
expect(source).toMatch(/onGuidedInput/);
expect(pageSource).toMatch(/<GuidedStory/);
expect(pageSource).not.toMatch(/<IntroSequence/);
```

- [ ] **Step 2: Run component tests and confirm RED**

Run: `npm test -- app/guided-story.test.ts app/page-review.test.ts`

Expected: failure because `GuidedStory` does not exist and `page.tsx` still renders `IntroSequence`.

- [ ] **Step 3: Implement `GuidedStory`**

Use one active global step index. Route both keyboard and buttons through one `navigate(direction)` callback. Ignore interactive targets. When the destination shares the current scene, update content in place. When it changes scene, call the destination element’s `scrollIntoView({ block: "start" })`. Guard transitions with a ref and release it after the short CSS transition; reduced-motion releases immediately.

Render one section per unique scene and display the active step for that scene. Keep inactive scenes on their first coherent beat. Render:

- scene heading and engraved artwork;
- one or two character cards depending on `guildenstern`;
- the guided dimension and estimate when supplied;
- aside;
- fixed previous/next controller with `activeIndex + 1` of `storySteps.length`.

Invoke `onGuidedInput` whenever the active step supplies one. Do not call `startSimulation()`.

- [ ] **Step 4: Bridge values into `Home`**

Add:

```ts
function acceptGuidedInput(input: GuidedInput) {
  stopCurrentRun();
  setDimensionValue(String(input.dimension));
  setLowerAngleValue(String(input.lowerAngle));
  setUpperAngleValue(String(input.upperAngle));
  setDialogueKind("dimension");
  setRunStatus("idle");
  setProgress(null);
  setResult(null);
  setRunError(null);
}
```

Render `<GuidedStory onGuidedInput={acceptGuidedInput} />` before the existing calculator. Remove the old hero and `IntroSequence`, because the title is now a story scene. Preserve the calculator, stage, evidence, worker behavior, and exact-90° shortcut.

- [ ] **Step 5: Remove obsolete intro files and update regressions**

Delete the four superseded intro files. Update source tests to read `guided-story.tsx` for “What did that mean?” only if the new deck retains that optional action; do not require a second dialogue navigation system.

- [ ] **Step 6: Run integration tests and confirm GREEN**

Run: `npm test -- app/guided-story.test.ts app/page-review.test.ts tests/rendered-html.test.mjs lib/dialogue.test.ts`

Expected: the new single-axis contracts pass and calculator dialogue regressions remain green.

- [ ] **Step 7: Commit the controller**

```bash
git add app/guided-story.tsx app/guided-story.test.ts app/page.tsx app/page-review.test.ts tests/rendered-html.test.mjs app/intro-sequence.tsx app/intro-sequence.test.ts lib/intro-story.ts lib/intro-story.test.ts
git commit -m "feat: guide the full lesson with up and down"
```

---

### Task 3: Viewport-Fitted Responsive Stages

**Files:**
- Modify: `app/globals.css`
- Modify: `app/page-review.test.ts`

**Interfaces:**
- Consumes `.guided-story`, `.story-scene`, `.story-stage-grid`, `.story-art-frame`, `.story-dialogue`, `.story-estimate`, and `.story-controller` markup from Task 2.
- Produces visual-viewport alignment and breakpoint behavior without component-side dimension calculations.

- [ ] **Step 1: Add failing responsive style contracts**

```ts
expect(css).toMatch(/\.story-scene\s*\{[^}]*height:\s*100dvh/s);
expect(css).toMatch(/\.story-scene\s*\{[^}]*overflow:\s*hidden/s);
expect(css).toMatch(/grid-template-(?:columns|rows):[^;]*minmax\(0,/);
expect(css).toMatch(/@media\s*\(max-height:\s*700px\)/);
expect(css).toMatch(/@media\s*\(max-width:\s*620px\)/);
expect(css).toMatch(/\.story-controller\s*\{/);
```

- [ ] **Step 2: Run the style test and confirm RED**

Run: `npm test -- app/page-review.test.ts`

Expected: failure because the story-stage styles do not exist.

- [ ] **Step 3: Implement the viewport layout**

Use `height: 100dvh`, `min-height: 100svh`, `overflow: hidden`, `scroll-snap-align: start`, and bounded grid tracks. Keep controller clearance in the content padding. Use height-aware values such as `clamp(1.7rem, 6dvh, 5rem)` and an artwork row bounded by available height.

Add:

- wide layout with artwork and dialogue side by side;
- `max-height: 700px` compact layout with reduced heading, image, gaps, and decorative copy;
- `max-width: 620px` portrait stack with shallow artwork and compact dialogue;
- `(orientation: landscape) and (max-height: 520px)` two-column phone layout;
- reduced-motion transitions;
- fixed safe-area-aware controller that never covers cards.

Remove obsolete `.intro-*` and `.story-section-nav` rules after the old component is deleted.

- [ ] **Step 4: Run source tests, lint, and build**

Run: `npm test -- app/page-review.test.ts app/guided-story.test.ts && npm run lint && npm run build`

Expected: all commands exit successfully.

- [ ] **Step 5: Commit the responsive deck**

```bash
git add app/globals.css app/page-review.test.ts
git commit -m "feat: fit every story stage to the viewport"
```

---

### Task 4: Rosencrantz Cold-Open Illustration

**Files:**
- Create: `public/images/rosencrantz-discovery.webp`
- Modify: `lib/story-deck.ts`

**Interfaces:**
- Produces the `/images/rosencrantz-discovery.webp` asset referenced by cold-open steps.

- [ ] **Step 1: Inspect the existing illustration series**

View `grand-conjecture.webp`, `two-ideas-right-angle.webp`, and `one-more-finger.webp` before generating so the new image preserves the established character and engraving style.

- [ ] **Step 2: Generate the new wide illustration**

Generate a 2:1 antique engraved theatre panel: Rosencrantz alone in pale Elizabethan clothing, idly operating a brass dimensional apparatus, surrounded by a suddenly multiplying field of cyan vector arrows; an ivory counter panel glows with the sense of an enormous result but contains no written numerals or text; Guildenstern is absent; no logos or recognizable actors.

- [ ] **Step 3: Convert and install the asset**

Convert the generated PNG to a 1774×887 WebP at high quality and save it as `public/images/rosencrantz-discovery.webp`, leaving the generated source untouched.

- [ ] **Step 4: Verify the asset contract**

Run: `file public/images/rosencrantz-discovery.webp && npm run build`

Expected: a valid WebP image and a successful production build with no missing asset.

- [ ] **Step 5: Commit the illustration**

```bash
git add public/images/rosencrantz-discovery.webp lib/story-deck.ts
git commit -m "feat: illustrate Rosencrantz accidental discovery"
```

---

### Task 5: End-to-End Story and Responsive Verification

**Files:**
- Modify only files needed to fix defects found during verification.

**Interfaces:**
- Verifies all earlier task outputs together.

- [ ] **Step 1: Run the full automated verification**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: all tests pass, lint reports no errors, production build succeeds, and no whitespace errors appear.

- [ ] **Step 2: Verify the complete Down sequence in a browser**

At a wide desktop viewport, repeatedly activate the visible Down button and verify every dialogue beat appears in order, 12,288 shows 1,388,864, 1,000 shows 2,658, 10,000 shows 540,586, and the final Down lands on the calculator. Confirm no horizontal action is required.

- [ ] **Step 3: Verify the complete Up sequence**

Repeatedly activate Up from the calculator and verify the exact reverse order and restored guided values, ending at the disabled Up control in the cold open.

- [ ] **Step 4: Verify viewport geometry**

Check 1440×900, 1280×650, 768×1024, 390×844, and 844×390. For every narrative scene, compare its bounding height to `window.innerHeight`, confirm no content extends below its scene, and inspect screenshots for controller overlap or lost geometric focal points.

- [ ] **Step 5: Verify interaction safety and accessibility**

Focus the dimension input and confirm ArrowUp changes the input rather than navigating. Check reduced-motion mode, controller labels, disabled boundaries, polite dialogue updates, image alternatives, console errors, and horizontal overflow.

- [ ] **Step 6: Fix discovered defects and repeat the relevant checks**

For each defect, add or tighten a regression test when practical, make the smallest scoped fix, and rerun the failing check plus the full automated suite.

- [ ] **Step 7: Commit verification fixes**

```bash
git add app lib public tests
git commit -m "fix: polish the single-axis story flow"
```

Skip this commit only when verification requires no code changes.
