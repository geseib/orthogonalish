import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

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

  it("updates guided calculator values without starting the experiment", async () => {
    const source = await readFile(
      new URL("./guided-story.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toMatch(/onGuidedInput/);
    expect(source).toMatch(/step\.guidedInput/);
    expect(source).not.toMatch(/startSimulation|new Worker/);
  });
});
