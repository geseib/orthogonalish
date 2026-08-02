# Single-Axis Story Deck Design

**Date:** 2026-08-02  
**Status:** Awaiting written-spec review

## Objective

Turn the current long-form theatre page into a responsive, reversible story deck. A visitor must be able to experience the entire lesson using only Down to advance and Up to go back. No dialogue, numerical reveal, or required interaction may depend on Left or Right.

The revised sequence must preserve the existing engraved theatrical style and the distinction between the characters: Rosencrantz learns by poking at the world and accidentally makes the discovery, while Guildenstern theorizes and nearly reasons the discovery out of existence.

## Core Interaction

The page has one ordered list of story steps. Each step identifies:

- the visible scene;
- the active dialogue beat;
- any calculator values or numerical reveal;
- the destination reached by the next Up or Down action.

Down advances exactly one step. Up reverses exactly one step. This applies equally to keyboard ArrowDown/ArrowUp and the persistent visible Down/Up controls.

When consecutive steps share artwork, the page remains aligned to the same viewport-sized scene while the dialogue and numerical content transition. When the next step belongs to another scene, the page scrolls exactly one scene forward. Up performs the exact inverse operation and restores the preceding dialogue and values.

Left and Right controls will be removed from the required interface. Horizontal arrow keys may be ignored rather than retained as a second navigation model.

Interactive fields protect normal keyboard behavior: ArrowUp and ArrowDown inside a number input continue to operate that input. The persistent story controls remain available outside the field.

## Viewport-Fit Contract

Every narrative scene is a single visual stage sized to the current browser viewport.

- Use the dynamic/small viewport units appropriate to the browser so mobile address bars do not create oversized panels.
- Each scene has a fixed viewport-height outer shell and a bounded inner composition.
- The inner composition scales its heading, artwork, dialogue, and controls using both viewport width and viewport height.
- Grid tracks must use bounded `minmax(0, …)` sizing so content cannot silently force a scene taller than its shell.
- Artwork may crop modestly with a deliberate focal position, but the principal geometric gesture and both characters must remain visible.
- Dialogue is limited to concise lines that fit without internal scrolling.
- Short-height desktop and landscape layouts receive a compact height-based treatment: smaller type, shallower artwork, tighter spacing, and reduced decorative copy.
- Narrow portrait layouts stack the composition while still fitting one step in the viewport. The artwork becomes shallower and the dialogue cards remain readable.
- Extremely small unsupported viewports may use a contained inner scroll as a last-resort accessibility fallback, but ordinary desktop, tablet, and phone sizes must not need it.

The document uses mandatory scroll alignment for narrative scenes, with reduced-motion behavior switching transitions to immediate movement.

## Persistent Navigation

A compact story controller remains in a consistent lower-right safe area:

- Up button;
- Down button;
- current step / total step indicator;
- concise accessible labels describing the destination.

The disabled state communicates the beginning and end of the sequence. Controls must not overlap dialogue or artwork at any supported breakpoint.

The first load opens on Rosencrantz’s solitary discovery. Down reveals the title, then continues through the lesson. After the final guided reveal, Down enters the free calculator. From the calculator onward, Up still returns to the final guided step, while ordinary page controls remain directly usable.

## Dramatic Sequence

### Cold Open — Rosencrantz Has Already Found It

1. Rosencrantz is alone with the apparatus, idly changing its dimension control without explaining what he is doing.
2. At 12,288 dimensions and 88–92°, the apparatus displays **1,388,864 vectors**. Rosencrantz observes: “That seems more than I put in.” The aside tells the audience that he has stumbled onto the answer before hearing the question.
3. He calls for Guildenstern. Before Guildenstern arrives, Down reveals the title and establishes the mystery: how can so many arrows remain nearly sideways to every other arrow?

### Act I — Two Different Ideas

4. Two perpendicular lines meet at exactly 90°.
5. Rosencrantz treats the lines as two ideas that do not interrupt each other.
6. They conclude that two dimensions hold two perfectly independent directions.

### Act II — Surely One More

7. Guildenstern makes an L with thumb and forefinger while Rosencrantz tries to place a third line between them.
8. They relax the rule to 88–92°, but a third nearly perpendicular direction still does not fit in the plane.
9. Three dimensions produce three obvious directions. The small examples appear stubbornly one-for-one.

### Act III — Guildenstern Makes It Sensible

10. Rosencrantz finally brings Guildenstern the 1,388,864 result he found in the cold open.
11. Guildenstern distrusts an answer that arrived before its explanation. Wishing to make the experiment sensible, he reduces it to 10 dimensions.
12. The answer is still 10. Rosencrantz laughs, perplexed that Guildenstern has made a remarkable discovery look ordinary; Guildenstern mistakes that ordinary result for insight.
13. Rather than debate Guildenstern’s theory, Rosencrantz reaches for the dimension control and begins turning it upward again.

### Act IV — The Numbers Change Character

14. At 100 dimensions, the displayed estimate is 113: only a hint of excess.
15. At 1,000 dimensions and 88–92°, the displayed estimate is 2,658 vectors.
16. At 10,000 dimensions and 88–92°, the displayed estimate is 540,586 vectors.
17. The transition emphasizes that multiplying the dimensions by ten increased the capacity by far more than ten.
18. Together they name the behavior **exponential growth with dimension**. Rosencrantz describes it in plain language as “multiplying room.”

The learner-facing aside states the fact without early jargon: for a fixed near-right-angle tolerance, the number of possible directions can grow exponentially with dimension. A later optional tooltip may identify the mathematical setting as a spherical-code or high-dimensional packing problem.

### Epilogue — Try the Machinery

19. The guided sequence releases the visitor into the existing calculator with 10,000 and 88–92° already visible.
20. The visitor may choose presets or enter custom values, test a construction, and open deeper explanations.

## Numerical Behavior

The guided story reuses the existing estimate implementation rather than duplicating arithmetic in presentation components.

- 3 dimensions at 88–92° displays 3.
- 10 dimensions at 88–92° displays 10.
- 100 dimensions at 88–92° displays 113.
- 1,000 dimensions at 88–92° displays 2,658.
- 10,000 dimensions at 88–92° displays 540,586.
- 12,288 dimensions at 88–92° displays 1,388,864.
- Exact 90°/90° remains one-for-one: 1,000 dimensions displays exactly 1,000 vectors and 10,000 displays exactly 10,000.
- Guided values are deterministic and floor-rounded in the same manner as the free calculator.
- Learner-facing copy calls these figures illustrative estimates of the exponential trend, not exact known maxima.

## Component Boundaries

### Story data

A single data module defines ordered story steps, scene identity, dialogue, asides, guided calculator values, and step labels. Narrative copy and order do not live inside navigation code.

### Story controller

A pure navigation unit resolves previous/next steps, boundary states, and whether the current action updates content in place or changes scene. It is independently testable.

### Story deck

The client component owns the active guided step, renders the current scene state, synchronizes the URL/scroll position when appropriate, and exposes the persistent Up/Down controls.

### Calculator bridge

The guided deck communicates its final values to the existing calculator through a narrow callback or shared state. The calculator remains the single source of truth for user-editable inputs and estimates.

### Responsive stage styles

The stage shell and its height-based/narrow-layout variants live in the existing design system stylesheet. Decorative artwork and typography remain consistent with the current theatre.

## State and Navigation Rules

- Only one active story step exists at a time.
- A Down action cannot skip a beat, even when pressed repeatedly during a transition.
- An Up action restores the exact previous step, including guided dimensions and displayed estimate.
- Smooth transitions are short and lock out duplicate advancement until alignment completes.
- Direct anchor navigation resolves to the first step of that scene.
- Browser refresh at a guided scene produces a coherent first beat rather than an empty or mismatched stage.
- Reduced-motion users receive immediate content changes and scrolling.
- Focus remains on the initiating control when appropriate; dialogue updates use a polite live region and do not steal focus.

## Error and Edge Behavior

- If a referenced scene element is unavailable, navigation leaves the current step unchanged rather than jumping unpredictably.
- Resize events recompute layout without changing the active story step.
- Input validation and worker errors remain contained in the calculator and experiment portions of the page.
- The guided numerical story never launches the expensive vector-construction worker; it displays the deterministic estimate only.

## Testing and Acceptance Criteria

### Navigation

- Repeated Down advances through every ordered story step and reaches the calculator without any Left/Right action.
- Repeated Up retraces every step in reverse order.
- Boundaries do not wrap.
- Inputs retain their native arrow-key behavior.
- Rapid repeated actions cannot skip steps.

### Story

- Tests preserve the exact ordered beats: Rosencrantz’s solitary 12,288/1,388,864 discovery, small-dimensional disappointment, Guildenstern’s failed simplification, Rosencrantz’s intervention, 1,000/2,658, 10,000/540,586, and the exponential-growth conclusion.
- No required line is accessible only through a horizontal control.

### Layout

- Browser checks cover representative wide desktop, short desktop, tablet portrait, phone portrait, and phone landscape viewports.
- Each guided scene’s outer bounds match the visual viewport within a small rounding tolerance.
- Persistent navigation never overlaps dialogue or the key geometric gesture.
- No ordinary tested viewport shows page content clipped below the step boundary.

### Regression

- Existing estimate, exact-orthogonality, validation, simulation, accessibility, lint, and production-build checks remain green.
- The 1,000 and 10,000 guided figures come from the same estimate function used by the calculator.

## Out of Scope

- Proving an exact spherical-code maximum.
- Adding advanced mathematical jargon to the introductory dialogue.
- Replacing the existing seeded construction experiment.
- Creating a second calculator.
- Reworking the established engraved illustration series except where a new discovery image is needed to make Act III legible.
