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

  it("reserves the speech-overlay comparison for one existing slide", () => {
    const overlaySteps = storySteps.filter(
      (step) => step.presentation === "speech-overlay",
    );

    expect(overlaySteps.map((step) => step.id)).toEqual([
      "right-angle-meeting",
    ]);
    expect(overlaySteps[0]).toMatchObject({
      image: "/images/two-ideas-right-angle.webp",
      rosencrantz:
        "Two lines. They have met and immediately agreed to face elsewhere.",
      guildenstern:
        "They meet at exactly 90°. Neither points even slightly along the other.",
    });
  });

  it("gives only the comparison slide a narrator panel with optional depth", () => {
    const contextualSteps = storySteps.filter((step) => step.contextPanel);

    expect(contextualSteps.map((step) => step.id)).toEqual([
      "right-angle-meeting",
    ]);
    expect(contextualSteps[0].contextPanel).toMatchObject({
      narrator:
        "A right angle is the cleanest possible separation: neither direction contains any part of the other.",
      term: {
        label: "Orthogonal",
        definition:
          "The mathematical word for directions that meet at exactly 90°.",
      },
    });
    expect(contextualSteps[0].contextPanel?.term.llmConnection).toMatch(
      /language model|LLM/i,
    );
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
