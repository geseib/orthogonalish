# Introductory Theatre Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two full-height introductory theatre scenes that teach perfect and nearly orthogonal directions before the calculator, with left/right dialogue beats and up/down section navigation.

**Architecture:** Keep story content and pure navigation rules in small library modules, render both scenes through one reusable client component, and integrate that component between the existing title card and calculator. A single keyboard handler resolves the nearest page section and maps Up/Down to section movement and Left/Right to beat movement while leaving focused interactive controls alone.

**Tech Stack:** React 19, TypeScript 5.9, Vinext/Next-compatible components, Vitest, CSS, generated WebP illustrations.

## Global Constraints

- Preserve the existing black, ivory, gold, and cyan theatre design.
- Keep the current title card and calculator; insert exactly two introductory scenes between them.
- Every introductory scene has exactly three beats: setup, experiment, discovery.
- Default copy uses no dot product, coherence, epsilon, named bounds, or formulas.
- Up/Down changes full page sections; Left/Right changes beats without scrolling.
- Keyboard shortcuts do not override focused buttons, links, inputs, selects, textareas, or editable content.
- Reduced-motion preferences use immediate rather than smooth movement.
- Do not change calculator mathematics, simulation behavior, or the existing estimate.
- Preserve all unrelated working-tree changes.

---

### Task 1: Story content and beat boundaries

**Files:**
- Create: `lib/intro-story.ts`
- Create: `lib/intro-story.test.ts`

**Interfaces:**
- Produces: `IntroBeat`, `IntroScene`, `introScenes`, and `moveBeat(index, count, direction)`.
- Consumed by: `app/intro-sequence.tsx` in Task 3.

- [ ] **Step 1: Write the failing story-data tests**

```ts
import { describe, expect, it } from "vitest";

import { introScenes, moveBeat } from "./intro-story";

describe("introScenes", () => {
  it("contains two scenes with setup, experiment, and discovery beats", () => {
    expect(introScenes).toHaveLength(2);
    expect(introScenes.map((scene) => scene.id)).toEqual([
      "intro-right-angle",
      "intro-one-more",
    ]);
    expect(introScenes.every((scene) => scene.beats.length === 3)).toBe(true);
    expect(introScenes.flatMap((scene) => scene.beats.map((beat) => beat.kind))).toEqual([
      "setup",
      "experiment",
      "discovery",
      "setup",
      "experiment",
      "discovery",
    ]);
  });

  it("keeps the beginner-facing copy free of deferred terminology", () => {
    const copy = JSON.stringify(introScenes);
    expect(copy).toMatch(/90°|right angle/i);
    expect(copy).toMatch(/88°|92°/i);
    expect(copy).toMatch(/two dimensions/i);
    expect(copy).not.toMatch(/dot product|coherence|epsilon|Welch/i);
  });
});

describe("moveBeat", () => {
  it("moves within a scene and stops at both boundaries", () => {
    expect(moveBeat(0, 3, "previous")).toBe(0);
    expect(moveBeat(0, 3, "next")).toBe(1);
    expect(moveBeat(1, 3, "next")).toBe(2);
    expect(moveBeat(2, 3, "next")).toBe(2);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- lib/intro-story.test.ts`

Expected: FAIL because `./intro-story` does not exist.

- [ ] **Step 3: Implement the typed story data**

```ts
export type IntroBeat = {
  kind: "setup" | "experiment" | "discovery";
  rosencrantz: string;
  guildenstern: string;
  aside: string;
};

export type IntroScene = {
  id: "intro-right-angle" | "intro-one-more";
  number: "I" | "II";
  eyebrow: string;
  title: string;
  image: string;
  alt: string;
  lesson: string;
  beats: readonly [IntroBeat, IntroBeat, IntroBeat];
};

export const introScenes: readonly IntroScene[] = [
  {
    id: "intro-right-angle",
    number: "I",
    eyebrow: "Two different ideas",
    title: "A perfect right angle",
    image: "/images/two-ideas-right-angle.webp",
    alt: "Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle on a dark theatrical stage.",
    lesson:
      "Two perfectly perpendicular directions do not lean into one another. In a flat two-dimensional space, those are the two independent directions available.",
    beats: [
      {
        kind: "setup",
        rosencrantz: "Two lines. They have met and immediately agreed to face elsewhere.",
        guildenstern: "They meet at exactly 90°. Neither points even slightly along the other.",
        aside: "A right angle marks two completely separate directions.",
      },
      {
        kind: "experiment",
        rosencrantz: "Suppose this line is one idea, and that line another. Can they interrupt each other?",
        guildenstern: "Not in this picture. Each has its own direction.",
        aside: "Perpendicular directions are a clean way to represent distinct ideas.",
      },
      {
        kind: "discovery",
        rosencrantz: "Two dimensions. Two ideas. A remarkably well-behaved universe.",
        guildenstern: "Enjoy it. We are about to relax the rules.",
        aside: "In two dimensions, two perfectly perpendicular directions fit.",
      },
    ],
  },
  {
    id: "intro-one-more",
    number: "II",
    eyebrow: "Surely one more",
    title: "The finger that will not fit",
    image: "/images/one-more-finger.webp",
    alt: "Guildenstern holds thumb and forefinger in an L while Rosencrantz tries to place a third line between them.",
    lesson:
      "Allowing a small wobble around 90° does not create a third nearly-perpendicular direction in a flat plane. One more dimension still gives only one more obvious direction. The surprise needs many dimensions.",
    beats: [
      {
        kind: "setup",
        rosencrantz: "Your thumb and finger make two directions. There is plainly room between them.",
        guildenstern: "Room for a finger, perhaps. Not for a third direction nearly 90° from both.",
        aside: "The flat plane has already used its two independent directions.",
      },
      {
        kind: "experiment",
        rosencrantz: "I shall be generous: anywhere from 88° to 92°.",
        guildenstern: "Generosity has not made a third line fit. It has merely made the failure less tidy.",
        aside: "A small relaxation changes nothing obvious in two dimensions.",
      },
      {
        kind: "discovery",
        rosencrantz: "Then add one dimension.",
        guildenstern: "Three dimensions, three obvious directions. Add thousands, however, and the arithmetic changes character.",
        aside: "One extra dimension adds one direction. Many dimensions unlock the larger effect.",
      },
    ],
  },
] as const;

export function moveBeat(
  index: number,
  count: number,
  direction: "previous" | "next",
): number {
  const delta = direction === "next" ? 1 : -1;
  return Math.min(count - 1, Math.max(0, index + delta));
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- lib/intro-story.test.ts`

Expected: 3 tests pass with no warnings.

- [ ] **Step 5: Commit the story unit**

```bash
git add lib/intro-story.ts lib/intro-story.test.ts
git commit -m "feat: add introductory story beats"
```

---

### Task 2: Pure two-axis navigation rules

**Files:**
- Create: `lib/story-navigation.ts`
- Create: `lib/story-navigation.test.ts`

**Interfaces:**
- Produces: `NavigationDecision`, `resolveStoryNavigation`, `isInteractiveTarget`, and `getPreferredScrollBehavior`.
- Consumed by: `app/intro-sequence.tsx` in Task 3.

- [ ] **Step 1: Write failing navigation tests**

```ts
import { describe, expect, it } from "vitest";

import {
  getPreferredScrollBehavior,
  isInteractiveTarget,
  resolveStoryNavigation,
} from "./story-navigation";

describe("resolveStoryNavigation", () => {
  it("maps vertical keys to adjacent sections without wrapping", () => {
    expect(resolveStoryNavigation("ArrowDown", 1, 5, true)).toEqual({
      kind: "section",
      index: 2,
    });
    expect(resolveStoryNavigation("ArrowUp", 0, 5, true)).toEqual({
      kind: "section",
      index: 0,
    });
  });

  it("maps horizontal keys only when the current section has beats", () => {
    expect(resolveStoryNavigation("ArrowRight", 1, 5, true)).toEqual({
      kind: "beat",
      direction: "next",
    });
    expect(resolveStoryNavigation("ArrowLeft", 3, 5, false)).toEqual({
      kind: "none",
    });
  });
});

describe("isInteractiveTarget", () => {
  it("protects focused controls and editable content", () => {
    for (const tagName of ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]) {
      expect(isInteractiveTarget({ tagName, isContentEditable: false })).toBe(true);
    }
    expect(isInteractiveTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
    expect(isInteractiveTarget({ tagName: "DIV", isContentEditable: false })).toBe(false);
  });
});

describe("getPreferredScrollBehavior", () => {
  it("uses immediate movement when reduced motion is requested", () => {
    expect(getPreferredScrollBehavior(() => ({ matches: true }))).toBe("auto");
    expect(getPreferredScrollBehavior(() => ({ matches: false }))).toBe("smooth");
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- lib/story-navigation.test.ts`

Expected: FAIL because `./story-navigation` does not exist.

- [ ] **Step 3: Implement the pure rules**

```ts
export type NavigationDecision =
  | { kind: "none" }
  | { kind: "section"; index: number }
  | { kind: "beat"; direction: "previous" | "next" };

export function resolveStoryNavigation(
  key: string,
  currentSectionIndex: number,
  sectionCount: number,
  currentSectionHasBeats: boolean,
): NavigationDecision {
  if (key === "ArrowDown") {
    return {
      kind: "section",
      index: Math.min(sectionCount - 1, currentSectionIndex + 1),
    };
  }
  if (key === "ArrowUp") {
    return { kind: "section", index: Math.max(0, currentSectionIndex - 1) };
  }
  if (currentSectionHasBeats && key === "ArrowRight") {
    return { kind: "beat", direction: "next" };
  }
  if (currentSectionHasBeats && key === "ArrowLeft") {
    return { kind: "beat", direction: "previous" };
  }
  return { kind: "none" };
}

export function isInteractiveTarget(target: {
  tagName?: string;
  isContentEditable?: boolean;
} | null): boolean {
  if (!target) return false;
  return (
    Boolean(target.isContentEditable) ||
    ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
      target.tagName?.toUpperCase() ?? "",
    )
  );
}

export function getPreferredScrollBehavior(
  matchesReducedMotion: (query: string) => { matches: boolean },
): ScrollBehavior {
  return matchesReducedMotion("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- lib/story-navigation.test.ts`

Expected: 4 tests pass.

- [ ] **Step 5: Commit the navigation unit**

```bash
git add lib/story-navigation.ts lib/story-navigation.test.ts
git commit -m "feat: define two-axis story navigation"
```

---

### Task 3: Reusable introductory sequence component

**Files:**
- Create: `app/intro-sequence.tsx`
- Create: `app/intro-sequence.test.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `introScenes`, `moveBeat`, `resolveStoryNavigation`, `isInteractiveTarget`, and `getPreferredScrollBehavior`.
- Produces: `<IntroSequence />`, two `data-story-section` sections, and global arrow-key behavior for all marked page sections.

- [ ] **Step 1: Write failing component-contract tests**

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("IntroSequence source contracts", () => {
  it("renders both scenes, visible beat controls, and lesson controls", async () => {
    const source = await readFile(new URL("./intro-sequence.tsx", import.meta.url), "utf8");
    expect(source).toMatch(/introScenes\.map/);
    expect(source).toMatch(/Previous dialogue beat/);
    expect(source).toMatch(/Next dialogue beat/);
    expect(source).toMatch(/What did that mean\?/);
    expect(source).toMatch(/data-story-section/);
  });

  it("handles two-axis keys without stealing focused controls", async () => {
    const source = await readFile(new URL("./intro-sequence.tsx", import.meta.url), "utf8");
    expect(source).toMatch(/isInteractiveTarget\(event\.target/);
    expect(source).toMatch(/resolveStoryNavigation/);
    expect(source).toMatch(/scrollIntoView/);
    expect(source).toMatch(/getPreferredScrollBehavior/);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- app/intro-sequence.test.ts`

Expected: FAIL because `app/intro-sequence.tsx` does not exist.

- [ ] **Step 3: Implement `<IntroSequence />`**

Create a client component with this structure and behavior:

```tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { introScenes, moveBeat } from "../lib/intro-story";
import {
  getPreferredScrollBehavior,
  isInteractiveTarget,
  resolveStoryNavigation,
} from "../lib/story-navigation";

const allSectionIds = [
  "opening",
  "intro-right-angle",
  "intro-one-more",
  "calculator",
  "stage",
  "evidence",
] as const;

export function IntroSequence() {
  const [beatIndexes, setBeatIndexes] = useState([0, 0]);
  const [openLessons, setOpenLessons] = useState([false, false]);

  function changeBeat(sceneIndex: number, direction: "previous" | "next") {
    setBeatIndexes((current) =>
      current.map((beat, index) =>
        index === sceneIndex
          ? moveBeat(beat, introScenes[index].beats.length, direction)
          : beat,
      ),
    );
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isInteractiveTarget(event.target as HTMLElement | null)) return;
      const sections = allSectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));
      const currentIndex = sections.reduce(
        (best, section, index) =>
          Math.abs(section.getBoundingClientRect().top) <
          Math.abs(sections[best].getBoundingClientRect().top)
            ? index
            : best,
        0,
      );
      const sceneIndex = introScenes.findIndex(
        (scene) => scene.id === sections[currentIndex]?.id,
      );
      const decision = resolveStoryNavigation(
        event.key,
        currentIndex,
        sections.length,
        sceneIndex >= 0,
      );
      if (decision.kind === "none") return;
      event.preventDefault();
      if (decision.kind === "beat") {
        changeBeat(sceneIndex, decision.direction);
        return;
      }
      sections[decision.index]?.scrollIntoView({
        behavior: getPreferredScrollBehavior(window.matchMedia.bind(window)),
        block: "start",
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return introScenes.map((scene, sceneIndex) => {
    const beat = scene.beats[beatIndexes[sceneIndex]];
    return (
      <section
        className="intro-scene"
        id={scene.id}
        data-story-section
        key={scene.id}
        aria-labelledby={`${scene.id}-title`}
      >
        <div className="intro-scene-heading">
          <p className="eyebrow">Scene {scene.number} · {scene.eyebrow}</p>
          <h2 id={`${scene.id}-title`}>{scene.title}</h2>
        </div>
        <Image src={scene.image} alt={scene.alt} width={1774} height={887} />
        <div className="intro-dialogue" aria-live="polite">
          <blockquote><p>{beat.rosencrantz}</p><cite>Rosencrantz · experimentalist</cite></blockquote>
          <blockquote><p>{beat.guildenstern}</p><cite>Guildenstern · theorist</cite></blockquote>
        </div>
        <p className="intro-aside"><span>Aside</span>{beat.aside}</p>
        {openLessons[sceneIndex] ? <p className="intro-lesson">{scene.lesson}</p> : null}
        <div className="intro-controls">
          <button
            type="button"
            aria-label="Previous dialogue beat"
            onClick={() => changeBeat(sceneIndex, "previous")}
            disabled={beatIndexes[sceneIndex] === 0}
          >←</button>
          <span>{beatIndexes[sceneIndex] + 1} / {scene.beats.length}</span>
          <button
            type="button"
            aria-label="Next dialogue beat"
            onClick={() => changeBeat(sceneIndex, "next")}
            disabled={beatIndexes[sceneIndex] === scene.beats.length - 1}
          >→</button>
          <button
            type="button"
            aria-expanded={openLessons[sceneIndex]}
            onClick={() =>
              setOpenLessons((current) =>
                current.map((open, index) => index === sceneIndex ? !open : open),
              )
            }
          >{openLessons[sceneIndex] ? "Go on" : "What did that mean?"}</button>
        </div>
      </section>
    );
  });
}
```

- [ ] **Step 4: Integrate the component and mark navigable sections**

In `app/page.tsx`:

```tsx
import { IntroSequence } from "./intro-sequence";
import { getPreferredScrollBehavior } from "../lib/story-navigation";

export { getPreferredScrollBehavior } from "../lib/story-navigation";

// Opening title card
<header className="hero" id="opening" data-story-section>

// Immediately after </header>
<IntroSequence />

// Existing sections
<section className="calculator-shell" id="calculator" data-story-section ...>
<section className="stage" id="stage" data-story-section ...>
<section className="evidence" id="evidence" data-story-section ...>
```

Remove the existing local `getPreferredScrollBehavior` function body from `app/page.tsx`; the re-export preserves its tested public contract without creating a circular dependency.

Replace the title-card link target from `#calculator` to `#intro-right-angle` and change its visible label to “Begin the experiment.”

- [ ] **Step 5: Run component and regression tests**

Run: `npm test -- app/intro-sequence.test.ts app/page-review.test.ts tests/rendered-html.test.mjs`

Expected: all focused tests pass; existing source contracts remain green.

- [ ] **Step 6: Commit the interactive component**

```bash
git add app/intro-sequence.tsx app/intro-sequence.test.ts app/page.tsx
git commit -m "feat: add navigable introductory scenes"
```

---

### Task 4: Matching visual scenes

**Files:**
- Create: `public/images/two-ideas-right-angle.webp`
- Create: `public/images/one-more-finger.webp`
- Modify: `app/globals.css`
- Modify: `app/page-review.test.ts`

**Interfaces:**
- Consumes: the class names and image paths from `app/intro-sequence.tsx`.
- Produces: two responsive full-height scenes visually continuous with the existing theatre artwork.

- [ ] **Step 1: Add failing visual-contract assertions**

Add to `app/page-review.test.ts`:

```ts
it("styles both introductory scenes as full theatrical sections", async () => {
  const css = await readFile(new URL("./globals.css", import.meta.url), "utf8");
  expect(css).toMatch(/\.intro-scene\s*\{[^}]*min-height:\s*100(?:dvh|vh)/s);
  expect(css).toMatch(/\.intro-dialogue/);
  expect(css).toMatch(/\.intro-controls/);
  expect(css).toMatch(/@media \(max-width: 620px\)/);
});
```

- [ ] **Step 2: Run the visual-contract test and verify RED**

Run: `npm test -- app/page-review.test.ts`

Expected: FAIL because `.intro-scene` does not exist.

- [ ] **Step 3: Generate the two original illustrations**

Read the `imagegen` skill before generation. Create one illustration at a time with no actor likenesses and with this shared art direction:

```text
Wide 2:1 editorial theatrical illustration, matching a sophisticated mid-century scientific cartoon series. Deep black stage, warm ivory paper textures, muted brass gold props, luminous cyan geometry, two original lanky scientist-actors in dark period clothing, restrained expressive faces, elegant negative space, no text, no formulas, no logos, no recognizable film actors.
```

Scene-specific prompt additions:

```text
Scene I: two cyan luminous lines meeting in an unmistakable exact right angle at center stage; the experimental character lightly touches or tests one line while the theorist observes with a brass set square; the right angle is the unmistakable focal point.
```

```text
Scene II: the theorist holds thumb and forefinger in a clear L shape while the experimental character tries to insert a third slender cyan line or finger between them; the visual joke must read instantly; the third line visibly cannot be nearly perpendicular to both existing directions.
```

Inspect each generated image, reject unreadable hands or accidental text, convert accepted images to WebP if required, and save at the exact public paths listed above.

- [ ] **Step 4: Add the scene styles**

Append focused styles to `app/globals.css` using existing variables:

```css
.intro-scene {
  align-content: center;
  background: var(--charcoal);
  min-height: 100dvh;
  padding: clamp(4rem, 8vw, 8rem) max(5vw, calc((100vw - 1440px) / 2));
  position: relative;
  scroll-margin-top: 0;
}

.intro-scene:nth-of-type(even) {
  background: var(--ink);
}

.intro-scene-heading {
  align-items: end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.intro-scene-heading h2 {
  font-size: clamp(2.8rem, 6vw, 6.5rem);
  letter-spacing: -0.07em;
  line-height: 0.9;
  margin: 0;
}

.intro-scene > img {
  aspect-ratio: 2 / 1;
  border: 1px solid rgba(216, 173, 88, 0.65);
  display: block;
  height: auto;
  object-fit: cover;
  width: 100%;
}

.intro-dialogue {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin: -2rem 4vw 0;
  position: relative;
}

.intro-dialogue blockquote {
  background: var(--ivory);
  border-top: 4px solid var(--cyan);
  color: var(--charcoal);
  margin: 0;
  min-height: 9rem;
  padding: clamp(1.25rem, 2.5vw, 2.2rem);
}

.intro-dialogue blockquote:last-child { border-color: var(--gold); }
.intro-dialogue p { font-family: Georgia, serif; font-size: clamp(1.15rem, 2vw, 1.7rem); margin: 0 0 1.4rem; }
.intro-dialogue cite { color: #656057; font-family: var(--mono); font-size: 0.61rem; font-style: normal; text-transform: uppercase; }
.intro-aside, .intro-lesson { color: var(--ivory-dim); line-height: 1.6; margin: 1.5rem auto 0; max-width: 68rem; }
.intro-aside span { color: var(--gold); font-family: var(--mono); font-size: 0.65rem; margin-right: 1rem; text-transform: uppercase; }
.intro-lesson { border-left: 2px solid var(--cyan); color: var(--ivory); padding-left: 1.2rem; }

.intro-controls {
  align-items: center;
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.intro-controls button {
  background: transparent;
  border: 1px solid rgba(243, 237, 221, 0.35);
  color: var(--ivory);
  cursor: pointer;
  min-height: 2.75rem;
  padding: 0.65rem 0.9rem;
}

.intro-controls span { color: var(--ivory-dim); font-family: var(--mono); font-size: 0.65rem; }

@media (max-width: 620px) {
  .intro-scene { padding: 4rem 1.25rem; }
  .intro-dialogue { grid-template-columns: 1fr; margin: 1rem 0 0; }
  .intro-controls { flex-wrap: wrap; }
}
```

- [ ] **Step 5: Run the visual and story regression tests**

Run: `npm test -- app/page-review.test.ts app/intro-sequence.test.ts lib/intro-story.test.ts`

Expected: all focused tests pass.

- [ ] **Step 6: Commit the completed visual sequence**

```bash
git add public/images/two-ideas-right-angle.webp public/images/one-more-finger.webp app/globals.css app/page-review.test.ts
git commit -m "feat: illustrate the orthogonality prologue"
```

---

### Task 5: Full verification and story audit

**Files:**
- Verify: `app/intro-sequence.tsx`
- Verify: `app/globals.css`
- Verify: `lib/intro-story.ts`
- Verify: `lib/story-navigation.ts`

**Interfaces:**
- Consumes: the complete implementation from Tasks 1–4.
- Produces: a verified title → intro scenes → calculator → existing theatre experience.

- [ ] **Step 1: Audit the final source against the specification**

Confirm all of the following in the implementation:

```text
Title card remains first.
Scene I teaches two independent right-angle directions.
Scene II shows the failed third line and points toward high dimensions.
Both scenes have three persistent beats.
Left/Right changes beats and does not scroll.
Up/Down changes full sections.
Interactive focus suppresses keyboard shortcuts.
Reduced motion is respected.
Calculator estimate and experiment behavior are unchanged.
```

- [ ] **Step 2: Run all automated tests**

Run: `npm test`

Expected: every test file passes with zero failures.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no lint errors.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: Vinext completes all five build phases and reports `Build complete`.

- [ ] **Step 5: Inspect the final diff**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only planned implementation files and previously existing user changes are listed.
