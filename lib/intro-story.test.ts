import { describe, expect, it } from "vitest";

import { introScenes, moveBeat } from "./intro-story";

describe("introScenes", () => {
  it("contains two scenes with setup, experiment, and discovery beats", () => {
    expect(introScenes).toHaveLength(2);
    expect(introScenes.map((scene) => scene.id)).toEqual([
      "intro-right-angle",
      "intro-one-more",
    ]);
    expect(introScenes.every((scene) => scene.beats.length === 3)).toBe(true);
    expect(
      introScenes.flatMap((scene) => scene.beats.map((beat) => beat.kind)),
    ).toEqual([
      "setup",
      "experiment",
      "discovery",
      "setup",
      "experiment",
      "discovery",
    ]);
  });

  it("keeps the beginner-facing copy free of deferred terminology", () => {
    const copy = JSON.stringify(introScenes);
    expect(copy).toMatch(/90°|right angle/i);
    expect(copy).toMatch(/88°|92°/i);
    expect(copy).toMatch(/two dimensions/i);
    expect(copy).not.toMatch(/dot product|coherence|epsilon|Welch/i);
  });
});

describe("moveBeat", () => {
  it("moves within a scene and stops at both boundaries", () => {
    expect(moveBeat(0, 3, "previous")).toBe(0);
    expect(moveBeat(0, 3, "next")).toBe(1);
    expect(moveBeat(1, 3, "next")).toBe(2);
    expect(moveBeat(2, 3, "next")).toBe(2);
  });
});
