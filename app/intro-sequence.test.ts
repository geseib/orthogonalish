import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("IntroSequence source contracts", () => {
  it("renders both scenes, visible beat controls, and lesson controls", async () => {
    const source = await readFile(
      new URL("./intro-sequence.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toMatch(/introScenes\.map/);
    expect(source).toMatch(/Previous dialogue beat/);
    expect(source).toMatch(/Next dialogue beat/);
    expect(source).toMatch(/What did that mean\?/);
    expect(source).toMatch(/data-story-section/);
  });

  it("handles two-axis keys without stealing focused controls", async () => {
    const source = await readFile(
      new URL("./intro-sequence.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toMatch(/isInteractiveTarget\(event\.target/);
    expect(source).toMatch(/resolveStoryNavigation/);
    expect(source).toMatch(/scrollIntoView/);
    expect(source).toMatch(/getPreferredScrollBehavior/);
  });
});
