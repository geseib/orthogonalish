# Orthogonalish — A Screenplay

**Logline:** In high-dimensional space, vectors can be *near*-orthogonal rather than perfectly perpendicular — and that small allowance changes everything. This piece teaches why near-orthogonal directions let an AI's embeddings pack far more features than it has dimensions: with a fixed "good enough" angle, the number of near-perpendicular directions grows exponentially with dimension, so a space of a few thousand dimensions can hold millions of distinct meanings. This is *superposition*, and it is why a model with only a few thousand embedding numbers can juggle an enormous vocabulary of ideas at once.

**The company:**
- **ROSENCRANTZ** — the experimentalist. He turns the handle, reads the machine, and trusts the result before anyone can explain it.
- **GUILDENSTERN** — the theorist. He demands that a result become *reasonable*, shrinks the problem until he understands it, and (nearly) talks himself out of the truth.

> This document is the editable source-of-truth screenplay for rewriting the story. Every line here corresponds to a field in `lib/story-deck.ts` (see "How to use this" at the end).

---

## ACT I — COLD OPEN
### *Before the question*

**Beat: `cold-open-result`**

VISUAL: Rosencrantz stands alone at a brass apparatus as cyan vector arrows multiply across the dark stage.

ROSENCRANTZ: The estimate gives one million, three hundred eighty-eight thousand, eight hundred sixty-four. That seems more than I put in.

`[MACHINE READS: 12,288 dimensions]`

NARRATOR — **How AI fits millions of ideas into a few thousand numbers**
An AI turns every word into a short list of numbers — a direction to point in. It has only a few thousand of these, yet it keeps millions of ideas from blurring together. Rosencrantz's machine just counted how many fit. Here's why it works.

LOOK CLOSER — Embedding: The short list of numbers an AI assigns to a word — its position, or direction, in meaning-space. (in an LLM: Every word you type into a chatbot becomes an embedding before the model does any reasoning with it.)

*He has stumbled onto the answer before hearing the question.*

---

**Beat: `cold-open-call`**

VISUAL: Rosencrantz stands alone at a brass apparatus as cyan vector arrows multiply across the dark stage.

ROSENCRANTZ: Guildenstern! The machine has produced more directions than it has dimensions.

`[MACHINE READS: 12,288 dimensions]`

*The experimentalist has found a fact. An explanation has yet to arrive.*

---

## ACT II — TITLE
### *An argument in many dimensions*

**Beat: `title-question`**

ROSENCRANTZ: I only turned the handle.

GUILDENSTERN: Then we had better discover what the handle means.

*How many directions can remain nearly perpendicular to every other direction?*

---

## ACT III — THE RIGHT ANGLE
### *Two different ideas*

**Beat: `right-angle-meeting`**

VISUAL: Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle.

ROSENCRANTZ: Two lines. They have met and immediately agreed to face elsewhere.

GUILDENSTERN: They meet at exactly 90°. Neither points even slightly along the other.

NARRATOR — **Two directions at 90° never get in each other's way**
Two arrows at a right angle don't lean toward each other at all — so you can use one without disturbing the other. That zero overlap is the cleanest way to keep two ideas apart.

LOOK CLOSER — Orthogonal: The math word for two directions that meet at exactly 90° — zero overlap. (in an LLM: When two features inside an AI point in orthogonal directions, reading one barely stirs the other.)

*A right angle marks two completely separate directions.*

---

**Beat: `right-angle-ideas`**

VISUAL: Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle.

ROSENCRANTZ: Suppose this line is one idea, and that line another. Can they interrupt each other?

GUILDENSTERN: Not in this picture. Each has its own direction.

NARRATOR — **Perpendicular means two ideas can't be confused**
Say one arrow means 'cat' and the other 'money'. At a right angle, turning one up adds nothing to the other — so separate directions can hold separate meanings without bleeding together.

LOOK CLOSER — Vector: A direction with a length — really just a list of numbers, one per dimension. (in an LLM: An AI represents each word as a vector; the way it points is what the word means.)

*Perpendicular directions are a clean picture of distinct ideas.*

---

**Beat: `right-angle-two`**

VISUAL: Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle.

ROSENCRANTZ: Two dimensions. Two ideas. A well-behaved universe.

GUILDENSTERN: Enjoy it. We are about to relax the rules.

NARRATOR — **Flatland offers exactly two clean directions**
A flat sheet has just two ways to move: up-and-down and left-and-right. Two axes, two ideas — no room for a third that doesn't lean on them. So far, capacity simply equals the number of dimensions.

[DIAGRAM: axes-2d]

LOOK CLOSER — Dimension: One coordinate in a vector; the dimension count is how many numbers each direction uses. (in an LLM: An embedding's size — its number of dimensions — sets how much raw room a model starts with before the trick multiplies it.)

*In two dimensions, two perfectly perpendicular directions fit.*

---

## ACT IV — SURELY ONE MORE
### *The finger that will not fit*

**Beat: `one-more-room`**

VISUAL: Guildenstern forms an L with his fingers while Rosencrantz tries to place a third glowing line between them.

ROSENCRANTZ: Your thumb and finger make two directions. There is plainly room between them.

GUILDENSTERN: Room for a finger, perhaps. Not for a third direction nearly 90° from both.

NARRATOR — **A flat plane can't hold a third sideways direction**
Any third arrow you draw here leans toward the thumb or the finger. With strict right angles, a space holds no more separate directions than it has dimensions — a ceiling far too low for a model that needs thousands.

*The flat plane has already used its two independent directions.*

---

**Beat: `one-more-tolerance`**

VISUAL: Guildenstern forms an L with his fingers while Rosencrantz tries to place a third glowing line between them.

ROSENCRANTZ: I shall be generous: anywhere from 88° to 92°.

GUILDENSTERN: Generosity has not made a third line fit. It has merely made the failure less tidy.

NARRATOR — **'Good enough' right angles are where the magic starts**
Relax the rule: 'sideways' now means anywhere from 88° to 92°. In 2D that still fits nothing new — but this bit of slack is the whole secret. With many dimensions, it lets huge numbers of directions crowd in while barely overlapping.

LOOK CLOSER — Cosine similarity: A score for how aligned two directions are: 1 means identical, 0 means a right angle, −1 means opposite. (in an LLM: AI models gauge how related two words are by the cosine similarity of their embeddings; near 0 means 'basically unrelated'.)

*A small relaxation changes nothing obvious in two dimensions.*

---

**Beat: `one-more-dimension`**

VISUAL: Guildenstern forms an L with his fingers while Rosencrantz tries to place a third glowing line between them.

ROSENCRANTZ: Then add one dimension.

GUILDENSTERN: Three dimensions, three obvious directions. Still ordinary.

`[MACHINE READS: 3 dimensions]`

NARRATOR — **Step into the room and a third direction appears**
Off the page and into a room: back-and-forth now joins up-and-down and left-and-right. That's a cube — three axes, three clean directions. Rosencrantz has the right instinct, to keep adding dimensions… but the trap is to stop at three and call the case closed. Does he press on, or settle for the tidy little cube?

[DIAGRAM: cube-3d]

*Small spaces remain stubbornly one-for-one.*

---

## ACT V — A RESULT WITHOUT A THEORY
### *Guildenstern makes it sensible*

**Beat: `failed-demo-report`**

VISUAL: Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.

ROSENCRANTZ: The estimate gives 1,388,864 directions in 12,288 dimensions. The box was quite definite.

GUILDENSTERN: A result arriving before its explanation is merely an ambush.

`[MACHINE READS: 12,288 dimensions]`

NARRATOR — **The machine claims 100× more directions than dimensions**
After 2D and 3D, this looks impossible: a hundred times more directions than dimensions. A number that large needs an explanation, not applause.

*Rosencrantz brings the fact. Guildenstern requires it to become reasonable.*

---

**Beat: `failed-demo-ten`**

VISUAL: Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.

ROSENCRANTZ: You have made the machine smaller.

GUILDENSTERN: Ten dimensions. Now the experiment is small enough to understand.

`[MACHINE READS: 10 dimensions]`

NARRATOR — **Shrink it to 10 dimensions and the effect nearly vanishes**
Shrink the space to ten dimensions and you get about ten directions — one per axis. Tiny spaces hide the effect entirely, which is why intuition built in 2D and 3D misleads.

LOOK CLOSER — Basis: A set of perpendicular axes that span a space; a space of D dimensions has exactly D of them. (in an LLM: If an AI used only these perfectly-perpendicular axes, it could store just one feature per dimension — a few thousand in all.)

*Guildenstern simplifies the phenomenon until it almost disappears.*

---

**Beat: `failed-demo-ordinary`**

VISUAL: Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.

ROSENCRANTZ: Ten directions. Your great explanation has discovered ten.

GUILDENSTERN: An admirably ordinary result. The earlier number was suspect.

`[MACHINE READS: 10 dimensions]`

NARRATOR — **A small, tidy example is not the whole law**
The theorist calls victory at ten and dismisses the million as a mistake. But the near-right-angle allowance is present here too — it just needs more dimensions before it does anything dramatic.

*The theorist mistakes an ordinary example for the whole truth.*

---

**Beat: `failed-demo-handle`**

VISUAL: Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.

ROSENCRANTZ: Or we could turn the handle and ask the world again.

GUILDENSTERN: That is not a theory.

`[MACHINE READS: 10 dimensions]`

NARRATOR — **When the theory stalls, run the experiment again**
Theory has stalled at ten; the experiment is willing to keep asking. Turning the dimension back up is the one move that reveals what small spaces were hiding.

*It is, however, an experiment.*

---

## ACT VI — THE NUMBERS CHANGE CHARACTER
### *Multiplying room*

**Beat: `growth-hint`**

VISUAL: Nested cupboards and multiplying cyan arrows recede impossibly backstage.

ROSENCRANTZ: One hundred dimensions. The box says 113.

GUILDENSTERN: A small excess. Possibly clerical.

`[MACHINE READS: 100 dimensions]`

NARRATOR — **At 100 dimensions, a small surplus finally appears**
A hundred dimensions gives about 113 directions — a few more than the axes. Easy to dismiss as rounding, but it's the first real interest paid by that 'good enough' angle.

LOOK CLOSER — Near-orthogonality: Directions that are close to, but not exactly, perpendicular — a little overlap is allowed. (in an LLM: Features inside an AI are almost never exactly perpendicular; being near-orthogonal is enough to keep them from interfering much.)

*At first, the advantage is easy to dismiss.*

---

**Beat: `growth-thousand`**

VISUAL: Nested cupboards and multiplying cyan arrows recede impossibly backstage.

ROSENCRANTZ: One thousand dimensions. The estimate gives two thousand, six hundred fifty-eight directions.

GUILDENSTERN: The excess is becoming impertinent.

`[MACHINE READS: 1,000 dimensions]`

NARRATOR — **At 1,000 dimensions, the surplus more than doubles**
A thousand dimensions gives over 2,600 directions — more than twice the axes. The slack that bought nothing in 2D now compounds with every dimension added. No longer a rounding error.

*At 1,000 dimensions, the estimate has begun to pull away.*

---

**Beat: `growth-ten-thousand`**

VISUAL: Nested cupboards and multiplying cyan arrows recede impossibly backstage.

ROSENCRANTZ: Ten thousand dimensions. The estimate gives five hundred forty thousand, five hundred eighty-six directions.

GUILDENSTERN: I withdraw clerical.

`[MACHINE READS: 10,000 dimensions]`

NARRATOR — **10,000 dimensions hold over 500,000 near-sideways directions**
Ten thousand dimensions gives over half a million directions — fifty times the axes. There's now room for far more ideas than there are slots to store them in. That surplus is the whole point.

LOOK CLOSER — Superposition: Fitting more features than you have dimensions by giving each one a near-perpendicular direction that only slightly overlaps the rest. (in an LLM: Superposition is how an AI crams far more learned concepts into its embedding space than it has dimensions.)

*A tenfold increase in dimensions produced far more than ten times the capacity.*

---

**Beat: `growth-comparison`**

VISUAL: Nested cupboards and multiplying cyan arrows recede impossibly backstage.

ROSENCRANTZ: So the room is not merely getting larger.

GUILDENSTERN: No. Each increase makes the next increase more consequential.

`[MACHINE READS: 12,288 dimensions]`

NARRATOR — **Capacity multiplies, it doesn't just add**
Each new dimension doesn't add a fixed number of directions — it multiplies what all the earlier ones could hold. Pushed all the way to the machine's 12,288 dimensions, that compounding lands on 1,388,864 — no clerical slip after all.

*The growth is multiplying rather than merely adding.*

---

**Beat: `growth-name`**

VISUAL: Nested cupboards and multiplying cyan arrows recede impossibly backstage.

ROSENCRANTZ: Multiplying room.

GUILDENSTERN: Exponential growth with dimension. Your phrase is less dignified and more memorable.

`[MACHINE READS: 12,288 dimensions]`

NARRATOR — **Near-sideways room grows exponentially with dimension**
With the angle fixed, the number of near-perpendicular directions grows exponentially with dimension. Why: in high dimensions, two random directions are almost always already nearly perpendicular. Run it out to the machine's full 12,288 dimensions and the count is 1,388,864 — exactly the cold-open's number, and the reason an AI has such outsized memory.

LOOK CLOSER — Embedding capacity: How many distinct near-perpendicular directions an embedding space can hold — far more than its dimension count. (in an LLM: It's why an AI with only a few thousand embedding dimensions can juggle an enormous vocabulary of features at once.)

*All the way up at 12,288 dimensions, the estimate is 1,388,864 — the number from the cold open.*

---

## ACT VII — THE SHARED BOARD

**Beat: `board-question`**

VISUAL: Guildenstern questions Rosencrantz as six numbered boxes appear on a shared theatrical board.

ROSENCRANTZ: Store things in them. Here — watch.

GUILDENSTERN: But why hoard so many dimensions — whatever will you do with them all?

[PROP: Six boxes — 1, 2, 3, 4, 5, 6]

NARRATOR — **The boxes ARE the numbers that make a direction**
Time to cash in that room. A 'direction' was only ever a list of numbers — and these boxes are those numbers, one each. So 'nearly perpendicular' from the arrow slides is exactly what's coming on the board: two patterns whose signs mostly cancel. Same idea, now with coordinates you can point at.

LOOK CLOSER — Coordinates: The individual numbers that pin down a direction — here, one value written in each box. (in an LLM: An AI's embedding is literally this list of numbers; each box is one coordinate the model reads and writes.)

*A direction is only useful once something is stored in it.*

---

**Beat: `board-empty`**

VISUAL: Six numbered boxes sit on a shared theatrical board.

ROSENCRANTZ: They have declined their assignments. They are only boxes.

GUILDENSTERN: Six boxes. One might assign a meaning to each and proceed sensibly.

[PROP: Six boxes — 1, 2, 3, 4, 5, 6]

NARRATOR — **The numbers are shared scratch space, not labeled drawers**
Six blank boxes. You could pin one fixed meaning to each — box 1 is 'money', box 2 is 'river' — but that wastes them. A model's numbers work more like shared scratch space: no single box owns a fixed meaning.

*The boxes share their work.*

---

**Beat: `board-fingerprint`**

VISUAL: The word MONEY spans six boxes as a distributed pattern.

ROSENCRANTZ: So the idea is nowhere in particular, but unmistakably everywhere?

GUILDENSTERN: MONEY is not in a box. It is the pattern across all six.

[PROP: MONEY — +, +, −, +, −, −]

NARRATOR — **An idea is a pattern across all the boxes, not one box**
'MONEY' isn't hiding in box 3. It's a fingerprint spread across all six boxes — a specific pattern of pluses and minuses. The idea belongs to the whole board at once.

LOOK CLOSER — Feature direction: A pattern of values spread across the whole space. The ± here is a teaching stand-in; real ones use smooth, varied numbers. (in an LLM: An AI can store a concept as a direction smeared across many coordinates rather than in one labeled slot.)

*The idea belongs to the whole board.*

---

**Beat: `board-writing`**

VISUAL: DEPOSITED, CASH, and BANK add a MONEY pattern strongly to the board.

ROSENCRANTZ: I deposited cash at the bank. The sentence appears rather sure of itself.

GUILDENSTERN: Then it writes the MONEY pattern strongly. Confidence is how firmly the pattern is added.

[PROP: Tags — DEPOSITED, CASH, BANK]

NARRATOR — **Confidence just means writing the pattern more strongly**
'I deposited cash at the bank' is sure it's about money, so it stamps the MONEY pattern on strongly. How firmly a pattern is written is just how confident the model is about that idea.

*The pattern can be written more or less strongly.*

---

**Beat: `board-cancellation`**

VISUAL: MONEY is compared with RIVER, with three agreeing and three disagreeing signs.

ROSENCRANTZ: The river is plainly present. The money inspector is simply unable to hear it.

GUILDENSTERN: Three agreements. Three disagreements. Add them, and the river leaves no money behind.

[PROP: MONEY × RIVER — ✓, ×, ✓, ×, ×, ✓]

NARRATOR — **Unrelated patterns cancel out to nearly zero**
Read the board for MONEY while RIVER is written: three boxes agree, three disagree, and they cancel to nearly nothing. That agreement score is the same ruler as the 'overlap' from the arrow slides — one measurement, two names. An unrelated idea leaves almost no trace.

LOOK CLOSER — Dot product: Add up the box-by-box agreements between two patterns — matches count positive, clashes negative. It's the same overlap measure as cosine similarity, just unnormalized. (in an LLM: A near-zero dot product is one reason two AI features can share the same space with little interference.)

*The unrelated pattern cancels out.*

---

**Beat: `board-cramped`**

VISUAL: A small six-box board shows an imbalance of two agreements out of six.

ROSENCRANTZ: One stray agreement in six seems an awfully loud accident.

GUILDENSTERN: Small boards magnify coincidence. This is why our earlier tiny spaces refused the trick.

[PROP: Ratio — 2 ÷ 6 = 33% — "A small imbalance looms large."]

NARRATOR — **On a tiny board, one accident looks huge**
With only six boxes, two stray agreements is already a third of the board — a loud 33%. Small boards make coincidence look huge, which is why the tiny 2D and 3D spaces refused the trick.

LOOK CLOSER — Tolerance: The small amount of overlap you allow when directions are nearly, rather than exactly, perpendicular. (in an LLM: AI features don't need to be perfectly separate — their overlap just has to stay small enough for the task.)

*A small board makes coincidence conspicuous.*

---

**Beat: `board-vast`**

VISUAL: The six-box prop unfolds into a board of 12,288 marks.

GUILDENSTERN: In 12,288 boxes, ordinary coin-flip wobble leaves about 111 unmatched signs: less than one percent.

ROSENCRANTZ: There are more mistakes.

GUILDENSTERN: And far less mistake compared with the board.

[PROP: Vast board — 12,288 marks]

NARRATOR — **In 12,288 boxes, the overlap shrinks to under 1%**
Blow the board up to 12,288 boxes and the same wobble leaves only about 111 mismatched signs — under 1%. Why: flip N coins and you land only about √N from even, a shrinking slice of N, so the typical overlap falls like 1/√N — here about 0.9%. And a 0.9% overlap per unrelated pair is exactly why a million near-perpendicular directions still fit in 12,288 dimensions.

LOOK CLOSER — Interference: The unwanted overlap that lets one stored idea bleed into another when you read it. (in an LLM: In an AI, unrelated feature directions usually overlap only a little, though how much varies with what was learned.)

*The board grows faster than its ordinary wobble.*

---

**Beat: `board-company`**

VISUAL: Many named ideas share one illuminated theatrical board.

ROSENCRANTZ: Then a single board may know kings, rivers, coins, deaths—and us?

GUILDENSTERN: Millions of possible ideas. Only a modest company needs to be active in any one moment.

[PROP: Tags — MONEY, RIVER, KING, COIN, FRIEND, DEATH, PAST, QUESTION, JOURNEY, BETRAYAL]

NARRATOR — **Millions can be stored; only a few speak at once**
One board can hold millions of possible ideas. What keeps that safe is sparsity: each pair barely overlaps, but if too many ideas fire at once the small overlaps pile up and interfere. Keep only a handful strongly active and the sum stays quiet.

LOOK CLOSER — Sparsity: Only a small fraction of all possible features are strongly active at any one time — the condition the trick requires. (in an LLM: The trick only holds while activity stays sparse: an AI can draw on a huge repertoire because few strong features collide at once, so their small overlaps never add up to real interference.)

*The active company matters.*

---

**Beat: `board-active`**

VISUAL: An unseen call illuminates the Rosencrantz and Guildenstern fingerprints on the board.

ROSENCRANTZ: Are we ideas?

GUILDENSTERN: At present, rather active ones.

[PROP: Call — "ROSENCRANTZ!" / "GUILDENSTERN!"]

NARRATOR — **A huge repertoire works because little of it speaks at once**
The two realize they might be ideas on the board too — presently active ones. That's the resolution: an AI holds an enormous store of concepts because only a fraction speaks strongly at each word.

*The characters leave before completing the discovery.*

---

## How to use this

This screenplay is the editable source-of-truth for the story. Edit the text here, then map your changes back to `lib/story-deck.ts`, where each beat is one entry in the `storySteps` array:

- The **beat label** is the step's `id` — use it to find the matching object.
- **VISUAL** comes from the step's `alt` (the illustration description); the image file is in `image`.
- **ROSENCRANTZ / GUILDENSTERN** lines come from `rosencrantz` and `guildenstern`. For beats rendered as a running exchange (e.g. `board-vast`), the lines come from the `dialogue` array, in speaking order.
- **`[MACHINE READS: N dimensions]`** reflects the step's `guidedInput.dimension`, which drives the on-screen estimate reveal. The spoken estimate numbers live in the dialogue itself.
- **NARRATOR** is the `contextPanel`: the **bold takeaway** is `heading`, the paragraph is `narrator`, and `[DIAGRAM: …]` reflects `contextPanel.diagram`.
- **LOOK CLOSER** is the `contextPanel.term` "Look closer" tooltip: `label`, `definition`, and the "in an LLM" note is `llmConnection`.
- **[PROP: …]** reflects the step's `prop` (boxes, tags, ratio, vast-board, or call).
- The closing *italic line* is the step's `aside`.
