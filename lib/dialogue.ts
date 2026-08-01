import type { SimulationResult } from "./simulation";

export type DialogueAction =
  | "test"
  | "explain"
  | "continue"
  | "change"
  | "retest";

export type DialogueBeat = {
  scene: "conjecture" | "audition" | "tribunal" | "closet";
  rosencrantz: string;
  guildenstern: string;
  aside: string;
  lesson: string;
  actions: DialogueAction[];
};

export type DialogueState =
  | { kind: "opening" | "dimension" | "angle" | "running"; seed: number }
  | { kind: "completed" | "capped"; seed: number; result: SimulationResult }
  | { kind: "invalid"; seed: number; errors: readonly string[] };

const opening: DialogueBeat = {
  scene: "conjecture",
  rosencrantz:
    "Behold: a room of arrows, each politely refusing to point at another.",
  guildenstern:
    "Politely, not perfectly. We have allowed them a narrow angle in which to misbehave.",
  aside: "Near-perpendicular is a tolerance band, not an exact right angle.",
  lesson:
    "Perfect orthogonality requires every pair to meet at exactly 90°. Near orthogonality accepts a band around 90°, which can admit far larger collections.",
  actions: ["test", "explain", "continue", "change"],
};

const dimension: DialogueBeat = {
  scene: "conjecture",
  rosencrantz:
    "Another dimension! The walls retreat whenever I begin to count them.",
  guildenstern:
    "And random arrows huddle nearer a right angle. High-dimensional geometry has peculiar manners.",
  aside: "More dimensions push random pairwise angles toward 90°.",
  lesson:
    "Concentration of measure means that, as dimension grows, the dot product of two random unit vectors is increasingly likely to sit near zero—so their angle is increasingly likely to sit near 90°.",
  actions: ["test", "explain", "continue", "change"],
};

const angle: DialogueBeat = {
  scene: "conjecture",
  rosencrantz: "Two degrees either way. Surely geometry will not notice.",
  guildenstern:
    "Geometry notices everything. With every pair examined, a little tolerance is multiplied many times.",
  aside: "Small changes to the angle band can move the capacity bounds sharply.",
  lesson:
    "Tolerance sensitivity comes from repeated pair constraints: widening the accepted angle band raises one pair’s pass probability, and that improvement compounds across all pairs in the collection.",
  actions: ["test", "explain", "continue", "change"],
};

const runningVariants: readonly DialogueBeat[] = [
  {
    scene: "audition",
    rosencrantz: "A new arrow approaches. It has rehearsed its right angle.",
    guildenstern:
      "First normalize it; then compare it with every member already admitted.",
    aside: "The experiment builds one concrete collection, candidate by candidate.",
    lesson:
      "The capacity card combines a guaranteed orthogonal basis with the Welch ceiling when that ceiling is finite. This experiment supplies separate constructive evidence: each random candidate is kept only if every tested pair lies inside the angle band.",
    actions: ["explain", "continue", "change"],
  },
  {
    scene: "audition",
    rosencrantz: "The candidates are endless. Their references are mostly angles.",
    guildenstern:
      "One poor introduction is enough for rejection. Continue the auditions.",
    aside: "An accepted vector must pass against the entire current cast.",
    lesson:
      "Construction is stricter than sampling a single good pair. A candidate must satisfy the tolerance against every vector already found, so later acceptances become progressively harder.",
    actions: ["explain", "continue", "change"],
  },
];

const completedVariants = [
  (result: SimulationResult): DialogueBeat => ({
    scene: "tribunal",
    rosencrantz: `${result.vectorsFound} vectors found! Ring the protractor like a bell.`,
    guildenstern:
      "Celebrate the construction, certainly. Leave the unknowable superlatives in the cloakroom.",
    aside: "The run verified a reproducible construction, not an optimal one.",
    lesson:
      "These are verified vectors found by one seeded greedy search. That is a constructive lower bound and useful evidence, but another method or seed may find more.",
    actions: ["retest", "explain", "continue", "change"],
  }),
  (result: SimulationResult): DialogueBeat => ({
    scene: "tribunal",
    rosencrantz: `We found ${result.vectorsFound}; they have all survived cross-examination.`,
    guildenstern:
      "For this seed and this method, yes. Geometry has not closed the case.",
    aside: "Verified means every pair in this returned collection was checked.",
    lesson:
      "The observed angle range confirms this particular collection obeys the requested tolerance. It demonstrates existence at this size without proving that a larger collection cannot exist.",
    actions: ["retest", "explain", "continue", "change"],
  }),
] as const;

const cappedVariants = [
  (result: SimulationResult): DialogueBeat => ({
    scene: "closet",
    rosencrantz: `We found ${result.vectorsFound}, and then the machinery requested an interval.`,
    guildenstern:
      "A computational limit is not a geometric verdict. The pairs alone have become a crowd.",
    aside: "The browser stopped at a practical budget; the geometry did not.",
    lesson:
      "Checking k accepted vectors can require about k(k−1)/2 comparisons: quadratic pair checking. Attempt, time, and memory caps keep the page responsive and do not bound what mathematics permits.",
    actions: ["retest", "explain", "continue", "change"],
  }),
  (result: SimulationResult): DialogueBeat => ({
    scene: "closet",
    rosencrantz: `${result.vectorsFound} found—and somewhere backstage, a clock has objected.`,
    guildenstern:
      "Clocks measure patience, not spherical codes. Record the evidence and name the stopping rule.",
    aside: "Stopping reasons describe the experiment’s budget, not the space’s capacity.",
    lesson:
      "Every new accepted vector must be compared with those before it, so total pair work grows quadratically. A capped run is still evidence, but its cap is an engineering boundary rather than a geometric one.",
    actions: ["retest", "explain", "continue", "change"],
  }),
] as const;

/** Returns the concise exchange and lesson that correspond to the live calculator state. */
export function getDialogue(state: DialogueState): DialogueBeat {
  switch (state.kind) {
    case "opening":
      return opening;
    case "dimension":
      return dimension;
    case "angle":
      return angle;
    case "running":
      return choose(runningVariants, state.seed);
    case "completed":
      return choose(completedVariants, state.seed)(state.result);
    case "capped":
      return choose(cappedVariants, state.seed)(state.result);
    case "invalid":
      return {
        scene: "conjecture",
        rosencrantz: "The numbers have declined their entrance.",
        guildenstern: `Quite right: ${state.errors[0] ?? "the proposed geometry is not defined."}`,
        aside: "Correct the marked field and the capacity result will return immediately.",
        lesson:
          "The calculator needs one positive integer dimension and two finite angles between 0° and 180°, with the lower angle strictly below the upper angle.",
        actions: ["change", "explain", "continue"],
      };
  }
}

function choose<T>(variants: readonly T[], seed: number): T {
  return variants[Math.abs(Math.trunc(seed)) % variants.length];
}
