export type EstimateResult = {
  dimension: number;
  lowerAngle: number;
  upperAngle: number;
  dotMin: number;
  dotMax: number;
  pairPassProbability: number;
  log10Size: number;
  caveat?: string;
};

export type CapacityAnalysis = {
  dimension: number;
  epsilon: number;
  guaranteedMinimum: number;
  welchUpperBound: number | null;
  thresholdDimension: number;
  isExact: boolean;
};

const DEGREES_TO_RADIANS = Math.PI / 180;
const PROBABILITY_FLOOR = Number.EPSILON;

/** Returns human-readable messages for inputs that cannot be estimated. */
export function validateInputs(
  dimension: number,
  lowerAngle: number,
  upperAngle: number,
): string[] {
  const errors: string[] = [];

  if (!Number.isSafeInteger(dimension) || dimension < 1) {
    errors.push("Dimension must be a positive integer.");
  }

  if (!Number.isFinite(lowerAngle) || lowerAngle < 0 || lowerAngle > 180) {
    errors.push("Lower angle must be between 0° and 180°.");
  }

  if (!Number.isFinite(upperAngle) || upperAngle < 0 || upperAngle > 180) {
    errors.push("Upper angle must be between 0° and 180°.");
  }

  if (
    Number.isFinite(lowerAngle) &&
    Number.isFinite(upperAngle) &&
    lowerAngle >= upperAngle
  ) {
    errors.push("Lower angle must be less than upper angle.");
  }

  if (
    Number.isFinite(lowerAngle) &&
    Number.isFinite(upperAngle) &&
    lowerAngle < upperAngle &&
    (lowerAngle > 90 || upperAngle < 90)
  ) {
    errors.push("The angle range must contain 90°.");
  }

  return errors;
}

/** Estimates the chance that a random pair has an allowed angle, and the 50% random-set size. */
export function estimateRandomSet(
  dimension: number,
  lowerAngle: number,
  upperAngle: number,
): EstimateResult {
  const errors = validateInputs(dimension, lowerAngle, upperAngle);
  if (errors.length > 0) {
    throw new RangeError(errors.join(" "));
  }

  const dotMin = Math.cos(upperAngle * DEGREES_TO_RADIANS);
  const dotMax = Math.cos(lowerAngle * DEGREES_TO_RADIANS);
  const standardDeviation = 1 / Math.sqrt(dimension);
  const rawPairPassProbability =
    normalCdf(dotMax / standardDeviation) -
    normalCdf(dotMin / standardDeviation);
  const pairPassProbability = clampProbability(rawPairPassProbability);
  const pairCountAtEvenOdds = Math.log(0.5) / Math.log(pairPassProbability);
  const size = (1 + Math.sqrt(1 + 8 * pairCountAtEvenOdds)) / 2;

  return {
    dimension,
    lowerAngle,
    upperAngle,
    dotMin,
    dotMax,
    pairPassProbability,
    log10Size: Math.log10(size),
    caveat:
      dimension < 30
        ? "For dimensions below 30, the high-dimensional normal approximation is illustrative."
        : undefined,
  };
}

/** Applies the Welch coherence bound to the angle tolerance. */
export function analyzeCapacity(estimate: EstimateResult): CapacityAnalysis {
  const epsilon = Math.max(Math.abs(estimate.dotMin), Math.abs(estimate.dotMax));
  const epsilonSquared = epsilon * epsilon;
  const thresholdDimension = 1 / epsilonSquared;
  const hasFiniteWelchCeiling = estimate.dimension * epsilonSquared < 1;
  const welchUpperBound = hasFiniteWelchCeiling
    ? Math.floor(
        (estimate.dimension * (1 - epsilonSquared)) /
          (1 - estimate.dimension * epsilonSquared),
      )
    : null;

  return {
    dimension: estimate.dimension,
    epsilon,
    guaranteedMinimum: estimate.dimension,
    welchUpperBound,
    thresholdDimension,
    isExact: welchUpperBound === estimate.dimension,
  };
}

/** Formats a rigorous floor, range, or exact capacity result. */
export function formatCapacity(capacity: CapacityAnalysis): {
  heading: string;
  primary: string;
  secondary: string;
} {
  const minimum = capacity.guaranteedMinimum.toLocaleString("en-US");
  if (capacity.isExact) {
    return {
      heading: "Exact capacity",
      primary: minimum,
      secondary: "Orthogonal basis and Welch ceiling agree",
    };
  }

  if (capacity.welchUpperBound !== null) {
    return {
      heading: "Rigorous capacity range",
      primary: `${minimum}–${capacity.welchUpperBound.toLocaleString("en-US")}`,
      secondary: "Guaranteed basis ≤ capacity ≤ Welch ceiling",
    };
  }

  return {
    heading: "Guaranteed capacity",
    primary: `≥ ${minimum}`,
    secondary: `Welch ceiling opens beyond ≈ ${Math.round(capacity.thresholdDimension).toLocaleString("en-US")} dimensions`,
  };
}

function clampProbability(probability: number): number {
  return Math.min(1 - PROBABILITY_FLOOR, Math.max(PROBABILITY_FLOOR, probability));
}

function normalCdf(value: number): number {
  return 0.5 * (1 + errorFunction(value / Math.SQRT2));
}

// Abramowitz and Stegun 7.1.26, with maximum error below 1.5e-7.
function errorFunction(value: number): number {
  const sign = Math.sign(value) || 1;
  const absoluteValue = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * absoluteValue);
  const polynomial =
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t);

  return sign * (1 - polynomial * Math.exp(-absoluteValue * absoluteValue));
}
