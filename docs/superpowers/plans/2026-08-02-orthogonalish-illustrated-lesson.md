# orthogonalish Illustrated Lesson Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current vector theatre into orthogonalish: one continuous illustrated lesson with speech-bubble dialogue, narrator sidebars, optional LLM tooltips, and an eight-panel Shared Board finale instead of a calculator and browser simulation.

**Architecture:** `lib/story-deck.ts` remains the source of truth for ordered story content, numerical inputs, illustration metadata, bubble placement, narrator copy, tooltips, and exact HTML prop overlays. A focused `StoryPanel` component renders one step; `GuidedStory` owns only sequence state and Up/Down navigation. The page becomes a thin story shell, while obsolete calculator, dialogue-state, simulation, and worker code is removed.

**Tech Stack:** React 19, TypeScript 5.9, Next.js-compatible App Router through vinext, CSS, Vitest, Next Image, built-in image generation for matching WebP illustrations.

## Global Constraints

- The public site name is **orthogonalish**, styled in lowercase everywhere.
- Down advances exactly one story beat; Up reverses exactly one beat; Left and Right are never required.
- Every story scene fits one visual viewport at desktop, mobile portrait, and short landscape sizes.
- Character dialogue belongs in speech bubbles over artwork; narrator copy belongs in the sidebar.
- Tooltips are optional depth and must work on hover, keyboard focus, and touch.
- Exact 90° remains one-for-one: `d` dimensions reports exactly `d` mutually orthogonal basis directions.
- Large near-orthogonal totals remain labeled illustrative estimates, not exact maxima.
- Plus/minus fingerprints are explicitly a teaching model; real learned directions use continuous values.
- The calculator, test controls, seeded construction, worker, and evidence panel do not remain in the public lesson.
- Preserve the approved one-panel prototype currently present as uncommitted changes in `app/globals.css`, `app/guided-story.tsx`, `lib/story-deck.ts`, and `lib/story-deck.test.ts`; refactor it rather than reverting it.

---

## File Map

### Create

- `app/story-panel.tsx` — presentational renderer for illustration, exact prop overlay, bubbles, narrator sidebar, and tooltip.
- `app/story-panel.test.ts` — rendering-contract tests for placements and accessible optional depth.
- `public/images/shared-board-empty.webp`
- `public/images/shared-board-fingerprint.webp`
- `public/images/shared-board-writing.webp`
- `public/images/shared-board-cancellation.webp`
- `public/images/shared-board-cramped.webp`
- `public/images/shared-board-vast.webp`
- `public/images/shared-board-company.webp`
- `public/images/shared-board-active.webp`

### Modify

- `lib/story-deck.ts` — complete story schema and all approved old/new beats.
- `lib/story-deck.test.ts` — story order, estimates, placement, tooltips, and Shared Board accuracy.
- `app/guided-story.tsx` — sequence controller using `StoryPanel`, with no calculator bridge.
- `app/guided-story.test.ts` — one-axis navigation and final-step behavior.
- `app/page.tsx` — thin orthogonalish story page and footer.
- `app/globals.css` — reusable illustrated-panel system and removal of retired UI styles.
- `app/layout.tsx` — orthogonalish metadata and social copy.
- `app/page-review.test.ts` — replace calculator regressions with final story/branding/accessibility contracts.
- `tests/rendered-html.test.mjs` — assert the final lesson and absence of experiment UI.
- `package.json` and `package-lock.json` — package name `orthogonalish`.
- `README.md` — project-specific documentation.

### Delete

- `app/vector-worker.ts`
- `app/vector-worker.test.ts`
- `lib/dialogue.ts`
- `lib/dialogue.test.ts`
- `lib/simulation.ts`
- `lib/simulation.test.ts`

---

### Task 1: Complete the Story Data Contract and Shared Board Script

**Files:**
- Modify: `lib/story-deck.ts`
- Modify: `lib/story-deck.test.ts`

**Interfaces:**
- Produces: `StoryStep`, `StoryTooltip`, `StoryProp`, `BubblePlacement`, `storySteps`, `getGuidedEstimate(step)`, and `moveStoryStep(index, direction)`.
- Consumes: `estimateRandomSet` and `estimateStoryTotal` from `lib/estimate.ts`.

- [ ] **Step 1: Write failing tests for the final ordered sequence**

Add literal assertions that the eight new IDs appear after `growth-name`, in this order:

```ts
expect(storySteps.slice(-8).map((step) => step.id)).toEqual([
  "board-empty",
  "board-fingerprint",
  "board-writing",
  "board-cancellation",
  "board-cramped",
  "board-vast",
  "board-company",
  "board-active",
]);
expect(storySteps.at(-1)?.rosencrantz).toBe("Are we ideas?");
expect(storySteps.at(-1)?.guildenstern).toBe(
  "At present, rather active ones.",
);
```

- [ ] **Step 2: Write failing tests for numerical and accuracy guardrails**

```ts
expect(getGuidedEstimate(storySteps.find((step) => step.id === "growth-ten-thousand")!)?.total)
  .toBe(540_586);
expect(getGuidedEstimate(storySteps.find((step) => step.id === "cold-open-result")!)?.total)
  .toBe(1_388_864);

const vast = storySteps.find((step) => step.id === "board-vast")!;
expect(vast.contextPanel?.narrator).toMatch(/varies|typical/i);
expect(vast.contextPanel?.term?.llmConnection).not.toMatch(/unlimited|never confused/i);
```

- [ ] **Step 3: Write failing tests for explicit presentation metadata**

Require every illustrated two-speaker step to specify both bubble placements, and every Shared Board step to provide a narrator panel and image:

```ts
const sharedBoard = storySteps.filter((step) => step.scene === "shared-board");
expect(sharedBoard).toHaveLength(8);
expect(sharedBoard.every((step) => step.image && step.contextPanel)).toBe(true);
expect(sharedBoard.every((step) => step.bubbles?.rosencrantz)).toBe(true);
expect(
  storySteps
    .filter((step) => step.guildenstern && step.image)
    .every((step) => step.bubbles?.guildenstern),
).toBe(true);
```

- [ ] **Step 4: Run the story tests and verify RED**

Run: `npm test -- lib/story-deck.test.ts`

Expected: FAIL because `shared-board`, `StoryProp`, and the eight final steps do not exist.

- [ ] **Step 5: Define the reusable story types**

Use these exact public shapes:

```ts
export type BubblePosition =
  | "upper-left"
  | "upper-right"
  | "lower-left"
  | "lower-right";

export type BubbleTail =
  | "down-left"
  | "down-right"
  | "up-left"
  | "up-right";

export type BubblePlacement = {
  position: BubblePosition;
  tail: BubbleTail;
};

export type StoryTooltip = {
  label: string;
  definition: string;
  llmConnection: string;
};

export type StoryProp =
  | { kind: "boxes"; label: string; values: readonly string[] }
  | { kind: "tags"; values: readonly string[] }
  | { kind: "ratio"; expression: string; caption: string }
  | { kind: "vast-board"; count: 12_288 }
  | { kind: "call"; lines: readonly [string, string] };

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
  bubbles?: {
    rosencrantz: BubblePlacement;
    guildenstern?: BubblePlacement;
  };
  contextPanel?: {
    narrator: string;
    term?: StoryTooltip;
  };
  prop?: StoryProp;
  guidedInput?: GuidedInput;
};
```

Add `"shared-board"` to `StoryScene`.

- [ ] **Step 6: Encode the complete approved Shared Board act**

Copy the eight panels verbatim from the approved design specification. Use these exact image paths and prop overlays:

```ts
"board-empty"        -> "/images/shared-board-empty.webp", boxes ["1","2","3","4","5","6"]
"board-fingerprint"  -> "/images/shared-board-fingerprint.webp", boxes ["+","+","−","+","−","−"]
"board-writing"      -> "/images/shared-board-writing.webp", tags ["DEPOSITED","CASH","BANK"]
"board-cancellation" -> "/images/shared-board-cancellation.webp", boxes ["✓","×","✓","×","×","✓"]
"board-cramped"      -> "/images/shared-board-cramped.webp", ratio "2 ÷ 6 = 33%"
"board-vast"         -> "/images/shared-board-vast.webp", vast-board count 12_288
"board-company"      -> "/images/shared-board-company.webp", tags ["MONEY","RIVER","KING","COIN","FRIEND","DEATH","PAST","QUESTION","JOURNEY","BETRAYAL"]
"board-active"       -> "/images/shared-board-active.webp", call ["ROSENCRANTZ!","GUILDENSTERN!"]
```

Use plus/minus language only in the teaching panels. Put the continuous-value caveat in the `Feature direction` tooltip.

- [ ] **Step 7: Add placement and narrator metadata to the existing acts**

For each shared illustration, choose positions from the four placement tokens by inspecting the negative space. Preserve the approved reference placement:

```ts
bubbles: {
  rosencrantz: { position: "upper-left", tail: "down-right" },
  guildenstern: { position: "lower-right", tail: "up-left" },
}
```

Every existing aside moves into `contextPanel.narrator` or remains in `aside` as the shorter concluding line. Do not add more than one tooltip per step.

- [ ] **Step 8: Run the story tests and verify GREEN**

Run: `npm test -- lib/story-deck.test.ts`

Expected: all story-deck tests pass.

- [ ] **Step 9: Commit the story contract**

```bash
git add lib/story-deck.ts lib/story-deck.test.ts
git commit -m "feat: complete the orthogonalish story script"
```

---

### Task 2: Extract the Illustrated Story Panel System

**Files:**
- Create: `app/story-panel.tsx`
- Create: `app/story-panel.test.ts`
- Modify: `app/guided-story.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `StoryStep`, `StoryProp`, and placement tokens from `lib/story-deck.ts`.
- Produces: `StoryPanel({ step, estimate, priority })` and reusable CSS classes keyed by data attributes.

- [ ] **Step 1: Write failing tests for semantic panel output**

Test the pure class/attribute helpers exported from `story-panel.tsx` rather than asserting source text:

```ts
expect(bubbleClassName({ position: "upper-left", tail: "down-right" }))
  .toBe("story-bubble position-upper-left tail-down-right");
expect(bubbleClassName({ position: "lower-right", tail: "up-left" }))
  .toBe("story-bubble position-lower-right tail-up-left");
```

Add a rendered contract test using `react-dom/server` for a step with a tooltip. Assert that output contains `role="tooltip"`, the term's accessible label, narrator heading, and both character citations.

- [ ] **Step 2: Run the panel tests and verify RED**

Run: `npm test -- app/story-panel.test.ts`

Expected: FAIL because `story-panel.tsx` does not exist.

- [ ] **Step 3: Extract focused components**

Implement these internal units in `app/story-panel.tsx`:

```tsx
export function StoryPanel(props: {
  step: StoryStep;
  estimate: StoryEstimate | null;
  priority?: boolean;
}) { /* compose the units below */ }

function SpeechBubble(props: {
  speaker: "rosencrantz" | "guildenstern";
  placement: BubblePlacement;
  children: React.ReactNode;
}) { /* blockquote + cite */ }

function NarratorPanel(props: {
  stepId: string;
  narrator: string;
  aside: string;
  term?: StoryTooltip;
}) { /* sidebar and optional StoryTooltip */ }

function TermTooltip(props: { stepId: string; term: StoryTooltip }) {
  /* button + role=tooltip; no hover-only div */
}

function StoryPropOverlay(props: { prop: StoryProp }) {
  /* exact text rendered as HTML, never baked into generated art */
}
```

- [ ] **Step 4: Replace prototype-specific branches with data-driven attributes**

Render bubble placement as classes from `bubbleClassName`. Render narrator content whenever `contextPanel` exists. `GuidedStory` should pass the active `StoryStep` into `StoryPanel`; it should no longer contain bubble, tooltip, narrator, Image, or prop markup.

- [ ] **Step 5: Refactor the approved CSS into reusable placement tokens**

Keep the approved parchment texture and visual treatment. Replace speaker-specific positioning with:

```css
.story-bubble.position-upper-left { left: var(--bubble-edge); top: var(--bubble-edge); }
.story-bubble.position-upper-right { right: var(--bubble-edge); top: var(--bubble-edge); }
.story-bubble.position-lower-left { bottom: var(--bubble-edge); left: var(--bubble-edge); }
.story-bubble.position-lower-right { bottom: var(--bubble-edge); right: var(--bubble-edge); }
.story-bubble.tail-down-right::after { bottom: -1.25rem; right: 1.35rem; }
.story-bubble.tail-up-left::after { left: 1.35rem; top: -1.25rem; }
```

Keep character identity in accent and citation color, not position.

- [ ] **Step 6: Make tooltip activation accessible on all inputs**

Use a button with `aria-expanded`, toggle state on click/tap, close on Escape and blur, and also expose the tooltip on hover/focus. The tooltip must be a sibling with `role="tooltip"` and a stable ID referenced by `aria-describedby`.

- [ ] **Step 7: Run component and existing story tests**

Run: `npm test -- app/story-panel.test.ts app/guided-story.test.ts lib/story-deck.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit the component system**

```bash
git add app/story-panel.tsx app/story-panel.test.ts app/guided-story.tsx app/globals.css
git commit -m "feat: stage dialogue inside illustrated panels"
```

---

### Task 3: Generate and Install the Shared Board Illustration Series

**Files:**
- Create: the eight `public/images/shared-board-*.webp` files listed in the File Map.

**Interfaces:**
- Consumes: image paths and alt text from `lib/story-deck.ts`.
- Produces: 2:1 WebP backgrounds with protected negative space for bubbles and exact HTML overlays.

- [ ] **Step 1: Establish the visual reference set**

Inspect these existing files before generation:

```text
public/images/two-ideas-right-angle.webp
public/images/rosencrantz-discovery.webp
public/images/exponential-prop-closet.webp
```

Use them as image references. Preserve the same Rosencrantz and Guildenstern designs, antique engraving, black theatrical stage, parchment border, cyan mathematical light, and brass/gold props.

- [ ] **Step 2: Generate eight backgrounds with one shared prompt spine**

The invariant prompt spine is:

```text
Antique late-Renaissance theatrical engraving on aged parchment, matching the supplied orthogonalish illustration series exactly. Rosencrantz is the curious younger experimentalist; Guildenstern is the severe older theorist. Dense black cross-hatching, restrained cyan mathematical light, brass and muted gold props, crisp parchment border, wide 2:1 stage composition. Reserve clean dark negative space at the specified character-relative bubble positions. Do not render speech bubbles, labels, words, letters, numbers, equations, or captions; exact information will be overlaid in HTML.
```

Add one scene-specific sentence for each approved panel: six-box prop, fingerprint lighting, contextual bank tokens, cancellation tribunal, cramped miniature stage, unfolding vast board, ensemble of symbolic props, and final unseen call with two illuminated signatures.

- [ ] **Step 3: Inspect every generated image before installation**

Reject images that change character identity, introduce readable text, place faces beneath planned bubbles, crop the parchment border, or depart from the established palette.

- [ ] **Step 4: Convert approved images to WebP**

Use `cwebp -q 90` and preserve a consistent 2:1 aspect ratio. Verify each file with `file` or `identify` and visually inspect the converted result.

- [ ] **Step 5: Run the story asset contract**

Add a test in `lib/story-deck.test.ts` that resolves every `step.image` under `public` and asserts it exists. Run:

`npm test -- lib/story-deck.test.ts`

Expected: PASS with all eight files present.

- [ ] **Step 6: Commit the illustration series**

```bash
git add public/images/shared-board-*.webp lib/story-deck.test.ts
git commit -m "feat: illustrate the shared-board finale"
```

---

### Task 4: Make the Lesson One Continuous Up/Down Story

**Files:**
- Modify: `app/guided-story.tsx`
- Modify: `app/guided-story.test.ts`
- Modify: `app/page.tsx`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `StoryPanel`, `storySteps`, `moveStoryStep`, and `getGuidedEstimate`.
- Produces: prop-less `GuidedStory()` ending at the final story step.

- [ ] **Step 1: Write failing navigation tests for the new ending**

Assert that the component has no `onGuidedInput`, `atCalculator`, `scrollTo("calculator")`, `Worker`, or experiment callback. Assert the visible step counter denominator equals `storySteps.length`, not `storySteps.length + 1`.

Add a pure navigation assertion:

```ts
expect(moveStoryStep(storySteps.length - 1, "next")).toEqual({
  index: storySteps.length - 1,
  sceneChanged: false,
});
```

- [ ] **Step 2: Update the rendered lesson test to require the finale and reject experiment UI**

Replace old positive assertions for `new Worker`, `Verified vectors found`, and `Estimated total vectors` with:

```ts
expect(storyDeck).toMatch(/Are we ideas\?/);
expect(storyDeck).toMatch(/At present, rather active ones/);
expect(page).not.toMatch(/new Worker|Test it|Verified vectors found|Candidate attempts/);
```

- [ ] **Step 3: Run navigation/rendered tests and verify RED**

Run: `npm test -- app/guided-story.test.ts tests/rendered-html.test.mjs`

Expected: FAIL because the calculator bridge and experiment page remain.

- [ ] **Step 4: Simplify `GuidedStory`**

Remove the prop type and guided-input effect. Keep only `activeIndex`, the transition lock, Up/Down keyboard handling, scene scrolling, and the controller. At the final step, disable Down; do not scroll to another section.

- [ ] **Step 5: Simplify `app/page.tsx`**

Replace the calculator state machine with:

```tsx
import { GuidedStory } from "./guided-story";

export default function Home() {
  return (
    <main>
      <GuidedStory />
      <footer>
        <p>orthogonalish</p>
        <p>Many directions. Very little interference.</p>
      </footer>
    </main>
  );
}
```

- [ ] **Step 6: Run navigation/rendered tests and verify GREEN**

Run: `npm test -- app/guided-story.test.ts tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the continuous lesson**

```bash
git add app/guided-story.tsx app/guided-story.test.ts app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: finish orthogonalish as one continuous story"
```

---

### Task 5: Remove the Retired Experiment System and Dead Styles

**Files:**
- Delete: `app/vector-worker.ts`
- Delete: `app/vector-worker.test.ts`
- Delete: `lib/dialogue.ts`
- Delete: `lib/dialogue.test.ts`
- Delete: `lib/simulation.ts`
- Delete: `lib/simulation.test.ts`
- Modify: `app/page-review.test.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the simplified page from Task 4.
- Produces: no public or internal calculator/simulation surface.

- [ ] **Step 1: Write a failing repository-surface regression**

In `app/page-review.test.ts`, enumerate `app` and `lib` and assert the retired module names are absent. Also assert that `page.tsx` contains no numeric input, preset, simulation status, or evidence panel.

- [ ] **Step 2: Run the regression and verify RED**

Run: `npm test -- app/page-review.test.ts`

Expected: FAIL because the retired files still exist.

- [ ] **Step 3: Delete worker, simulation, and secondary dialogue modules and tests**

Delete exactly the six files listed above. Do not delete `lib/estimate.ts`; the guided numerical reveals still consume it.

- [ ] **Step 4: Remove retired selectors from `app/globals.css`**

Remove calculator, evidence, old `.speech`, `.dialogue`, `.intro-*`, `.hero`, simulation progress, presets, form, and old stage selectors that no remaining JSX uses. Keep global tokens, focus styles, story panel styles, footer styles, and reduced-motion rules.

- [ ] **Step 5: Prove no retired import remains**

Run:

```bash
rg -n "vector-worker|lib/simulation|lib/dialogue|startSimulation|workerRef|EvidencePanel|calculator-shell" app lib tests
```

Expected: no matches except the explicit negative-regression strings inside tests.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`

Expected: PASS with the retired test files no longer counted.

- [ ] **Step 7: Commit the removal**

```bash
git add -A app lib tests
git commit -m "refactor: remove the retired vector experiment"
```

---

### Task 6: Brand and Document orthogonalish

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page-review.test.ts`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`

**Interfaces:**
- Produces: lowercase public brand, accurate metadata, and project README.

- [ ] **Step 1: Write failing branding tests**

Assert:

```ts
expect(JSON.parse(packageJson).name).toBe("orthogonalish");
expect(JSON.parse(packageLock).name).toBe("orthogonalish");
expect(layout).toMatch(/const title = "orthogonalish"/);
expect(layout).toMatch(/illustrated lesson/i);
expect(layout).not.toMatch(/Nearly Orthogonal Society|Estimate—and then test/);
```

- [ ] **Step 2: Run branding tests and verify RED**

Run: `npm test -- app/page-review.test.ts tests/rendered-html.test.mjs`

Expected: FAIL with the old site and package names.

- [ ] **Step 3: Update metadata and package identity**

Use:

```ts
const title = "orthogonalish";
const description =
  "An illustrated argument about near-orthogonal vectors, superposition, and how language models make room for meaning.";
```

Apply `title` consistently to standard metadata, Open Graph, Twitter, `siteName`, and image alt text. Change both root package names to `orthogonalish` without altering dependency versions.

- [ ] **Step 4: Rewrite the README**

The README must include these sections with project-specific content:

```md
# orthogonalish

An illustrated, interactive lesson starring Rosencrantz and Guildenstern...

## What it teaches
## How to read it
## Mathematical scope
## Development
## Project structure
## Verification
```

Document Up/Down navigation, speech bubbles, narrator sidebars, optional tooltips, the 90° exact baseline, the illustrative nature of large estimates, Node `>=22.13.0`, and `npm run dev`, `npm test`, `npm run lint`, and `npm run build`. Remove all starter, D1, Drizzle, authentication, and generic Sites boilerplate.

- [ ] **Step 5: Run branding tests and verify GREEN**

Run: `npm test -- app/page-review.test.ts tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit branding and README**

```bash
git add app/layout.tsx app/page-review.test.ts tests/rendered-html.test.mjs package.json package-lock.json README.md
git commit -m "docs: introduce orthogonalish"
```

---

### Task 7: Responsive, Accessibility, and Full-Story Verification

**Files:**
- Modify as required by findings: `app/globals.css`, `app/story-panel.tsx`, `app/guided-story.tsx`, and their tests.

**Interfaces:**
- Verifies the complete product; introduces no new narrative scope.

- [ ] **Step 1: Add viewport and reduced-motion contract tests**

Keep existing assertions for `100dvh`, `overflow: hidden`, `max-height: 700px`, `max-width: 620px`, short landscape, and reduced motion. Add assertions that narrow panels place `.story-context-panel` beneath the art while keeping bubbles over it.

- [ ] **Step 2: Add accessible tooltip behavior tests**

Test that tooltip buttons expose `aria-expanded`, Escape closes an open tooltip, blur closes it, and `role="tooltip"` remains connected through `aria-describedby`.

- [ ] **Step 3: Run focused tests and verify behavior**

Run:

`npm test -- app/story-panel.test.ts app/guided-story.test.ts app/page-review.test.ts`

Expected: PASS.

- [ ] **Step 4: Run live visual review when a preview server is available**

Check representative slides at:

```text
1440 × 900
1280 × 650
768 × 1024
390 × 844
844 × 390
```

At each size verify: no clipping, no horizontal overflow, bubble tails point toward the correct character, narrator copy remains legible, tooltip stays within the viewport, and each Down/Up action advances exactly one beat. If the managed sandbox blocks local sockets, record that limitation and perform the visual pass in the user's running preview rather than weakening automated checks.

- [ ] **Step 5: Fix each discovered defect with a failing regression first**

For every defect, add the smallest test that reproduces it, run the test to see RED, implement the correction, and run it again to see GREEN.

- [ ] **Step 6: Run final verification**

Run all commands fresh:

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Expected: all tests pass, lint exits zero, vinext reports `Build complete`, diff check is empty, and status contains only intentional files.

- [ ] **Step 7: Commit final polish if any files changed**

```bash
git add app lib tests public/images README.md package.json package-lock.json
git commit -m "fix: polish the complete orthogonalish lesson"
```

Do not create an empty commit when verification requires no corrections.
