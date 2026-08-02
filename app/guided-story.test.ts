import { describe, expect, it } from "vitest";

import { moveStoryStep, storySteps } from "../lib/story-deck";
import { keyboardStoryDirection } from "./guided-story";

describe("guided story component", () => {
  it("maps one-axis keyboard controls to exactly one story direction", () => {
    expect(keyboardStoryDirection("ArrowDown")).toBe("next");
    expect(keyboardStoryDirection("PageDown")).toBe("next");
    expect(keyboardStoryDirection(" ")).toBe("next");
    expect(keyboardStoryDirection("Spacebar")).toBe("next");
    expect(keyboardStoryDirection("ArrowUp")).toBe("previous");
    expect(keyboardStoryDirection("PageUp")).toBe("previous");
  });

  it("leaves horizontal keyboard controls inert", () => {
    expect(keyboardStoryDirection("ArrowLeft")).toBeNull();
    expect(keyboardStoryDirection("ArrowRight")).toBeNull();
  });

  it("ends at the final story beat without a calculator bridge", async () => {
    const { readFile } = await import("node:fs/promises");
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
