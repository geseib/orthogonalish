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
        rosencrantz:
          "Two lines. They have met and immediately agreed to face elsewhere.",
        guildenstern:
          "They meet at exactly 90°. Neither points even slightly along the other.",
        aside: "A right angle marks two completely separate directions.",
      },
      {
        kind: "experiment",
        rosencrantz:
          "Suppose this line is one idea, and that line another. Can they interrupt each other?",
        guildenstern: "Not in this picture. Each has its own direction.",
        aside:
          "Perpendicular directions are a clean way to represent distinct ideas.",
      },
      {
        kind: "discovery",
        rosencrantz:
          "Two dimensions. Two ideas. A remarkably well-behaved universe.",
        guildenstern: "Enjoy it. We are about to relax the rules.",
        aside:
          "In two dimensions, two perfectly perpendicular directions fit.",
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
        rosencrantz:
          "Your thumb and finger make two directions. There is plainly room between them.",
        guildenstern:
          "Room for a finger, perhaps. Not for a third direction nearly 90° from both.",
        aside:
          "The flat plane has already used its two independent directions.",
      },
      {
        kind: "experiment",
        rosencrantz: "I shall be generous: anywhere from 88° to 92°.",
        guildenstern:
          "Generosity has not made a third line fit. It has merely made the failure less tidy.",
        aside:
          "A small relaxation changes nothing obvious in two dimensions.",
      },
      {
        kind: "discovery",
        rosencrantz: "Then add one dimension.",
        guildenstern:
          "Three dimensions, three obvious directions. Add thousands, however, and the arithmetic changes character.",
        aside:
          "One extra dimension adds one direction. Many dimensions unlock the larger effect.",
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
