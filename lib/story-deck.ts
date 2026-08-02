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
  presentation?: "speech-overlay";
  contextPanel?: {
    narrator: string;
    term: {
      label: string;
      definition: string;
      llmConnection: string;
    };
  };
  guidedInput?: GuidedInput;
};

const nearRightAngle = (dimension: number): GuidedInput => ({
  dimension,
  lowerAngle: 88,
  upperAngle: 92,
});

export const storySteps: readonly StoryStep[] = [
  {
    id: "cold-open-result",
    scene: "cold-open",
    eyebrow: "Before the question",
    title: "More than I put in",
    image: "/images/rosencrantz-discovery.webp",
    alt: "Rosencrantz stands alone at a brass apparatus as cyan vector arrows multiply across the dark stage.",
    rosencrantz:
      "One million, three hundred eighty-eight thousand, eight hundred sixty-four. That seems more than I put in.",
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
    rosencrantz:
      "Two lines. They have met and immediately agreed to face elsewhere.",
    guildenstern:
      "They meet at exactly 90°. Neither points even slightly along the other.",
    aside: "A right angle marks two completely separate directions.",
    presentation: "speech-overlay",
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
    rosencrantz:
      "I found 1,388,864 directions in 12,288 dimensions. The box was quite definite.",
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
    rosencrantz: "One thousand dimensions. Two thousand, six hundred fifty-eight directions.",
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
    rosencrantz:
      "Ten thousand dimensions. Five hundred forty thousand, five hundred eighty-six directions.",
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
    rosencrantz: "Multiplying room.",
    guildenstern:
      "Exponential growth with dimension. Your phrase is less dignified and more memorable.",
    aside:
      "With a fixed near-right-angle tolerance, possible directions can grow exponentially with dimension.",
    guidedInput: nearRightAngle(10_000),
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
