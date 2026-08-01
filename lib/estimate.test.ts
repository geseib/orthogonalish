import { describe, expect, it } from "vitest";

import {
  analyzeCapacity,
  estimateStoryTotal,
  estimateRandomSet,
  formatCapacity,
  validateInputs,
} from "./estimate";

describe("validateInputs", () => {
  it("rejects invalid dimensions", () => {
    expect(validateInputs(0, 88, 92)).not.toHaveLength(0);
    expect(validateInputs(1.5, 88, 92)).not.toHaveLength(0);
    expect(validateInputs(Number.NaN, 88, 92)).not.toHaveLength(0);
  });

  it("rejects invalid angle bounds", () => {
    expect(validateInputs(100, -1, 92)).not.toHaveLength(0);
    expect(validateInputs(100, 88, 181)).not.toHaveLength(0);
    expect(validateInputs(100, 92, 88)).not.toHaveLength(0);
    expect(validateInputs(100, 89, 89)).not.toHaveLength(0);
  });

  it("accepts exactly 90° as the perfectly orthogonal baseline", () => {
    expect(validateInputs(1_000, 90, 90)).toEqual([]);
    expect(analyzeCapacity(estimateRandomSet(1_000, 90, 90))).toMatchObject({
      guaranteedMinimum: 1_000,
      welchUpperBound: 1_000,
      isExact: true,
    });
  });

  it("requires a nearly orthogonal interval to contain 90°", () => {
    expect(validateInputs(100, 80, 89)).toContain(
      "The angle range must contain 90°.",
    );
    expect(validateInputs(100, 91, 100)).toContain(
      "The angle range must contain 90°.",
    );
    expect(validateInputs(100, 88, 92)).not.toContain(
      "The angle range must contain 90°.",
    );
  });
});

describe("estimateStoryTotal", () => {
  it("restores the large dimension-scaled estimates that drive the lesson", () => {
    expect(estimateStoryTotal(estimateRandomSet(1_000, 88, 92))).toMatchObject({
      total: 2_658,
      multiplier: 2.6586137298206878,
    });
    expect(estimateStoryTotal(estimateRandomSet(10_000, 88, 92))).toMatchObject({
      total: 540_586,
      multiplier: 54.05869647852782,
    });
  });

  it("lets known low-dimensional limits quietly correct the estimate", () => {
    expect(estimateStoryTotal(estimateRandomSet(3, 88, 92))).toMatchObject({
      total: 3,
      isExact: true,
    });
    expect(estimateStoryTotal(estimateRandomSet(10, 88, 92))).toMatchObject({
      total: 10,
      isExact: true,
    });
    expect(estimateStoryTotal(estimateRandomSet(100, 88, 92))).toMatchObject({
      total: 113,
      isCappedByKnownLimit: true,
    });
  });

  it("keeps exact right angles one-for-one", () => {
    expect(estimateStoryTotal(estimateRandomSet(10_000, 90, 90))).toMatchObject({
      total: 10_000,
      multiplier: 1,
      isExact: true,
    });
  });
});

describe("estimateRandomSet", () => {
  it("converts symmetric angle bounds to dot-product bounds", () => {
    const estimate = estimateRandomSet(1_000, 88, 92);

    expect(estimate.dotMin).toBeCloseTo(-0.034899, 6);
    expect(estimate.dotMax).toBeCloseTo(0.034899, 6);
  });

  it("returns a bounded pair-pass probability", () => {
    const estimate = estimateRandomSet(1_000, 88, 92);

    expect(estimate.pairPassProbability).toBeGreaterThanOrEqual(0);
    expect(estimate.pairPassProbability).toBeLessThanOrEqual(1);
  });

  it("grows monotonically as dimension increases", () => {
    const dimensions = [100, 1_000, 10_000];
    const logSizes = dimensions.map(
      (dimension) => estimateRandomSet(dimension, 88, 92).log10Size,
    );

    expect(logSizes[1]).toBeGreaterThan(logSizes[0]);
    expect(logSizes[2]).toBeGreaterThan(logSizes[1]);
  });

  it("marks low-dimensional estimates as illustrative", () => {
    expect(estimateRandomSet(1, 88, 92).caveat).toContain("illustrative");
    expect(estimateRandomSet(10, 88, 92).caveat).toContain("illustrative");
    expect(estimateRandomSet(30, 88, 92).caveat).toBeUndefined();
  });
});

describe("analyzeCapacity", () => {
  it("proves that only three vectors fit in three dimensions at 88°–92°", () => {
    expect(analyzeCapacity(estimateRandomSet(3, 88, 92))).toMatchObject({
      guaranteedMinimum: 3,
      welchUpperBound: 3,
      isExact: true,
    });
  });

  it("proves ten exactly and bounds one hundred between 100 and 113", () => {
    expect(analyzeCapacity(estimateRandomSet(10, 88, 92))).toMatchObject({
      guaranteedMinimum: 10,
      welchUpperBound: 10,
      isExact: true,
    });
    expect(analyzeCapacity(estimateRandomSet(100, 88, 92))).toMatchObject({
      guaranteedMinimum: 100,
      welchUpperBound: 113,
      isExact: false,
    });
  });

  it("marks the Welch ceiling as open beyond the 821-dimension threshold", () => {
    const capacity = analyzeCapacity(estimateRandomSet(1_000, 88, 92));

    expect(capacity.thresholdDimension).toBeCloseTo(821.04, 1);
    expect(capacity.welchUpperBound).toBeNull();
    expect(capacity.isExact).toBe(false);
  });
});

describe("formatCapacity", () => {
  it("distinguishes exact, bounded, and open capacity results", () => {
    expect(formatCapacity(analyzeCapacity(estimateRandomSet(3, 88, 92)))).toMatchObject({
      heading: "Exact capacity",
      primary: "3",
    });
    expect(formatCapacity(analyzeCapacity(estimateRandomSet(100, 88, 92)))).toMatchObject({
      heading: "Rigorous capacity range",
      primary: "100–113",
    });
    expect(formatCapacity(analyzeCapacity(estimateRandomSet(1_000, 88, 92)))).toMatchObject({
      heading: "Guaranteed capacity",
      primary: "≥ 1,000",
    });
  });
});
