import { describe, expect, it } from "vitest";

import { runSimulation } from "./simulation";

const options = {
  dimension: 8,
  lowerAngle: 70,
  upperAngle: 110,
  seed: 123_456,
  maxVectors: 12,
  maxAttempts: 1_000,
  maxMilliseconds: 60_000,
};

describe("runSimulation", () => {
  it("is deterministic for a fixed seed", () => {
    const first = runSimulation(options);
    const second = runSimulation(options);

    expect(second.vectorsFound).toBe(first.vectorsFound);
    expect(second.attempts).toBe(first.attempts);
    expect(second.pairChecks).toBe(first.pairChecks);
    expect(second.minAngle).toBe(first.minAngle);
    expect(second.maxAngle).toBe(first.maxAngle);
    expect(second.stopReason).toBe(first.stopReason);
    expect(second.seed).toBe(options.seed);
  });

  it("only accepts pair dot products inside the requested angle band", () => {
    const acceptedDotProducts: number[] = [];
    const result = runSimulation(
      { ...options, dimension: 4, maxVectors: 8 },
      (progress) => acceptedDotProducts.push(...progress.acceptedDotProducts),
    );
    const dotMin = Math.cos((options.upperAngle * Math.PI) / 180);
    const dotMax = Math.cos((options.lowerAngle * Math.PI) / 180);

    expect(result.pairChecks).toBeGreaterThan(0);
    expect(acceptedDotProducts).not.toHaveLength(0);
    expect(acceptedDotProducts.every((dot) => dot >= dotMin && dot <= dotMax)).toBe(
      true,
    );
  });

  it("stops when it reaches the vector cap", () => {
    const result = runSimulation({
      ...options,
      lowerAngle: 0,
      upperAngle: 180,
      maxVectors: 3,
    });

    expect(result.vectorsFound).toBe(3);
    expect(result.stopReason).toBe("vector-cap");
  });

  it("stops when it reaches the attempt cap", () => {
    const result = runSimulation({
      ...options,
      lowerAngle: 89.999,
      upperAngle: 90.001,
      maxVectors: 100,
      maxAttempts: 2,
    });

    expect(result.attempts).toBe(2);
    expect(result.stopReason).toBe("attempt-cap");
  });

  it("stops before sampling when the time cap is exhausted", () => {
    const result = runSimulation({ ...options, maxMilliseconds: 0 });

    expect(result.stopReason).toBe("time-cap");
    expect(result.attempts).toBe(0);
  });

  it("returns a cancelled stop reason when cancellation is requested", () => {
    const result = runSimulation(options, undefined, () => true);

    expect(result.stopReason).toBe("cancelled");
    expect(result.attempts).toBe(0);
    expect(result.vectorsFound).toBe(0);
  });
});
