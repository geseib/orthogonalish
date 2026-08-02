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

export type SimulationRunner = {
  /** Performs at most the requested coordinate-level work and returns only when finished. */
  runChunk(maxWorkUnits: number): SimulationResult | null;
};

type NormalizedSimulationOptions = SimulationOptions & {
  dotMin: number;
  dotMax: number;
};

type SimulationPhase = "idle" | "generating" | "normalizing" | "comparing";

/** Runs a reproducible greedy search to completion for non-worker callers. */
export function runSimulation(
  options: SimulationOptions,
  onProgress?: (progress: SimulationProgress) => void,
  shouldCancel: () => boolean = () => false,
): SimulationResult {
  const runner = createSimulationRunner(options, onProgress, shouldCancel);

  while (true) {
    const result = runner.runChunk(Number.MAX_SAFE_INTEGER);
    if (result !== null) {
      return result;
    }
  }
}

/** Creates resumable simulation state so workers can yield between bounded chunks. */
export function createSimulationRunner(
  options: SimulationOptions,
  onProgress?: (progress: SimulationProgress) => void,
  shouldCancel: () => boolean = () => false,
): SimulationRunner {
  return new ResumableSimulation(options, onProgress, shouldCancel);
}

class ResumableSimulation implements SimulationRunner {
  private readonly options: NormalizedSimulationOptions;
  private readonly onProgress?: (progress: SimulationProgress) => void;
  private readonly shouldCancel: () => boolean;
  private readonly random: () => number;
  private readonly vectors: Float64Array[] = [];
  private readonly startedAt = Date.now();

  private attempts = 0;
  private pairChecks = 0;
  private minAngle: number | null = null;
  private maxAngle: number | null = null;
  private result: SimulationResult | null = null;
  private phase: SimulationPhase = "idle";
  private candidate: Float64Array | null = null;
  private coordinateIndex = 0;
  private squaredLength = 0;
  private candidateLength = 0;
  private comparisonVectorIndex = 0;
  private dot = 0;
  private acceptedDotProducts: number[] = [];

  constructor(
    options: SimulationOptions,
    onProgress?: (progress: SimulationProgress) => void,
    shouldCancel: () => boolean = () => false,
  ) {
    this.options = normalizeOptions(options);
    this.onProgress = onProgress;
    this.shouldCancel = shouldCancel;
    this.random = mulberry32(this.options.seed);
  }

  runChunk(maxWorkUnits: number): SimulationResult | null {
    if (this.result !== null) {
      return this.result;
    }

    const workLimit = Math.max(1, Math.floor(maxWorkUnits));
    for (let work = 0; work < workLimit; work += 1) {
      const externalStop = this.externalStopReason();
      if (externalStop !== null) {
        return this.finish(externalStop);
      }

      if (this.phase === "idle") {
        const capStop = this.capStopReason();
        if (capStop !== null) {
          return this.finish(capStop);
        }
        this.beginCandidate();
      }

      this.performWorkUnit();
    }

    return null;
  }

  private externalStopReason(): SimulationResult["stopReason"] | null {
    if (this.shouldCancel()) {
      return "cancelled";
    }
    if (Date.now() - this.startedAt >= this.options.maxMilliseconds) {
      return "time-cap";
    }
    return null;
  }

  private capStopReason(): SimulationResult["stopReason"] | null {
    if (this.vectors.length >= this.options.maxVectors) {
      return "vector-cap";
    }
    if (this.attempts >= this.options.maxAttempts) {
      return "attempt-cap";
    }
    return null;
  }

  private beginCandidate(): void {
    this.attempts += 1;
    this.candidate = new Float64Array(this.options.dimension);
    this.coordinateIndex = 0;
    this.squaredLength = 0;
    this.acceptedDotProducts = [];
    this.phase = "generating";
  }

  private performWorkUnit(): void {
    if (this.phase === "generating") {
      this.generateCoordinates();
    } else if (this.phase === "normalizing") {
      this.normalizeCoordinate();
    } else if (this.phase === "comparing") {
      this.compareCoordinate();
    }
  }

  private generateCoordinates(): void {
    const candidate = this.requireCandidate();
    const radius = Math.sqrt(-2 * Math.log(Math.max(this.random(), Number.MIN_VALUE)));
    const theta = 2 * Math.PI * this.random();
    const first = radius * Math.cos(theta);
    const second = radius * Math.sin(theta);

    candidate[this.coordinateIndex] = first;
    this.squaredLength += first * first;
    if (this.coordinateIndex + 1 < candidate.length) {
      candidate[this.coordinateIndex + 1] = second;
      this.squaredLength += second * second;
    }

    this.coordinateIndex += 2;
    if (this.coordinateIndex >= candidate.length) {
      this.candidateLength = Math.sqrt(this.squaredLength);
      this.coordinateIndex = 0;
      this.phase = "normalizing";
    }
  }

  private normalizeCoordinate(): void {
    const candidate = this.requireCandidate();
    candidate[this.coordinateIndex] /= this.candidateLength;
    this.coordinateIndex += 1;

    if (this.coordinateIndex < candidate.length) {
      return;
    }

    this.coordinateIndex = 0;
    this.comparisonVectorIndex = 0;
    this.dot = 0;
    if (this.vectors.length === 0) {
      this.acceptCandidate();
    } else {
      this.phase = "comparing";
    }
  }

  private compareCoordinate(): void {
    const candidate = this.requireCandidate();
    const vector = this.vectors[this.comparisonVectorIndex];
    this.dot += candidate[this.coordinateIndex] * vector[this.coordinateIndex];
    this.coordinateIndex += 1;

    if (this.coordinateIndex < candidate.length) {
      return;
    }

    this.pairChecks += 1;
    if (this.dot < this.options.dotMin || this.dot > this.options.dotMax) {
      this.discardCandidate();
      return;
    }

    this.acceptedDotProducts.push(this.dot);
    this.comparisonVectorIndex += 1;
    if (this.comparisonVectorIndex >= this.vectors.length) {
      this.acceptCandidate();
      return;
    }

    this.coordinateIndex = 0;
    this.dot = 0;
  }

  private acceptCandidate(): void {
    const candidate = this.requireCandidate();
    this.vectors.push(candidate);
    for (const dot of this.acceptedDotProducts) {
      const angle = Math.acos(clamp(dot, -1, 1)) / DEGREES_TO_RADIANS;
      this.minAngle = this.minAngle === null ? angle : Math.min(this.minAngle, angle);
      this.maxAngle = this.maxAngle === null ? angle : Math.max(this.maxAngle, angle);
    }

    this.onProgress?.({
      vectorsFound: this.vectors.length,
      attempts: this.attempts,
      pairChecks: this.pairChecks,
      minAngle: this.minAngle,
      maxAngle: this.maxAngle,
      acceptedDotProducts: this.acceptedDotProducts,
    });
    this.discardCandidate();
  }

  private discardCandidate(): void {
    this.candidate = null;
    this.phase = "idle";
    this.coordinateIndex = 0;
    this.dot = 0;
  }

  private requireCandidate(): Float64Array {
    if (this.candidate === null) {
      throw new Error("Simulation candidate state is unavailable.");
    }
    return this.candidate;
  }

  private finish(stopReason: SimulationResult["stopReason"]): SimulationResult {
    this.result = {
      vectorsFound: this.vectors.length,
      attempts: this.attempts,
      pairChecks: this.pairChecks,
      minAngle: this.minAngle,
      maxAngle: this.maxAngle,
      elapsedMilliseconds: Date.now() - this.startedAt,
      seed: this.options.seed,
      stopReason,
    };
    return this.result;
  }
}

function normalizeOptions(options: SimulationOptions): NormalizedSimulationOptions {
  if (!Number.isSafeInteger(options.dimension) || options.dimension < 1) {
    throw new RangeError("Dimension must be a positive integer.");
  }
  if (options.dimension > MAX_VECTOR_COORDINATES) {
    throw new RangeError("Dimension cannot exceed 5,000,000 coordinates.");
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

  const safeVectorLimit = Math.floor(MAX_VECTOR_COORDINATES / options.dimension);

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

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
