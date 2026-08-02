import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import { moveStoryStep, storySteps } from "../lib/story-deck";

describe("guided story component", () => {
  it("routes visible and keyboard navigation through one vertical sequence", async () => {
    const source = await readFile(
      new URL("./guided-story.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toMatch(/moveStoryStep/);
    expect(source).toMatch(/event\.key === "ArrowDown"/);
    expect(source).toMatch(/event\.key === "ArrowUp"/);
    expect(source).toMatch(/aria-label="Previous story step"/);
    expect(source).toMatch(/aria-label="Next story step"/);
    expect(source).not.toMatch(/ArrowRight|ArrowLeft/);
    expect(source).not.toMatch(/Next dialogue beat|Previous dialogue beat/);
  });

  it("ends at the final story beat without a calculator bridge", async () => {
    const source = await readFile(
      new URL("./guided-story.tsx", import.meta.url),
      "utf8",
    );

    expect(moveStoryStep(storySteps.length - 1, "next")).toEqual({
      index: storySteps.length - 1,
      sceneChanged: false,
    });
    expect(source).toMatch(/\{storySteps\.length\}/);
    expect(source).not.toMatch(/storySteps\.length \+ 1/);
    expect(source).not.toMatch(
      /onGuidedInput|atCalculator|scrollTo\("calculator"\)|Worker|experiment callback/,
    );
  });
});
