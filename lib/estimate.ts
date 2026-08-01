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

/** Formats the dimension-scaled estimate as a floor-rounded total. */
export function formatEstimatedTotal(estimate: EstimateResult): {
  primary: string;
  secondary: string;
} {
  const multiplier = 10 ** estimate.log10Size;
  const log10Total = estimate.log10Size + Math.log10(estimate.dimension);
  const secondary = `≈ ${multiplier.toFixed(4)}× dimension · total rounded down`;

  if (log10Total <= Math.log10(Number.MAX_SAFE_INTEGER)) {
    return {
      primary: Math.floor(estimate.dimension * multiplier).toLocaleString("en-US"),
      secondary,
    };
  }

  const exponent = Math.floor(log10Total);
  const mantissa = 10 ** (log10Total - exponent);
  const truncatedMantissa = Math.floor(mantissa * 100) / 100;
  return {
    primary: `${truncatedMantissa.toFixed(2)} × 10^${exponent}`,
    secondary,
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
