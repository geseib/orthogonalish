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
      narrator:
        "A right angle is the cleanest possible separation: neither direction contains any part of the other.",
      term: {
        label: "Orthogonal",
        definition:
          "The mathematical word for directions that meet at exactly 90°.",
      },
    });
    expect(comparison?.contextPanel?.term?.llmConnection).toMatch(
      /language model|LLM/i,
    );
  });

  it("ends with the ordered Shared Board act", () => {
    expect(storySteps.slice(-8).map((step) => step.id)).toEqual([
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

  it("supplies visual and narration metadata for every Shared Board beat", () => {
    const sharedBoard = storySteps.filter(
      (step) => step.scene === "shared-board",
    );
    expect(sharedBoard).toHaveLength(8);
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
