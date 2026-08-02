# Illustrated Dialogue and Shared Board Design

**Date:** 2026-08-02  
**Status:** Approved direction; written specification awaiting final review

## Purpose

Turn the Nearly Orthogonal Society from a lesson followed by a software experiment into one continuous illustrated argument. Rosencrantz and Guildenstern should discover not only that nearly orthogonal capacity grows dramatically in high dimensions, but why that geometry is useful: it lets a language model represent many ideas in one shared space while keeping unrelated ideas from interfering strongly.

The completed experience should remain playful, elegant, and legible to a reader with no mathematical background. Technical precision belongs in optional tooltips and asides rather than in the main dialogue.

## Decisions

- Remove the calculator, seeded construction, test controls, evidence panel, and their secondary dialogue system from the public lesson.
- Preserve the verified numerical story already used in the guided sequence: 10, 100, 1,000, 10,000, and 12,288 dimensions.
- Keep one linear story axis. Down advances exactly one beat; Up reverses exactly one beat. Left and Right are never required.
- Put character dialogue in speech bubbles over the illustration.
- Put the narrator's explanation and the lesson's conclusion in a dedicated sidebar.
- Put optional mathematical and modern-LLM depth behind accessible term tooltips.
- Extend the story with an eight-panel Shared Board act and an existential final beat.
- Generate new artwork only after the dialogue and panel sequence are fixed by this specification.

## Division of Labor on Every Panel

### Illustration

The illustration establishes the physical joke or visual model. It must remain the dominant element and continue the antique engraved theatrical style already established by the site.

### Speech bubbles

Speech bubbles contain only dialogue. They use warm, lightly textured ivory paper, fine irregular ink borders, restrained character accents, soft shadows, and asymmetric tails. They should feel printed into the illustration rather than placed on top by a modern interface.

Bubble width follows its text within responsive limits. Placement is chosen per illustration so bubbles occupy negative space and their tails point toward the correct character. Rosencrantz retains the cyan accent; Guildenstern retains the gold accent.

### Narrator sidebar

The right sidebar explains what the scene establishes. It is the authoritative teaching voice and absorbs the role of the current Aside. It may contain:

- a concise narrative statement;
- the existing aside;
- one optional “Look closer” term.

It must never read like a technical reference manual. A reader who ignores every tooltip must still understand the full lesson.

### Tooltips

Technical terms appear as understated dotted links with a small question mark. They open on hover and keyboard focus; touch users can tap to focus them. Each tooltip contains two short layers:

1. a plain mathematical definition;
2. a clearly labeled connection to modern language models.

Likely terms include Orthogonal, Dot product, Tolerance, Dimension, Feature direction, Residual stream, Superposition, Interference, and Sparsity. Only one tooltip should normally appear on a panel.

## Story Structure

## Act I — The Accidental Result

Retain the current cold open. Rosencrantz alone produces an estimate of 1,388,864 vectors at 12,288 dimensions and calls for Guildenstern. The question is then introduced.

The narrator makes clear that this is an illustrative estimate of the exponential trend, not a claim that the exact optimum is known.

## Act II — Small Spaces Refuse the Trick

Retain the existing right-angle and finger scenes:

1. Two perpendicular directions illustrate two cleanly separated ideas.
2. Allowing 88°–92° does not create an obvious third direction in two dimensions.
3. Adding a third dimension produces three ordinary directions.

The first right-angle panel remains the reference implementation for the complete format. Its narrator sidebar defines the separation, and its Orthogonal tooltip connects a near-zero dot product with low feature interference in a language model.

## Act III — Guildenstern Makes the Discovery Disappear

Retain the current comic inversion:

1. Rosencrantz reports the 12,288-dimensional result.
2. Guildenstern reduces the example to ten dimensions.
3. Ten dimensions produce ten directions and make the discovery look ordinary.
4. Rosencrantz turns the handle again.

The sidebar should emphasize the experimental lesson without using jargon: a phenomenon may be invisible in a small example even when the small example is correct.

## Act IV — Multiplying Room

Retain the numerical escalation:

- 100 dimensions → 113 estimated vectors;
- 1,000 dimensions → 2,658 estimated vectors;
- 10,000 dimensions → 540,586 estimated vectors;
- 12,288 dimensions → 1,388,864 estimated vectors.

Rosencrantz calls it “multiplying room.” Guildenstern names exponential growth with dimension. The narrator distinguishes multiplying growth from merely adding one new direction per dimension.

## Act V — The Shared Board

This new act explains why the geometry matters. It uses a simplified plus/minus fingerprint as a teaching model. Tooltips note that real model directions contain varied continuous numbers rather than literal signs.

### Panel 1 — The board

**Visual:** Six numbered, otherwise meaningless boxes.

**Guildenstern:** “Six boxes. One might assign a meaning to each and proceed sensibly.”

**Rosencrantz:** “They have declined their assignments. They are only boxes.”

**Narrator:** A model's working numbers act like shared scratch space. Individual positions need not have fixed human meanings.

### Panel 2 — A fingerprint, not a drawer

**Visual:** MONEY appears as a plus/minus pattern spanning all six boxes.

**Guildenstern:** “MONEY is not in a box. It is the pattern across all six.”

**Rosencrantz:** “So the idea is nowhere in particular, but unmistakably everywhere?”

**Narrator:** An idea can be represented by a distributed direction across the whole board.

### Panel 3 — Writing with confidence

**Visual:** DEPOSITED, CASH, and BANK cause the MONEY pattern to be added strongly.

**Rosencrantz:** “I deposited cash at the bank. The sentence appears rather sure of itself.”

**Guildenstern:** “Then it writes the MONEY pattern strongly. Confidence is how firmly the pattern is added.”

**Narrator:** Writing an idea means adding some amount of its fingerprint to the shared board.

The sidebar should call this an intuition, not a literal account of every model computation.

### Panel 4 — Reading by agreement

**Visual:** MONEY is checked against RIVER. Three signs agree and three disagree.

**Guildenstern:** “Three agreements. Three disagreements. Add them, and the river leaves no money behind.”

**Rosencrantz:** “The river is plainly present. The money inspector is simply unable to hear it.”

**Narrator:** The agreement score is a simplified dot product. Perpendicular patterns cancel to zero.

### Panel 5 — Six is a cramped stage

**Visual:** A small imbalance is shown as roughly 2 ÷ 6 = 33%.

**Rosencrantz:** “One stray agreement in six seems an awfully loud accident.”

**Guildenstern:** “Small boards magnify coincidence. This is why our earlier tiny spaces refused the trick.”

**Narrator:** Near-perpendicularity becomes useful only after the space is large enough for small imbalances to become proportionally tiny.

The displayed numbers are illustrative of scale, not a deterministic outcome for every random fingerprint.

### Panel 6 — Twelve thousand boxes

**Visual:** The six-box prop unfolds into a field of 12,288 marks.

**Guildenstern:** “In 12,288 boxes, ordinary coin-flip wobble leaves about 111 unmatched signs: less than one percent.”

**Rosencrantz:** “There are more mistakes.”

**Guildenstern:** “And far less mistake compared with the board.”

**Narrator:** For unrelated random sign patterns, the typical normalized overlap is about `1 / sqrt(12,288)`, or 0.9%. The exact imbalance varies.

### Panel 7 — The whole play at once

**Visual:** MONEY, RIVER, KING, COIN, FRIEND, DEATH, PAST, QUESTION, JOURNEY, and BETRAYAL share the board.

**Rosencrantz:** “Then a single board may know kings, rivers, coins, deaths—and us?”

**Guildenstern:** “Millions of possible ideas. Only a modest company needs to be active in any one moment.”

**Narrator:** Capacity depends strongly on how many features are active together, not only on how many have been learned.

### Panel 8 — Presently active

**Visual:** An unseen voice calls “Rosencrantz! Guildenstern!” and two fingerprints illuminate.

**Rosencrantz:** “Are we ideas?”

**Guildenstern:** “At present, rather active ones.”

**Narrator:** A language model can hold an enormous repertoire because only a fraction of what it knows must speak strongly at each word.

The characters leave before completing the discovery.

## Accuracy Guardrails

- Say that capacity can grow exponentially with dimension under fixed near-orthogonal tolerance; do not describe the number of directions as literally unlimited.
- Preserve exact 90° behavior: in `d` dimensions, the lesson reports exactly `d` mutually orthogonal basis directions.
- Label the large near-orthogonal totals as illustrative estimates rather than exact maxima.
- Present plus/minus fingerprints as a teaching model. Real learned feature directions contain continuous values.
- Present the residual stream as a useful shared-board analogy, not the whole architecture of a transformer.
- Say that unrelated leakage tends to cancel under simplifying independence assumptions. Do not promise that a model is “never confused.”
- Emphasize sparsity: interference depends strongly on how many features are active together.

## Navigation and Responsive Behavior

- The story remains a sequence of discrete beats grouped into viewport-sized scenes.
- Down advances one beat, including every Shared Board panel; Up reverses one beat.
- A scene change scrolls exactly to the next viewport-sized panel. A same-scene dialogue change updates in place.
- The final Down press stops at the final existential panel. There is no calculator destination.
- Speech bubbles stay over artwork on desktop, mobile portrait, and short landscape screens. Font size and maximum width shrink before dialogue is moved outside the art.
- On narrow screens, the narrator panel becomes a compact row beneath the illustration while remaining inside the same viewport.
- Tooltips must remain within the viewport and work by hover, focus, and touch.
- Reduced-motion preferences continue to disable smooth transitions.

## Implementation Shape

- Extend the story-step data with explicit bubble placement, narrator copy, tooltip content, and artwork metadata.
- Keep story copy and presentation metadata in the story data rather than scattering scene-specific conditions through the React component.
- Extract reusable `SpeechBubble`, `NarratorPanel`, and `StoryTooltip` components from the approved prototype.
- Use per-panel placement tokens such as `upper-left`, `upper-right`, `lower-left`, and `lower-right`, plus tail-direction tokens. Do not encode each placement as one-off CSS.
- Simplify the page to the guided story and footer after removing the calculator and experiment.
- Remove browser-worker simulation code, dialogue state, and styles only after tests prove they have no remaining public consumer.
- Add the new engraved illustrations to `public/images` with consistent dimensions, palette, lighting, border treatment, and character designs.

## Verification

Automated checks must cover:

- the complete ordered story and exact numerical reveals;
- exactly one-step Down/Up movement without wrapping;
- the absence of calculator, test, worker, and evidence UI from the rendered lesson;
- accessible tooltip names and descriptions;
- tooltip activation by focus as well as hover;
- per-panel bubble placement metadata;
- exact 90° reporting;
- viewport sizing contracts for desktop, mobile portrait, and short landscape layouts;
- lint and production build.

A visual review should compare representative panels at desktop, mobile portrait, and short landscape sizes before the speech-bubble system is accepted across the entire story.

## Non-goals

- Teaching the Welch bound, spherical-code theory, or transformer architecture in the main dialogue.
- Claiming that the illustrative capacity estimator returns exact maxima.
- Turning the experience into a general-purpose vector laboratory.
- Adding free-form user inputs or another simulation after the final act.
- Making every technical term interactive.
