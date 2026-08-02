import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getGuidedEstimate,
  moveStoryStep,
  storySteps,
  type StoryStep,
} from "./story-deck";

function stepAtDimension(dimension: number): StoryStep {
  const step = storySteps.find(
    (candidate) => candidate.guidedInput?.dimension === dimension,
  );
  if (!step) throw new Error(`Missing guided step for ${dimension}`);
  return step;
}

describe("guided story", () => {
  it("ships every referenced story image under public", () => {
    const referencedImages = storySteps.flatMap((step) =>
      step.image ? [step.image] : [],
    );

    expect(referencedImages).not.toHaveLength(0);

    for (const image of referencedImages) {
      expect(existsSync(join(process.cwd(), "public", image))).toBe(true);
    }
  });

  it("opens with Rosencrantz accidentally finding the million-vector result", () => {
    expect(storySteps[0]).toMatchObject({
      scene: "cold-open",
      guidedInput: {
        dimension: 12_288,
        lowerAngle: 88,
        upperAngle: 92,
      },
    });
    expect(storySteps[0].guildenstern).toBeUndefined();
    expect(storySteps[0].rosencrantz).toMatch(/more than I put in/i);
    expect(getGuidedEstimate(storySteps[0])?.total).toBe(1_388_864);
  });

  it("uses the calculator estimate for every numerical reveal", () => {
    expect(getGuidedEstimate(stepAtDimension(10))?.total).toBe(10);
    expect(getGuidedEstimate(stepAtDimension(100))?.total).toBe(113);
    expect(getGuidedEstimate(stepAtDimension(1_000))?.total).toBe(2_658);
    expect(getGuidedEstimate(stepAtDimension(10_000))?.total).toBe(540_586);
  });

  it("frames the large numerical reveals as illustrative estimates", () => {
    const largeReveals = [
      "cold-open-result",
      "failed-demo-report",
      "growth-thousand",
      "growth-ten-thousand",
    ];

    for (const id of largeReveals) {
      expect(storySteps.find((step) => step.id === id)?.rosencrantz).toMatch(
        /estimate/i,
      );
    }
  });

  it("tells the failed simplification before naming the growth", () => {
    const script = storySteps
      .map((step) => `${step.rosencrantz} ${step.guildenstern ?? ""}`)
      .join(" ")
      .toLowerCase();

    expect(script).toMatch(/ten dimensions/i);
    expect(script).toMatch(/ordinary/i);
    expect(script).toMatch(/exponential growth with dimension/i);
    expect(script.indexOf("ten dimensions")).toBeLessThan(
      script.indexOf("exponential growth with dimension"),
    );
  });

  it("uses the approved bubble placement for the reference comparison", () => {
    const comparison = storySteps.find(
      (step) => step.id === "right-angle-meeting",
    );

    expect(comparison).toMatchObject({
      image: "/images/two-ideas-right-angle.webp",
      rosencrantz:
        "Two lines. They have met and immediately agreed to face elsewhere.",
      guildenstern:
        "They meet at exactly 90°. Neither points even slightly along the other.",
      bubbles: {
        rosencrantz: { position: "upper-left", tail: "down-right" },
        guildenstern: { position: "lower-right", tail: "up-left" },
      },
    });
  });

  it("keeps the comparison slide's narrator panel with optional depth", () => {
    const contextualSteps = storySteps.filter((step) => step.contextPanel);

    const comparison = contextualSteps.find(
      (step) => step.id === "right-angle-meeting",
    );

    expect(comparison?.contextPanel).toMatchObject({
      heading: "Two directions at 90° never get in each other's way",
      narrator:
        "Picture two arrows meeting at a perfect right angle. Neither leans even slightly toward the other, so you can follow one without disturbing the other at all. That 'zero overlap' is the gold standard for keeping two ideas cleanly apart.",
      term: {
        label: "Orthogonal",
        definition:
          "The math word for two directions that meet at exactly 90° — zero overlap.",
      },
    });
    expect(comparison?.contextPanel?.term?.llmConnection).toMatch(
      /language model|LLM|AI/i,
    );
  });

  it("ends with the ordered Shared Board act", () => {
    expect(storySteps.slice(-9).map((step) => step.id)).toEqual([
      "board-question",
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
  });

  it("preserves the approved estimates and cautious vast-board explanation", () => {
    expect(
      getGuidedEstimate(
        storySteps.find((step) => step.id === "growth-ten-thousand")!,
      )?.total,
    ).toBe(540_586);
    expect(
      getGuidedEstimate(
        storySteps.find((step) => step.id === "cold-open-result")!,
      )?.total,
    ).toBe(1_388_864);

    const vast = storySteps.find((step) => step.id === "board-vast")!;
    expect(vast.contextPanel?.narrator).toMatch(/varies|typical/i);
    expect(vast.contextPanel?.term?.llmConnection).not.toMatch(
      /unlimited|never confused/i,
    );
  });

  it("retains the complete approved Panel 6 script", () => {
    const vast = storySteps.find((step) => step.id === "board-vast")!;

    expect(vast.dialogue).toEqual([
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
    ]);
    expect(vast).toMatchObject({
      aside: "The board grows faster than its ordinary wobble.",
      contextPanel: {
        narrator:
          "Blow the board up to 12,288 boxes and the same coin-flip wobble now leaves only about 111 mismatched signs — under one percent. Flip N ±1 coins and you land only about sqrt(N) away from even; that leftover is a vanishing slice of the whole N, which is why the overlap shrinks like 1 / sqrt(N). The typical overlap between two unrelated patterns is roughly 1 / sqrt(12,288), about 0.9%, and the exact amount varies from pair to pair — and a 0.9% overlap per unrelated pair is precisely why about a million near-orthogonal directions still fit inside 12,288 dimensions.",
      },
    });
  });

  it("supplies visual and narration metadata for every Shared Board beat", () => {
    const sharedBoard = storySteps.filter(
      (step) => step.scene === "shared-board",
    );
    expect(sharedBoard).toHaveLength(9);
    expect(sharedBoard.every((step) => step.image && step.contextPanel)).toBe(
      true,
    );
    expect(sharedBoard.every((step) => step.bubbles?.rosencrantz)).toBe(true);
    expect(
      storySteps
        .filter((step) => step.guildenstern && step.image)
        .every((step) => step.bubbles?.guildenstern),
    ).toBe(true);
  });

  it("places Shared Board bubbles around each illustration's characters", () => {
    for (const id of [
      "board-empty",
      "board-fingerprint",
      "board-writing",
      "board-cancellation",
      "board-cramped",
      "board-vast",
    ]) {
      expect(storySteps.find((step) => step.id === id)?.bubbles).toEqual({
        rosencrantz: { position: "upper-left", tail: "down-left" },
        guildenstern: { position: "lower-right", tail: "up-right" },
      });
    }

    expect(
      storySteps.find((step) => step.id === "board-company")?.bubbles,
    ).toEqual({
      rosencrantz: { position: "lower-right", tail: "up-left" },
      guildenstern: { position: "upper-right", tail: "down-left" },
    });

    expect(
      storySteps.find((step) => step.id === "board-active")?.bubbles,
    ).toEqual({
      rosencrantz: { position: "upper-left", tail: "down-right" },
      guildenstern: { position: "lower-right", tail: "up-left" },
    });
  });

  it("moves one step at a time without wrapping and reports scene changes", () => {
    expect(moveStoryStep(0, "previous")).toEqual({
      index: 0,
      sceneChanged: false,
    });
    expect(moveStoryStep(0, "next")).toEqual({
      index: 1,
      sceneChanged: storySteps[0].scene !== storySteps[1].scene,
    });
    expect(moveStoryStep(storySteps.length - 1, "next")).toEqual({
      index: storySteps.length - 1,
      sceneChanged: false,
    });
  });
});
