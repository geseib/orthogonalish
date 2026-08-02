import {
  estimateRandomSet,
  estimateStoryTotal,
  type StoryEstimate,
} from "./estimate";

export type StoryScene =
  | "cold-open"
  | "title"
  | "right-angle"
  | "one-more"
  | "failed-demo"
  | "growth"
  | "shared-board";

export type GuidedInput = {
  dimension: number;
  lowerAngle: number;
  upperAngle: number;
};

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

export type StorySpeaker = "rosencrantz" | "guildenstern";

export type StoryDialogueTurn = {
  speaker: StorySpeaker;
  text: string;
  placement: BubblePlacement;
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
  dialogue?: readonly StoryDialogueTurn[];
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

const nearRightAngle = (dimension: number): GuidedInput => ({
  dimension,
  lowerAngle: 88,
  upperAngle: 92,
});

const rosencrantzBubble = {
  position: "upper-left",
  tail: "down-right",
} as const;

const guildensternBubble = {
  position: "lower-right",
  tail: "up-left",
} as const;

const twoSpeakerBubbles = {
  rosencrantz: rosencrantzBubble,
  guildenstern: guildensternBubble,
} as const;

const diagonalSharedBoardBubbles = {
  rosencrantz: { position: "upper-left", tail: "down-left" },
  guildenstern: { position: "lower-right", tail: "up-right" },
} as const;

const ensembleSharedBoardBubbles = {
  rosencrantz: { position: "lower-right", tail: "up-left" },
  guildenstern: { position: "upper-right", tail: "down-left" },
} as const;

export const storySteps: readonly StoryStep[] = [
  {
    id: "cold-open-result",
    scene: "cold-open",
    eyebrow: "Before the question",
    title: "More than I put in",
    image: "/images/rosencrantz-discovery.webp",
    alt: "Rosencrantz stands alone at a brass apparatus as cyan vector arrows multiply across the dark stage.",
    bubbles: { rosencrantz: rosencrantzBubble },
    rosencrantz:
      "The estimate gives one million, three hundred eighty-eight thousand, eight hundred sixty-four. That seems more than I put in.",
    aside: "He has stumbled onto the answer before hearing the question.",
    guidedInput: nearRightAngle(12_288),
  },
  {
    id: "cold-open-call",
    scene: "cold-open",
    eyebrow: "Before the question",
    title: "More than I put in",
    image: "/images/rosencrantz-discovery.webp",
    alt: "Rosencrantz stands alone at a brass apparatus as cyan vector arrows multiply across the dark stage.",
    bubbles: { rosencrantz: rosencrantzBubble },
    rosencrantz:
      "Guildenstern! The machine has produced more directions than it has dimensions.",
    aside: "The experimentalist has found a fact. An explanation has yet to arrive.",
    guidedInput: nearRightAngle(12_288),
  },
  {
    id: "title-question",
    scene: "title",
    eyebrow: "An argument in many dimensions",
    title: "How many arrows can stand nearly sideways?",
    rosencrantz: "I only turned the handle.",
    guildenstern: "Then we had better discover what the handle means.",
    aside:
      "How many directions can remain nearly perpendicular to every other direction?",
  },
  {
    id: "right-angle-meeting",
    scene: "right-angle",
    eyebrow: "Two different ideas",
    title: "A perfect right angle",
    image: "/images/two-ideas-right-angle.webp",
    alt: "Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle.",
    bubbles: twoSpeakerBubbles,
    rosencrantz:
      "Two lines. They have met and immediately agreed to face elsewhere.",
    guildenstern:
      "They meet at exactly 90°. Neither points even slightly along the other.",
    aside: "A right angle marks two completely separate directions.",
    contextPanel: {
      narrator:
        "A right angle is the cleanest possible separation: neither direction contains any part of the other.",
      term: {
        label: "Orthogonal",
        definition:
          "The mathematical word for directions that meet at exactly 90°.",
        llmConnection:
          "In a modern language model, two feature directions with a dot product near zero interfere very little when the shared activation space is read.",
      },
    },
  },
  {
    id: "right-angle-ideas",
    scene: "right-angle",
    eyebrow: "Two different ideas",
    title: "A perfect right angle",
    image: "/images/two-ideas-right-angle.webp",
    alt: "Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle.",
    bubbles: twoSpeakerBubbles,
    rosencrantz:
      "Suppose this line is one idea, and that line another. Can they interrupt each other?",
    guildenstern: "Not in this picture. Each has its own direction.",
    aside: "Perpendicular directions are a clean picture of distinct ideas.",
  },
  {
    id: "right-angle-two",
    scene: "right-angle",
    eyebrow: "Two different ideas",
    title: "A perfect right angle",
    image: "/images/two-ideas-right-angle.webp",
    alt: "Rosencrantz and Guildenstern examine two luminous lines meeting at a right angle.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "Two dimensions. Two ideas. A well-behaved universe.",
    guildenstern: "Enjoy it. We are about to relax the rules.",
    aside: "In two dimensions, two perfectly perpendicular directions fit.",
  },
  {
    id: "one-more-room",
    scene: "one-more",
    eyebrow: "Surely one more",
    title: "The finger that will not fit",
    image: "/images/one-more-finger.webp",
    alt: "Guildenstern forms an L with his fingers while Rosencrantz tries to place a third glowing line between them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz:
      "Your thumb and finger make two directions. There is plainly room between them.",
    guildenstern:
      "Room for a finger, perhaps. Not for a third direction nearly 90° from both.",
    aside: "The flat plane has already used its two independent directions.",
  },
  {
    id: "one-more-tolerance",
    scene: "one-more",
    eyebrow: "Surely one more",
    title: "The finger that will not fit",
    image: "/images/one-more-finger.webp",
    alt: "Guildenstern forms an L with his fingers while Rosencrantz tries to place a third glowing line between them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "I shall be generous: anywhere from 88° to 92°.",
    guildenstern:
      "Generosity has not made a third line fit. It has merely made the failure less tidy.",
    aside: "A small relaxation changes nothing obvious in two dimensions.",
  },
  {
    id: "one-more-dimension",
    scene: "one-more",
    eyebrow: "Surely one more",
    title: "The finger that will not fit",
    image: "/images/one-more-finger.webp",
    alt: "Guildenstern forms an L with his fingers while Rosencrantz tries to place a third glowing line between them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "Then add one dimension.",
    guildenstern: "Three dimensions, three obvious directions. Still ordinary.",
    aside: "Small spaces remain stubbornly one-for-one.",
    guidedInput: nearRightAngle(3),
  },
  {
    id: "failed-demo-report",
    scene: "failed-demo",
    eyebrow: "A result without a theory",
    title: "Guildenstern makes it sensible",
    image: "/images/grand-conjecture.webp",
    alt: "Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz:
      "The estimate gives 1,388,864 directions in 12,288 dimensions. The box was quite definite.",
    guildenstern: "A result arriving before its explanation is merely an ambush.",
    aside: "Rosencrantz brings the fact. Guildenstern requires it to become reasonable.",
    guidedInput: nearRightAngle(12_288),
  },
  {
    id: "failed-demo-ten",
    scene: "failed-demo",
    eyebrow: "A result without a theory",
    title: "Guildenstern makes it sensible",
    image: "/images/grand-conjecture.webp",
    alt: "Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "You have made the machine smaller.",
    guildenstern:
      "Ten dimensions. Now the experiment is small enough to understand.",
    aside: "Guildenstern simplifies the phenomenon until it almost disappears.",
    guidedInput: nearRightAngle(10),
  },
  {
    id: "failed-demo-ordinary",
    scene: "failed-demo",
    eyebrow: "A result without a theory",
    title: "Guildenstern makes it sensible",
    image: "/images/grand-conjecture.webp",
    alt: "Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "Ten directions. Your great explanation has discovered ten.",
    guildenstern: "An admirably ordinary result. The earlier number was suspect.",
    aside: "The theorist mistakes an ordinary example for the whole truth.",
    guidedInput: nearRightAngle(10),
  },
  {
    id: "failed-demo-handle",
    scene: "failed-demo",
    eyebrow: "A result without a theory",
    title: "Guildenstern makes it sensible",
    image: "/images/grand-conjecture.webp",
    alt: "Rosencrantz presents a field of cyan arrows while Guildenstern prepares to measure them.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "Or we could turn the handle and ask the world again.",
    guildenstern: "That is not a theory.",
    aside: "It is, however, an experiment.",
    guidedInput: nearRightAngle(10),
  },
  {
    id: "growth-hint",
    scene: "growth",
    eyebrow: "The numbers change character",
    title: "Multiplying room",
    image: "/images/exponential-prop-closet.webp",
    alt: "Nested cupboards and multiplying cyan arrows recede impossibly backstage.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "One hundred dimensions. The box says 113.",
    guildenstern: "A small excess. Possibly clerical.",
    aside: "At first, the advantage is easy to dismiss.",
    guidedInput: nearRightAngle(100),
  },
  {
    id: "growth-thousand",
    scene: "growth",
    eyebrow: "The numbers change character",
    title: "Multiplying room",
    image: "/images/exponential-prop-closet.webp",
    alt: "Nested cupboards and multiplying cyan arrows recede impossibly backstage.",
    bubbles: twoSpeakerBubbles,
    rosencrantz:
      "One thousand dimensions. The estimate gives two thousand, six hundred fifty-eight directions.",
    guildenstern: "The excess is becoming impertinent.",
    aside: "At 1,000 dimensions, the estimate has begun to pull away.",
    guidedInput: nearRightAngle(1_000),
  },
  {
    id: "growth-ten-thousand",
    scene: "growth",
    eyebrow: "The numbers change character",
    title: "Multiplying room",
    image: "/images/exponential-prop-closet.webp",
    alt: "Nested cupboards and multiplying cyan arrows recede impossibly backstage.",
    bubbles: twoSpeakerBubbles,
    rosencrantz:
      "Ten thousand dimensions. The estimate gives five hundred forty thousand, five hundred eighty-six directions.",
    guildenstern: "I withdraw clerical.",
    aside: "A tenfold increase in dimensions produced far more than ten times the capacity.",
    guidedInput: nearRightAngle(10_000),
  },
  {
    id: "growth-comparison",
    scene: "growth",
    eyebrow: "The numbers change character",
    title: "Multiplying room",
    image: "/images/exponential-prop-closet.webp",
    alt: "Nested cupboards and multiplying cyan arrows recede impossibly backstage.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "So the room is not merely getting larger.",
    guildenstern: "No. Each increase makes the next increase more consequential.",
    aside: "The growth is multiplying rather than merely adding.",
    guidedInput: nearRightAngle(10_000),
  },
  {
    id: "growth-name",
    scene: "growth",
    eyebrow: "The numbers change character",
    title: "Exponential growth",
    image: "/images/exponential-prop-closet.webp",
    alt: "Nested cupboards and multiplying cyan arrows recede impossibly backstage.",
    bubbles: twoSpeakerBubbles,
    rosencrantz: "Multiplying room.",
    guildenstern:
      "Exponential growth with dimension. Your phrase is less dignified and more memorable.",
    aside:
      "With a fixed near-right-angle tolerance, possible directions can grow exponentially with dimension.",
    guidedInput: nearRightAngle(10_000),
  },
  {
    id: "board-empty",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "Six boxes",
    image: "/images/shared-board-empty.webp",
    alt: "Six numbered boxes sit on a shared theatrical board.",
    rosencrantz: "They have declined their assignments. They are only boxes.",
    guildenstern:
      "Six boxes. One might assign a meaning to each and proceed sensibly.",
    aside: "The boxes share their work.",
    bubbles: diagonalSharedBoardBubbles,
    contextPanel: {
      narrator:
        "A model's working numbers act like shared scratch space. Individual positions need not have fixed human meanings.",
    },
    prop: {
      kind: "boxes",
      label: "Six boxes",
      values: ["1", "2", "3", "4", "5", "6"],
    },
  },
  {
    id: "board-fingerprint",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "A fingerprint, not a drawer",
    image: "/images/shared-board-fingerprint.webp",
    alt: "The word MONEY spans six boxes as a distributed pattern.",
    rosencrantz:
      "So the idea is nowhere in particular, but unmistakably everywhere?",
    guildenstern: "MONEY is not in a box. It is the pattern across all six.",
    aside: "The idea belongs to the whole board.",
    bubbles: diagonalSharedBoardBubbles,
    contextPanel: {
      narrator:
        "An idea can be represented by a distributed direction across the whole board.",
      term: {
        label: "Feature direction",
        definition:
          "A feature direction is a pattern of values across a shared space; the plus and minus signs here are a teaching model, while learned directions use varied continuous values.",
        llmConnection:
          "Language models can represent a feature as a direction spread across many coordinates rather than a single named slot.",
      },
    },
    prop: {
      kind: "boxes",
      label: "MONEY",
      values: ["+", "+", "−", "+", "−", "−"],
    },
  },
  {
    id: "board-writing",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "Writing with confidence",
    image: "/images/shared-board-writing.webp",
    alt: "DEPOSITED, CASH, and BANK add a MONEY pattern strongly to the board.",
    rosencrantz:
      "I deposited cash at the bank. The sentence appears rather sure of itself.",
    guildenstern:
      "Then it writes the MONEY pattern strongly. Confidence is how firmly the pattern is added.",
    aside: "The pattern can be written more or less strongly.",
    bubbles: diagonalSharedBoardBubbles,
    contextPanel: {
      narrator:
        "Writing an idea means adding some amount of its fingerprint to the shared board. This is an intuition, not a literal account of every model computation.",
    },
    prop: { kind: "tags", values: ["DEPOSITED", "CASH", "BANK"] },
  },
  {
    id: "board-cancellation",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "Reading by agreement",
    image: "/images/shared-board-cancellation.webp",
    alt: "MONEY is compared with RIVER, with three agreeing and three disagreeing signs.",
    rosencrantz:
      "The river is plainly present. The money inspector is simply unable to hear it.",
    guildenstern:
      "Three agreements. Three disagreements. Add them, and the river leaves no money behind.",
    aside: "The unrelated pattern cancels out.",
    bubbles: diagonalSharedBoardBubbles,
    contextPanel: {
      narrator:
        "The agreement score is a simplified dot product. Perpendicular patterns cancel to zero.",
      term: {
        label: "Dot product",
        definition:
          "A dot product adds the coordinate-by-coordinate agreements between two directions.",
        llmConnection:
          "A small dot product is one reason two model features can be read with relatively little direct interference.",
      },
    },
    prop: {
      kind: "boxes",
      label: "MONEY × RIVER",
      values: ["✓", "×", "✓", "×", "×", "✓"],
    },
  },
  {
    id: "board-cramped",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "Six is a cramped stage",
    image: "/images/shared-board-cramped.webp",
    alt: "A small six-box board shows an imbalance of two agreements out of six.",
    rosencrantz: "One stray agreement in six seems an awfully loud accident.",
    guildenstern:
      "Small boards magnify coincidence. This is why our earlier tiny spaces refused the trick.",
    aside: "A small board makes coincidence conspicuous.",
    bubbles: diagonalSharedBoardBubbles,
    contextPanel: {
      narrator:
        "Near-perpendicularity becomes useful only after the space is large enough for small imbalances to become proportionally tiny. The displayed numbers are illustrative of scale, not a deterministic outcome for every random fingerprint.",
      term: {
        label: "Tolerance",
        definition:
          "Tolerance is the small amount of overlap allowed when directions are nearly, rather than exactly, perpendicular.",
        llmConnection:
          "Model features need not be perfectly separate to be useful; their overlap only needs to be small enough for the task and activity level.",
      },
    },
    prop: {
      kind: "ratio",
      expression: "2 ÷ 6 = 33%",
      caption: "A small imbalance looms large.",
    },
  },
  {
    id: "board-vast",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "Twelve thousand boxes",
    image: "/images/shared-board-vast.webp",
    alt: "The six-box prop unfolds into a board of 12,288 marks.",
    rosencrantz: "There are more mistakes.",
    guildenstern:
      "In 12,288 boxes, ordinary coin-flip wobble leaves about 111 unmatched signs: less than one percent.",
    dialogue: [
      {
        speaker: "guildenstern",
        text:
          "In 12,288 boxes, ordinary coin-flip wobble leaves about 111 unmatched signs: less than one percent.",
        placement: { position: "lower-right", tail: "up-right" },
      },
      {
        speaker: "rosencrantz",
        text: "There are more mistakes.",
        placement: { position: "upper-left", tail: "down-left" },
      },
      {
        speaker: "guildenstern",
        text: "And far less mistake compared with the board.",
        placement: { position: "upper-right", tail: "down-right" },
      },
    ],
    aside: "The board grows faster than its ordinary wobble.",
    bubbles: diagonalSharedBoardBubbles,
    contextPanel: {
      narrator:
        "For unrelated random sign patterns, the typical normalized overlap is about 1 / sqrt(12,288), or 0.9%. The exact imbalance varies.",
      term: {
        label: "Interference",
        definition:
          "Interference is the unwanted overlap that makes one represented feature affect another when it is read.",
        llmConnection:
          "In language models, unrelated feature directions often have small overlap, but the amount and its effects vary with the learned features and context.",
      },
    },
    prop: { kind: "vast-board", count: 12_288 },
  },
  {
    id: "board-company",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "The whole play at once",
    image: "/images/shared-board-company.webp",
    alt: "Many named ideas share one illuminated theatrical board.",
    rosencrantz:
      "Then a single board may know kings, rivers, coins, deaths—and us?",
    guildenstern:
      "Millions of possible ideas. Only a modest company needs to be active in any one moment.",
    aside: "The active company matters.",
    bubbles: ensembleSharedBoardBubbles,
    contextPanel: {
      narrator:
        "Capacity depends strongly on how many features are active together, not only on how many have been learned.",
      term: {
        label: "Sparsity",
        definition:
          "Sparsity means that only a small fraction of possible features are strongly active at once.",
        llmConnection:
          "Sparse activity lets a language model draw on a large repertoire while reducing the chances that many strong features collide at the same moment.",
      },
    },
    prop: {
      kind: "tags",
      values: [
        "MONEY",
        "RIVER",
        "KING",
        "COIN",
        "FRIEND",
        "DEATH",
        "PAST",
        "QUESTION",
        "JOURNEY",
        "BETRAYAL",
      ],
    },
  },
  {
    id: "board-active",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "Presently active",
    image: "/images/shared-board-active.webp",
    alt: "An unseen call illuminates the Rosencrantz and Guildenstern fingerprints on the board.",
    rosencrantz: "Are we ideas?",
    guildenstern: "At present, rather active ones.",
    aside: "The characters leave before completing the discovery.",
    bubbles: twoSpeakerBubbles,
    contextPanel: {
      narrator:
        "A language model can hold an enormous repertoire because only a fraction of what it knows must speak strongly at each word.",
    },
    prop: { kind: "call", lines: ["ROSENCRANTZ!", "GUILDENSTERN!"] },
  },
] as const;

export function getGuidedEstimate(step: StoryStep): StoryEstimate | null {
  if (!step.guidedInput) return null;
  const { dimension, lowerAngle, upperAngle } = step.guidedInput;
  return estimateStoryTotal(
    estimateRandomSet(dimension, lowerAngle, upperAngle),
  );
}

export function moveStoryStep(
  currentIndex: number,
  direction: "previous" | "next",
): { index: number; sceneChanged: boolean } {
  const safeCurrent = Math.min(
    storySteps.length - 1,
    Math.max(0, currentIndex),
  );
  const delta = direction === "next" ? 1 : -1;
  const index = Math.min(
    storySteps.length - 1,
    Math.max(0, safeCurrent + delta),
  );

  return {
    index,
    sceneChanged:
      index !== safeCurrent &&
      storySteps[index].scene !== storySteps[safeCurrent].scene,
  };
}
