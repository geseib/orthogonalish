import { describe, expect, it } from "vitest";

import {
  estimateRandomSet,
  formatEstimate,
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
    expect(validateInputs(100, 90, 90)).not.toHaveLength(0);
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

describe("formatEstimate", () => {
  it("renders a scientific display for large estimates", () => {
    const display = formatEstimate(123.45);

    expect(display.primary).toContain("10");
    expect(display.primary).toContain("123");
  });
});
