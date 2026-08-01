import { describe, expect, it } from "vitest";

import {
  getDialogue,
  type DialogueAction,
  type DialogueState,
} from "./dialogue";

const validActions = new Set<DialogueAction>([
  "test",
  "explain",
  "continue",
  "change",
  "retest",
]);

const completedResult = {
  vectorsFound: 24,
  attempts: 180,
  pairChecks: 2_760,
  minAngle: 88.15,
  maxAngle: 91.82,
  elapsedMilliseconds: 430,
  seed: 17,
  stopReason: "vector-cap" as const,
};

const states: DialogueState[] = [
  { kind: "opening", seed: 1 },
  {
    kind: "dimension",
    seed: 2,
    dimension: 1_000,
    estimatedTotal: 2_658,
    multiplier: 2.6586,
  },
  { kind: "angle", seed: 3 },
  { kind: "running", seed: 4 },
  { kind: "completed", seed: 5, result: completedResult },
  {
    kind: "capped",
    seed: 6,
    result: { ...completedResult, stopReason: "attempt-cap" },
  },
  {
    kind: "invalid",
    seed: 7,
    errors: ["Dimension must be a positive integer."],
  },
];

describe("getDialogue", () => {
  it.each(states)("returns a complete $kind beat", (state) => {
    const beat = getDialogue(state);

    expect(beat.rosencrantz.trim()).not.toBe("");
    expect(beat.guildenstern.trim()).not.toBe("");
    expect(beat.aside.trim()).not.toBe("");
    expect(beat.lesson.trim()).not.toBe("");
    expect(beat.actions.length).toBeGreaterThan(0);
    expect(beat.actions.every((action) => validActions.has(action))).toBe(true);
  });

  it("teaches a distinct mathematical point as the state changes", () => {
    const lessons = states.map((state) => getDialogue(state).lesson);

    expect(getDialogue(states[0]).lesson).toMatch(/perfect orthogonality/i);
    expect(getDialogue(states[1]).lesson).toMatch(/grows increasingly|exponential|multipl/i);
    expect(getDialogue(states[2]).lesson).toMatch(/tolerance/i);
    expect(getDialogue(states[3]).lesson).toMatch(/construction|candidate/i);
    expect(getDialogue(states[5]).lesson).toMatch(/quadratic|n²|pair/i);
    expect(new Set(lessons).size).toBe(states.length);
  });

  it("calls a completed construction vectors found, never a maximum", () => {
    const beat = getDialogue({
      kind: "completed",
      seed: 17,
      result: completedResult,
    });
    const copy = Object.values(beat).flat().join(" ");

    expect(copy).toMatch(/found/i);
    expect(copy).not.toMatch(/\bmaximum\b/i);
  });

  it("describes the guaranteed result without theorem jargon", () => {
    const lesson = getDialogue({ kind: "running", seed: 4 }).lesson;

    expect(lesson).toMatch(/guarantee|construction|capacity/i);
    expect(lesson).not.toMatch(/Welch|epsilon|coherence/i);
    expect(lesson).not.toMatch(/random-set estimate/i);
  });

  it("chooses repeat-state variants deterministically from the seed", () => {
    const first = getDialogue({ kind: "running", seed: 10 });
    const repeated = getDialogue({ kind: "running", seed: 10 });
    const alternate = getDialogue({ kind: "running", seed: 11 });

    expect(repeated).toEqual(first);
    expect(alternate.rosencrantz).not.toBe(first.rosencrantz);
    expect(
      getDialogue({ kind: "completed", seed: 10, result: completedResult })
        .rosencrantz,
    ).not.toBe(
      getDialogue({ kind: "completed", seed: 11, result: completedResult })
        .rosencrantz,
    );
  });

  it("turns changing dimensions into the exponential discovery", () => {
    const thousand = getDialogue({
      kind: "dimension",
      seed: 2,
      dimension: 1_000,
      estimatedTotal: 2_658,
      multiplier: 2.6586,
    });
    const tenThousand = getDialogue({
      kind: "dimension",
      seed: 2,
      dimension: 10_000,
      estimatedTotal: 540_586,
      multiplier: 54.0587,
    });

    expect(`${thousand.rosencrantz} ${thousand.guildenstern}`).toMatch(/2,658|more than/i);
    expect(`${tenThousand.rosencrantz} ${tenThousand.guildenstern}`).toMatch(/540,586|exponential/i);
    expect(`${thousand.lesson} ${tenThousand.lesson}`).not.toMatch(/Welch|epsilon|coherence/i);
  });

  it.each(states)("lets the $kind lesson return with Go on", (state) => {
    const actions = getDialogue(state).actions;

    expect(actions).toContain("explain");
    expect(actions).toContain("continue");
  });
});
