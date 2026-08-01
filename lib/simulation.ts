const DEGREES_TO_RADIANS = Math.PI / 180;
const MAX_VECTOR_COORDINATES = 5_000_000;

export type SimulationOptions = {
  dimension: number;
  lowerAngle: number;
  upperAngle: number;
  seed: number;
  maxVectors: number;
  maxAttempts: number;
  maxMilliseconds: number;
};

export type SimulationResult = {
  vectorsFound: number;
  attempts: number;
  pairChecks: number;
  minAngle: number | null;
  maxAngle: number | null;
  elapsedMilliseconds: number;
  seed: number;
  stopReason: "vector-cap" | "attempt-cap" | "time-cap" | "cancelled";
};

export type SimulationProgress = Pick<
  SimulationResult,
  "vectorsFound" | "attempts" | "pairChecks" | "minAngle" | "maxAngle"
> & {
  acceptedDotProducts: readonly number[];
};

type NormalizedSimulationOptions = SimulationOptions & {
  dotMin: number;
  dotMax: number;
};

/** Runs a reproducible greedy search for unit vectors in an angular interval. */
export function runSimulation(
  options: SimulationOptions,
  onProgress?: (progress: SimulationProgress) => void,
  shouldCancel: () => boolean = () => false,
): SimulationResult {
  const normalized = normalizeOptions(options);
  const random = mulberry32(normalized.seed);
  const vectors: Float64Array[] = [];
  const startedAt = Date.now();
  let attempts = 0;
  let pairChecks = 0;
  let minAngle: number | null = null;
  let maxAngle: number | null = null;
  let stopReason: SimulationResult["stopReason"] = "attempt-cap";

  while (true) {
    if (shouldCancel()) {
      stopReason = "cancelled";
      break;
    }

    if (Date.now() - startedAt >= normalized.maxMilliseconds) {
      stopReason = "time-cap";
      break;
    }

    if (vectors.length >= normalized.maxVectors) {
      stopReason = "vector-cap";
      break;
    }

    if (attempts >= normalized.maxAttempts) {
      stopReason = "attempt-cap";
      break;
    }

    attempts += 1;
    const candidate = randomUnitVector(normalized.dimension, random);
    const acceptedDotProducts: number[] = [];
    let accepted = true;

    for (const vector of vectors) {
      const dot = dotProduct(candidate, vector);
      pairChecks += 1;

      if (dot < normalized.dotMin || dot > normalized.dotMax) {
        accepted = false;
        break;
      }

      acceptedDotProducts.push(dot);
    }

    if (!accepted) {
      continue;
    }

    vectors.push(candidate);
    for (const dot of acceptedDotProducts) {
      const angle = Math.acos(clamp(dot, -1, 1)) / DEGREES_TO_RADIANS;
      minAngle = minAngle === null ? angle : Math.min(minAngle, angle);
      maxAngle = maxAngle === null ? angle : Math.max(maxAngle, angle);
    }

    onProgress?.({
      vectorsFound: vectors.length,
      attempts,
      pairChecks,
      minAngle,
      maxAngle,
      acceptedDotProducts,
    });
  }

  return {
    vectorsFound: vectors.length,
    attempts,
    pairChecks,
    minAngle,
    maxAngle,
    elapsedMilliseconds: Date.now() - startedAt,
    seed: normalized.seed,
    stopReason,
  };
}

function normalizeOptions(options: SimulationOptions): NormalizedSimulationOptions {
  if (!Number.isSafeInteger(options.dimension) || options.dimension < 1) {
    throw new RangeError("Dimension must be a positive integer.");
  }

  if (
    !Number.isFinite(options.lowerAngle) ||
    !Number.isFinite(options.upperAngle) ||
    options.lowerAngle < 0 ||
    options.upperAngle > 180 ||
    options.lowerAngle >= options.upperAngle
  ) {
    throw new RangeError("Angles must satisfy 0 ≤ lowerAngle < upperAngle ≤ 180.");
  }

  const safeVectorLimit = Math.max(
    1,
    Math.floor(MAX_VECTOR_COORDINATES / options.dimension),
  );

  return {
    dimension: options.dimension,
    lowerAngle: options.lowerAngle,
    upperAngle: options.upperAngle,
    seed: Number.isFinite(options.seed) ? options.seed >>> 0 : 0,
    maxVectors: boundedNonNegativeInteger(
      options.maxVectors,
      safeVectorLimit,
      safeVectorLimit,
    ),
    maxAttempts: boundedNonNegativeInteger(options.maxAttempts, 100_000, 10_000_000),
    maxMilliseconds: boundedNonNegativeInteger(options.maxMilliseconds, 1_000, 60_000),
    dotMin: Math.cos(options.upperAngle * DEGREES_TO_RADIANS),
    dotMax: Math.cos(options.lowerAngle * DEGREES_TO_RADIANS),
  };
}

function boundedNonNegativeInteger(
  value: number,
  fallback: number,
  maximum: number,
): number {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return Math.min(Math.floor(value), maximum);
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function randomUnitVector(dimension: number, random: () => number): Float64Array {
  const vector = new Float64Array(dimension);
  let squaredLength = 0;

  for (let index = 0; index < dimension; index += 2) {
    const radius = Math.sqrt(-2 * Math.log(1 - random()));
    const theta = 2 * Math.PI * random();
    const first = radius * Math.cos(theta);
    const second = radius * Math.sin(theta);

    vector[index] = first;
    squaredLength += first * first;
    if (index + 1 < dimension) {
      vector[index + 1] = second;
      squaredLength += second * second;
    }
  }

  const length = Math.sqrt(squaredLength);
  for (let index = 0; index < dimension; index += 1) {
    vector[index] /= length;
  }

  return vector;
}

function dotProduct(left: Float64Array, right: Float64Array): number {
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result += left[index] * right[index];
  }
  return result;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
