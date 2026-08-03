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

export type StoryDiagram = "axes-2d" | "cube-3d";

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
    heading?: string;
    narrator: string;
    diagram?: StoryDiagram;
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
      "Eureka! The estimate gives one million, three hundred eighty-eight thousand, eight hundred sixty-four — that is far more than I put in!",
    aside: "He has stumbled onto the answer before hearing the question.",
    contextPanel: {
      heading: "How AI fits millions of ideas into a few thousand numbers",
      narrator:
        "An AI turns every word into a short list of numbers — a direction to point in. It has only a few thousand of these, yet it keeps millions of ideas from blurring together. Rosencrantz's machine just counted how many fit. Here's why it works.",
      term: {
        label: "Embedding",
        definition:
          "The short list of numbers an AI assigns to a word — its position, or direction, in meaning-space.",
        llmConnection:
          "Every word you type into a chatbot becomes an embedding before the model does any reasoning with it.",
      },
    },
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
      "Guildenstern — quickly, come and see! The machine has produced more directions than it has dimensions!",
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
      "Rosencrantz and Guildenstern explore a peculiar thing that happens when we think far beyond three dimensions — one of the very keys that let Large Language models be, well, large.",
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
      heading: "Two directions at 90° never get in each other's way",
      narrator:
        "It seems our discoverer has begun at the very foundation of dimensions — so shall we. Two arrows at a right angle lean not at all toward each other, so you can follow one without disturbing the other: zero overlap, the cleanest way to keep two ideas apart.",
      term: {
        label: "Orthogonal",
        definition:
          "The math word for two directions that meet at exactly 90° — zero overlap.",
        llmConnection:
          "When two features inside an AI point in orthogonal directions, reading one barely stirs the other.",
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
    contextPanel: {
      heading: "Perpendicular means two ideas can't be confused",
      narrator:
        "So now we understand: a vector pointing a particular way carries a meaning — 'cat', say, or 'money'. Charming, but hardly enough. What about dogs, chickens, debt, and love? Two tidy directions will not stretch nearly far enough.",
      term: {
        label: "Vector",
        definition:
          "A direction with a length — really just a list of numbers, one per dimension.",
        llmConnection:
          "An AI represents each word as a vector; the way it points is what the word means.",
      },
    },
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
    guildenstern:
      "OK — but that is not many ideas. What is your point, Rosencrantz?",
    aside: "In two dimensions, two perfectly perpendicular directions fit.",
    dialogue: [
      {
        speaker: "rosencrantz",
        text: "Two dimensions. Two ideas. A well-behaved universe.",
        placement: { position: "upper-left", tail: "down-right" },
      },
      {
        speaker: "guildenstern",
        text: "OK — but that is not many ideas. What is your point, Rosencrantz?",
        placement: { position: "lower-right", tail: "up-left" },
      },
      {
        speaker: "rosencrantz",
        text: "Bear with me, Guildenstern…",
        placement: { position: "lower-left", tail: "up-right" },
      },
    ],
    contextPanel: {
      heading: "Flatland offers exactly two clean directions",
      narrator:
        "Guildenstern has a fair point: a flat sheet offers only two clean directions — up-and-down and left-and-right — so only two ideas. For now, capacity equals dimensions. Rosencrantz, naturally, is about to make a scene of it.",
      diagram: "axes-2d",
      term: {
        label: "Dimension",
        definition:
          "One coordinate in a vector; the dimension count is how many numbers each direction uses.",
        llmConnection:
          "An embedding's size — its number of dimensions — sets how much raw room a model starts with before the trick multiplies it.",
      },
    },
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
    contextPanel: {
      heading: "A flat plane can't hold a third sideways direction",
      narrator:
        "Guildenstern is right to smirk — squeeze a third arrow between thumb and finger and it always tips toward one of them. With strict right angles a space holds no more separate directions than it has dimensions: a ceiling far too low for a model that needs thousands.",
    },
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
    contextPanel: {
      heading: "'Good enough' right angles are where the magic starts",
      narrator:
        "Here is Rosencrantz's sleight of hand: let 'sideways' mean anywhere from 88° to 92°. In flat 2D it still fits nothing new — but that sliver of slack is the whole trick. Give it many dimensions and countless directions crowd in, barely overlapping.",
      term: {
        label: "Cosine similarity",
        definition:
          "A score for how aligned two directions are: 1 means identical, 0 means a right angle, −1 means opposite.",
        llmConnection:
          "AI models gauge how related two words are by the cosine similarity of their embeddings; near 0 means 'basically unrelated'.",
      },
    },
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
    contextPanel: {
      heading: "Step into the room and a third direction appears",
      narrator:
        "Rosencrantz drags us off the page into a room, and a third direction appears — back-and-forth, joining up-and-down and left-and-right. A cube: three axes, three clean directions. Small spaces stay stubbornly one-per-dimension; the fireworks wait for far higher numbers.",
      diagram: "cube-3d",
    },
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
    guildenstern:
      "No, no, no — you cannot get there from here! A result arriving before its explanation is merely an ambush.",
    aside: "Rosencrantz brings the fact. Guildenstern requires it to become reasonable.",
    contextPanel: {
      heading: "The machine claims 100× more directions than dimensions",
      narrator:
        "After 2D and 3D, this looks impossible: a hundred times more directions than dimensions. A number that large needs an explanation, not applause.",
    },
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
    rosencrantz: "You have made the machine smaller — this misses the point!",
    guildenstern:
      "The point is to understand. Ten dimensions — now the experiment is small enough to grasp.",
    aside: "Guildenstern simplifies the phenomenon until it almost disappears.",
    contextPanel: {
      heading: "Shrink it to 10 dimensions and the effect nearly vanishes",
      narrator:
        "Shrink the space to ten dimensions and you get about ten directions — one per axis. Tiny spaces hide the effect entirely, which is why intuition built in 2D and 3D misleads.",
      term: {
        label: "Basis",
        definition:
          "A set of perpendicular axes that span a space; a space of D dimensions has exactly D of them.",
        llmConnection:
          "If an AI used only these perfectly-perpendicular axes, it could store just one feature per dimension — a few thousand in all.",
      },
    },
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
    contextPanel: {
      heading: "A small, tidy example is not the whole law",
      narrator:
        "Guildenstern declares victory at ten and writes the million off as a blunder. Premature: the near-right-angle allowance is quietly present here too — it merely wants more dimensions before it shows its hand.",
    },
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
    contextPanel: {
      heading: "When the theory stalls, run the experiment again",
      narrator:
        "Theory has parked itself at ten; the experiment, unbothered, wants to ask again. Cranking the dimension back up is the one move that drags into the light what small spaces kept hidden.",
    },
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
    contextPanel: {
      heading: "At 100 dimensions, a small surplus finally appears",
      narrator:
        "At a hundred dimensions the machine coughs up about 113 directions — a few more than the axes. Guildenstern waves it off as rounding, but it is the first quiet interest paid by that 'good enough' angle.",
      term: {
        label: "Near-orthogonality",
        definition:
          "Directions that are close to, but not exactly, perpendicular — a little overlap is allowed.",
        llmConnection:
          "Features inside an AI are almost never exactly perpendicular; being near-orthogonal is enough to keep them from interfering much.",
      },
    },
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
    contextPanel: {
      heading: "At 1,000 dimensions, the surplus more than doubles",
      narrator:
        "A thousand dimensions: over 2,600 directions, more than twice the axes. The slack that bought nothing in the plane now compounds with every dimension added. Guildenstern can no longer call it a clerical error.",
    },
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
    contextPanel: {
      heading: "10,000 dimensions hold over 500,000 near-sideways directions",
      narrator:
        "Ten thousand dimensions gives over half a million directions — fifty times the axes. Guildenstern, who a moment ago was ready to dismiss his friend entirely, falls quiet: perhaps Rosencrantz is onto something. And little wonder he balked — no human can truly picture a ten-thousand-dimensional room; the mind simply refuses to.",
      term: {
        label: "Superposition",
        definition:
          "Fitting more features than you have dimensions by giving each one a near-perpendicular direction that only slightly overlaps the rest.",
        llmConnection:
          "Superposition is how an AI crams far more learned concepts into its embedding space than it has dimensions.",
      },
    },
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
    contextPanel: {
      heading: "Capacity multiplies, it doesn't just add",
      narrator:
        "Each new dimension does not add a fixed number of directions — it multiplies everything the earlier ones already held. Carried to the machine's full 12,288 dimensions, that compounding lands on 1,388,864 — exactly Rosencrantz's opening cry, and no slip at all.",
    },
    guidedInput: nearRightAngle(12_288),
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
      "Exponential growth with dimension. Your phrase is less dignified — yet more memorable.",
    aside:
      "All the way up at 12,288 dimensions, the estimate is 1,388,864 — the number from the cold open.",
    contextPanel: {
      heading: "Near-sideways room grows exponentially with dimension",
      narrator:
        "With the angle fixed, the number of near-perpendicular directions grows exponentially with dimension. Why: in high dimensions, two random directions are almost always already nearly perpendicular. Run it out to the machine's full 12,288 dimensions and the count is 1,388,864 — exactly the cold-open's number, and the reason an AI has such outsized memory.",
      term: {
        label: "Embedding capacity",
        definition:
          "How many distinct near-perpendicular directions an embedding space can hold — far more than its dimension count.",
        llmConnection:
          "It's why an AI with only a few thousand embedding dimensions can juggle an enormous vocabulary of features at once.",
      },
    },
    guidedInput: nearRightAngle(12_288),
  },
  {
    id: "board-question",
    scene: "shared-board",
    eyebrow: "The Shared Board",
    title: "What are they for?",
    image: "/images/shared-board-empty.webp",
    alt: "Guildenstern questions Rosencrantz as six numbered boxes appear on a shared theatrical board.",
    rosencrantz: "Store things in them. Here — watch.",
    guildenstern:
      "But why hoard so many dimensions — whatever will you do with them all?",
    aside: "A direction is only useful once something is stored in it.",
    bubbles: diagonalSharedBoardBubbles,
    dialogue: [
      {
        speaker: "guildenstern",
        text:
          "But why hoard so many dimensions — whatever will you do with them all?",
        placement: { position: "upper-left", tail: "down-right" },
      },
      {
        speaker: "rosencrantz",
        text: "Store things in them. Here — watch.",
        placement: { position: "lower-right", tail: "up-left" },
      },
    ],
    contextPanel: {
      heading: "The boxes ARE the numbers that make a direction",
      narrator:
        "Time to cash in that room. A 'direction' was only ever a list of numbers — and these boxes are those numbers, one each. So 'nearly perpendicular' from the arrow slides is exactly what's coming on the board: two patterns whose signs mostly cancel. Same idea, now with coordinates you can point at.",
      term: {
        label: "Coordinates",
        definition:
          "The individual numbers that pin down a direction — here, one value written in each box.",
        llmConnection:
          "An AI's embedding is literally this list of numbers; each box is one coordinate the model reads and writes.",
      },
    },
    prop: {
      kind: "boxes",
      label: "Six boxes",
      values: ["1", "2", "3", "4", "5", "6"],
    },
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
    dialogue: [
      {
        speaker: "guildenstern",
        text:
          "Six boxes. One might assign a meaning to each and proceed sensibly.",
        placement: { position: "upper-left", tail: "down-right" },
      },
      {
        speaker: "rosencrantz",
        text: "They have declined their assignments. They are only boxes.",
        placement: { position: "lower-right", tail: "up-left" },
      },
    ],
    contextPanel: {
      heading: "The numbers are shared scratch space, not labeled drawers",
      narrator:
        "Six blank boxes. You could pin one fixed meaning to each — box 1 is 'money', box 2 is 'river' — but that wastes them. A model's numbers work more like shared scratch space: no single box owns a fixed meaning.",
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
      heading: "An idea is a pattern across all the boxes, not one box",
      narrator:
        "'MONEY' isn't hiding in box 3. It's a fingerprint spread across all six boxes — a specific pattern of pluses and minuses. The idea belongs to the whole board at once.",
      term: {
        label: "Feature direction",
        definition:
          "A pattern of values spread across the whole space. The ± here is a teaching stand-in; real ones use smooth, varied numbers.",
        llmConnection:
          "An AI can store a concept as a direction smeared across many coordinates rather than in one labeled slot.",
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
      heading: "Confidence just means writing the pattern more strongly",
      narrator:
        "'I deposited cash at the bank' is sure it's about money, so it stamps the MONEY pattern on strongly. How firmly a pattern is written is just how confident the model is about that idea.",
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
      heading: "Unrelated patterns cancel out to nearly zero",
      narrator:
        "Read the board for MONEY while RIVER is written: three boxes agree, three disagree, and they cancel to nearly nothing. That agreement score is the same ruler as the 'overlap' from the arrow slides — one measurement, two names. An unrelated idea leaves almost no trace.",
      term: {
        label: "Dot product",
        definition:
          "Add up the box-by-box agreements between two patterns — matches count positive, clashes negative. It's the same overlap measure as cosine similarity, just unnormalized.",
        llmConnection:
          "A near-zero dot product is one reason two AI features can share the same space with little interference.",
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
      heading: "On a tiny board, one accident looks huge",
      narrator:
        "With only six boxes, two stray agreements is already a third of the board — a loud 33%. Small boards make coincidence look huge, which is why the tiny 2D and 3D spaces refused the trick.",
      term: {
        label: "Tolerance",
        definition:
          "The small amount of overlap you allow when directions are nearly, rather than exactly, perpendicular.",
        llmConnection:
          "AI features don't need to be perfectly separate — their overlap just has to stay small enough for the task.",
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
      heading: "In 12,288 boxes, the overlap shrinks to under 1%",
      narrator:
        "Blow the board up to 12,288 boxes and the same wobble leaves only about 111 mismatched signs — under 1%. Why: flip N coins and you land only about √N from even, a shrinking slice of N, so the typical overlap falls like 1/√N — here about 0.9%. And a 0.9% overlap per unrelated pair is exactly why a million near-perpendicular directions still fit in 12,288 dimensions.",
      term: {
        label: "Interference",
        definition:
          "The unwanted overlap that lets one stored idea bleed into another when you read it.",
        llmConnection:
          "In an AI, unrelated feature directions usually overlap only a little, though how much varies with what was learned.",
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
      heading: "Millions can be stored; only a few speak at once",
      narrator:
        "One board can hold millions of possible ideas. What keeps that safe is sparsity: each pair barely overlaps, but if too many ideas fire at once the small overlaps pile up and interfere. Keep only a handful strongly active and the sum stays quiet.",
      term: {
        label: "Sparsity",
        definition:
          "Only a small fraction of all possible features are strongly active at any one time — the condition the trick requires.",
        llmConnection:
          "The trick only holds while activity stays sparse: an AI can draw on a huge repertoire because few strong features collide at once, so their small overlaps never add up to real interference.",
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
      heading: "A huge repertoire works because little of it speaks at once",
      narrator:
        "The two realize they might be ideas on the board too — presently active ones. That's the resolution: an AI holds an enormous store of concepts because only a fraction speaks strongly at each word.",
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
