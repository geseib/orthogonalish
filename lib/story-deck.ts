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
      "The estimate gives one million, three hundred eighty-eight thousand, eight hundred sixty-four. That seems more than I put in.",
    aside: "He has stumbled onto the answer before hearing the question.",
    contextPanel: {
      heading: "How AI fits millions of ideas into a few thousand numbers",
      narrator:
        "This is the puzzle the whole story unpacks. An AI language model describes every word as a short list of numbers — really just a direction to point in. It has only a few thousand of those slots, yet it keeps millions of distinct ideas from blurring together. Rosencrantz just cranked a machine and got that impossible-looking count. The next slides show exactly why it works.",
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
      heading: "Two directions at 90° never get in each other's way",
      narrator:
        "Picture two arrows meeting at a perfect right angle. Neither leans even slightly toward the other, so you can follow one without disturbing the other at all. That 'zero overlap' is the gold standard for keeping two ideas cleanly apart.",
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
        "If one arrow means 'cat' and the other means 'money', a right angle guarantees that turning one up adds nothing to the other. Separate directions are how you store separate meanings without them bleeding together.",
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
    guildenstern: "Enjoy it. We are about to relax the rules.",
    aside: "In two dimensions, two perfectly perpendicular directions fit.",
    contextPanel: {
      heading: "Flatland offers exactly two clean directions",
      narrator:
        "On a flat sheet there are only two honest ways to move — up-and-down and left-and-right. Two axes, two ideas, and no room for a third that doesn't borrow from them. It all looks reassuringly tidy… which, to an investigator, is usually the hush right before the rules get bent.",
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
        "There's visible space between thumb and finger, but any arrow you draw there leans toward one of them. With strict right angles, a space can never hold more separate directions than it has dimensions — a ceiling far too low for a model that needs thousands.",
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
        "Rosencrantz relaxes the rule: a direction counts as sideways if it lands anywhere from 88° to 92°. In a flat 2D world this still fits nothing new — but that tiny bit of slack is the whole secret. Once there are many dimensions, it lets a huge number of directions crowd in while barely overlapping.",
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
        "Off the page and into a room: back-and-forth now joins up-and-down and left-and-right. That's a cube — three axes, three clean directions. Rosencrantz has the right instinct, to keep adding dimensions… but the trap is to stop at three and call the case closed. Does he press on, or settle for the tidy little cube?",
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
    guildenstern: "A result arriving before its explanation is merely an ambush.",
    aside: "Rosencrantz brings the fact. Guildenstern requires it to become reasonable.",
    contextPanel: {
      heading: "The machine claims 100× more directions than dimensions",
      narrator:
        "Held against everything we just saw in 2D and 3D, this number looks impossible: a hundred times more directions than the space has dimensions. That's exactly why it needs an explanation instead of applause — a real rule, not a lucky reading.",
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
    rosencrantz: "You have made the machine smaller.",
    guildenstern:
      "Ten dimensions. Now the experiment is small enough to understand.",
    aside: "Guildenstern simplifies the phenomenon until it almost disappears.",
    contextPanel: {
      heading: "Shrink it to 10 dimensions and the effect nearly vanishes",
      narrator:
        "Guildenstern makes the space small — ten dimensions — and gets about ten directions, one per axis. Tiny spaces hide the trick completely, which is exactly why our everyday intuition, built in 2D and 3D, leads us astray.",
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
        "The theorist declares victory at ten and calls the earlier million a mistake. But the near-right-angle allowance is quietly present here too — it's just waiting for enough dimensions before it does anything dramatic.",
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
        "Theory has parked at ten; the experiment is happy to keep asking. Turning the dimension back up is the one move that reveals what small spaces were hiding all along.",
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
        "A hundred dimensions yields about 113 directions — a few more than the space has axes. Easy to wave away as a rounding quirk, but it's the first visible interest paid by that 'good enough' angle allowance.",
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
        "A thousand dimensions gives over 2,600 usable directions — more than twice the number of axes. The allowance that bought nothing in a flat plane now compounds with every dimension you add. This is no longer a rounding error.",
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
        "Push the space up to ten thousand dimensions and the count explodes past half a million usable directions — fifty times the number of dimensions. There's now room for far more separate ideas than there are number-slots to store them in. That surplus is the entire point.",
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
        "Each extra dimension doesn't add a fixed number of directions — it scales up everything the earlier dimensions could already hold. That compounding is the signature of exponential growth, and why the machine's number stopped looking like a clerical slip.",
    },
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
    contextPanel: {
      heading: "Near-sideways room grows exponentially with dimension",
      narrator:
        "Keep the 'good enough' angle fixed and the count of near-perpendicular directions grows exponentially as dimensions rise. That single fact is the whole engine behind the cold-open's impossible number — and behind an AI's oversized memory.",
      term: {
        label: "Embedding capacity",
        definition:
          "How many distinct near-perpendicular directions an embedding space can hold — far more than its dimension count.",
        llmConnection:
          "It's why an AI with only a few thousand embedding dimensions can juggle an enormous vocabulary of features at once.",
      },
    },
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
      heading: "The numbers are shared scratch space, not labeled drawers",
      narrator:
        "Six blank boxes. You could assign one fixed meaning to each — box 1 is 'money', box 2 is 'river' — but that wastes them. A model's working numbers behave more like shared scratch space, where no single box owns a fixed human meaning.",
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
        "'I deposited cash at the bank' is very sure it's about money, so it stamps the MONEY fingerprint onto the board strongly. How firmly a pattern is added is just how confident the model is about that idea. (This is an intuition, not a literal account of every computation.)",
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
        "Check the board for MONEY while RIVER is written on it: three boxes agree, three disagree, and they cancel. An unrelated idea leaves almost no trace when you go looking for a different one.",
      term: {
        label: "Dot product",
        definition:
          "Add up the box-by-box agreements between two patterns — matches count positive, clashes negative.",
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
        "With only six boxes, a couple of stray agreements is already a third of the board — a loud 33% of coincidence. Small boards make accidents look important, which is exactly why our earlier tiny 2D and 3D spaces refused the trick. (The numbers illustrate scale, not a fixed outcome.)",
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
        "Blow the board up to 12,288 boxes and the same coin-flip wobble now leaves only about 111 mismatched signs — under one percent. The typical overlap between two unrelated patterns is roughly 1 / sqrt(12,288), about 0.9%, and the exact amount varies from pair to pair.",
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
        "One board can hold kings, rivers, coins, deaths — millions of possible ideas. What keeps them from colliding isn't only the board's size; it's that just a small handful are strongly active in any single moment.",
      term: {
        label: "Sparsity",
        definition:
          "Only a small fraction of all possible features are strongly active at any one time.",
        llmConnection:
          "Sparse activity lets an AI draw on a huge repertoire while rarely having many strong features collide at once.",
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
        "The characters realize they might be ideas on the board too — presently very active ones. That's the whole resolution: an AI can hold an enormous store of concepts precisely because only a fraction needs to speak strongly at each word.",
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
