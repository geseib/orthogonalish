"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  estimateStoryTotal,
  estimateRandomSet,
  validateInputs,
  type EstimateResult,
} from "../../lib/estimate";
import {
  getDialogue,
  type DialogueAction,
  type DialogueState,
} from "../../lib/dialogue";
import type {
  SimulationProgress,
  SimulationResult,
} from "../../lib/simulation";
import type { WorkerOutgoingMessage } from "../vector-worker";
import styles from "./machine.module.css";

const dimensionPresets = [1, 10, 100, 1_000, 10_000, 12_288] as const;
const initialSeed = 12_288;

type FieldErrors = {
  dimension?: string;
  lowerAngle?: string;
  upperAngle?: string;
};

type RunStatus =
  | "idle"
  | "running"
  | "complete"
  | "capped"
  | "cancelled"
  | "error";

type StartableWorker = Pick<Worker, "postMessage" | "terminate">;

export function safelyStartWorker<T extends StartableWorker>(
  createWorker: () => T,
  prepareWorker: (worker: T) => void,
  message: unknown,
): { worker: T | null; error: string | null } {
  let worker: T | null = null;
  try {
    worker = createWorker();
    prepareWorker(worker);
    worker.postMessage(message);
    return { worker, error: null };
  } catch {
    worker?.terminate();
    return {
      worker: null,
      error: "The experiment could not start in this browser.",
    };
  }
}

export default function MachinePage() {
  const [dimensionValue, setDimensionValue] = useState("100");
  const [lowerAngleValue, setLowerAngleValue] = useState("88");
  const [upperAngleValue, setUpperAngleValue] = useState("92");
  const [seed, setSeed] = useState(initialSeed);
  const [dialogueKind, setDialogueKind] = useState<
    "opening" | "dimension" | "angle"
  >("opening");
  const [lessonOpen, setLessonOpen] = useState(false);
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const [progress, setProgress] = useState<SimulationProgress | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [progressAnnouncement, setProgressAnnouncement] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const lastProgressAnnouncementAtRef = useRef(0);
  const dimensionInputRef = useRef<HTMLInputElement>(null);

  const parsedInputs = useMemo(
    () => ({
      dimension: parseNumericInput(dimensionValue),
      lowerAngle: parseNumericInput(lowerAngleValue),
      upperAngle: parseNumericInput(upperAngleValue),
    }),
    [dimensionValue, lowerAngleValue, upperAngleValue],
  );

  const fieldErrors = useMemo(
    () =>
      getFieldErrors(
        dimensionValue,
        lowerAngleValue,
        upperAngleValue,
        parsedInputs,
      ),
    [dimensionValue, lowerAngleValue, upperAngleValue, parsedInputs],
  );
  const validationErrors = Object.values(fieldErrors).filter(
    (error): error is string => Boolean(error),
  );
  const isValid = validationErrors.length === 0;

  const estimate = useMemo<EstimateResult | null>(() => {
    if (!isValid) return null;
    return estimateRandomSet(
      parsedInputs.dimension,
      parsedInputs.lowerAngle,
      parsedInputs.upperAngle,
    );
  }, [isValid, parsedInputs]);

  const dialogueState = useMemo<DialogueState>(() => {
    if (!isValid) return { kind: "invalid", seed, errors: validationErrors };
    if (runStatus === "running") return { kind: "running", seed };
    if (result && runStatus === "complete") {
      return { kind: "completed", seed, result };
    }
    if (result && runStatus === "capped")
      return { kind: "capped", seed, result };
    if (dialogueKind === "dimension") {
      const currentEstimate = estimateRandomSet(
        parsedInputs.dimension,
        parsedInputs.lowerAngle,
        parsedInputs.upperAngle,
      );
      const story = estimateStoryTotal(currentEstimate);
      return {
        kind: "dimension",
        seed,
        dimension: parsedInputs.dimension,
        estimatedTotal: story.total,
        multiplier: story.multiplier,
      };
    }
    return { kind: dialogueKind, seed };
  }, [
    dialogueKind,
    isValid,
    parsedInputs,
    result,
    runStatus,
    seed,
    validationErrors,
  ]);
  const beat = getDialogue(dialogueState);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    },
    [],
  );

  function stopCurrentRun(nextStatus: RunStatus = "idle") {
    workerRef.current?.terminate();
    workerRef.current = null;
    if (runStatus === "running") setRunStatus(nextStatus);
  }

  function markInputChange(kind: "dimension" | "angle") {
    stopCurrentRun();
    setRunStatus("idle");
    setDialogueKind(kind);
    setLessonOpen(false);
    setProgress(null);
    setResult(null);
    setRunError(null);
    setProgressAnnouncement("");
  }

  function changeDimension(event: ChangeEvent<HTMLInputElement>) {
    setDimensionValue(event.target.value);
    markInputChange("dimension");
  }

  function changeAngle(
    field: "lower" | "upper",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    if (field === "lower") setLowerAngleValue(event.target.value);
    else setUpperAngleValue(event.target.value);
    markInputChange("angle");
  }

  function chooseDimension(value: number) {
    setDimensionValue(String(value));
    markInputChange("dimension");
  }

  function startSimulation(nextSeed = seed) {
    if (!isValid) return;

    stopCurrentRun();
    setSeed(nextSeed);
    setProgress(null);
    setResult(null);
    setRunError(null);
    setProgressAnnouncement("");
    lastProgressAnnouncementAtRef.current = 0;
    setLessonOpen(false);

    if (parsedInputs.lowerAngle === 90 && parsedInputs.upperAngle === 90) {
      setResult(exactOrthogonalResult(parsedInputs.dimension, nextSeed));
      setRunStatus("complete");
      return;
    }

    const started = safelyStartWorker(
      () =>
        new Worker(new URL("../vector-worker.ts", import.meta.url), {
          type: "module",
        }),
      (worker) => {
        workerRef.current = worker;
        worker.onmessage = (event: MessageEvent<WorkerOutgoingMessage>) => {
          if (workerRef.current !== worker) return;

          if (event.data.type === "progress") {
            const nextProgress = event.data.payload as SimulationProgress;
            setProgress(nextProgress);
            const announcedAt = Date.now();
            if (
              lastProgressAnnouncementAtRef.current === 0 ||
              announcedAt - lastProgressAnnouncementAtRef.current >= 1_500
            ) {
              setProgressAnnouncement(
                `${nextProgress.vectorsFound} vectors accepted after ${nextProgress.attempts} candidates.`,
              );
              lastProgressAnnouncementAtRef.current = announcedAt;
            }
            return;
          }
          if (event.data.type === "complete") {
            const completed = event.data.payload as SimulationResult;
            setResult(completed);
            setProgress(null);
            setProgressAnnouncement("");
            setRunStatus(
              completed.stopReason === "vector-cap"
                ? "complete"
                : completed.stopReason === "cancelled"
                  ? "cancelled"
                  : "capped",
            );
            worker.terminate();
            workerRef.current = null;
            return;
          }

          const payload = event.data.payload as { message?: string };
          setRunError(
            payload.message ??
              "The experiment encountered an unexpected error.",
          );
          setRunStatus("error");
          setProgress(null);
          setProgressAnnouncement("");
          worker.terminate();
          workerRef.current = null;
        };

        worker.onerror = () => {
          if (workerRef.current !== worker) return;
          setRunError("The experiment could not start in this browser.");
          setRunStatus("error");
          setProgress(null);
          setProgressAnnouncement("");
          worker.terminate();
          workerRef.current = null;
        };
      },
      {
        type: "start",
        options: simulationOptions(parsedInputs, nextSeed),
      },
    );

    if (started.error) {
      workerRef.current = null;
      setRunError(started.error);
      setRunStatus("error");
      setProgress(null);
      setResult(null);
      setProgressAnnouncement("");
      return;
    }
    setRunStatus("running");
  }

  function cancelSimulation() {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: "cancel" });
  }

  function handleDialogueAction(action: DialogueAction) {
    if (action === "test") startSimulation();
    if (action === "retest") startSimulation((seed + 1) >>> 0);
    if (action === "explain") setLessonOpen(true);
    if (action === "continue") setLessonOpen(false);
    if (action === "change") {
      dimensionInputRef.current?.focus();
      dimensionInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  return (
    <main className={styles.machine}>
      <Link className={styles.backLink} href="/">
        ← Back to the story
      </Link>

      <header className={styles.masthead}>
        <p className={styles.eyebrow}>The apparatus</p>
        <h1 className={styles.title}>
          Rosencrantz&rsquo;s Dimension Expansion Machine
        </h1>
        <p className={styles.lede}>
          Choose a dimension and a band of acceptable angles. The machine
          predicts how many nearly-orthogonal directions should fit—then turn
          the handle to build them for real.
        </p>
      </header>

      <section className={styles.controlDeck} aria-labelledby="controls-title">
        <div className={styles.panel}>
          <p className={styles.sectionNumber} aria-hidden="true">
            I
          </p>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Set the terms</p>
            <h2 id="controls-title">The geometry</h2>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="dimension">Dimensions</label>
            <div className={styles.inputWithUnit}>
              <input
                ref={dimensionInputRef}
                id="dimension"
                name="dimension"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={dimensionValue}
                onChange={changeDimension}
                aria-invalid={Boolean(fieldErrors.dimension)}
                aria-describedby={
                  fieldErrors.dimension ? "dimension-error" : "dimension-help"
                }
              />
              <span aria-hidden="true">D</span>
            </div>
            <p className={styles.fieldHelp} id="dimension-help">
              One positive whole number. High dimensions are welcome.
            </p>
            {fieldErrors.dimension ? (
              <p className={styles.fieldError} id="dimension-error" role="alert">
                {fieldErrors.dimension}
              </p>
            ) : null}
            <div
              className={styles.presets}
              role="group"
              aria-label="Dimension presets"
            >
              {dimensionPresets.map((preset) => (
                <button
                  className={
                    Number(dimensionValue) === preset ? styles.isSelected : ""
                  }
                  key={preset}
                  type="button"
                  onClick={() => chooseDimension(preset)}
                  aria-pressed={Number(dimensionValue) === preset}
                  aria-label={`Set dimension to ${preset.toLocaleString("en-US")}`}
                >
                  {preset.toLocaleString("en-US")}
                </button>
              ))}
            </div>
          </div>

          <fieldset className={styles.angleFields}>
            <legend>Acceptable angle</legend>
            <div className={styles.angleGrid}>
              <label>
                <span>From</span>
                <span className={styles.inputWithUnit}>
                  <input
                    name="lowerAngle"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="180"
                    step="0.1"
                    value={lowerAngleValue}
                    onChange={(event) => changeAngle("lower", event)}
                    aria-invalid={Boolean(fieldErrors.lowerAngle)}
                    aria-describedby={
                      fieldErrors.lowerAngle ? "lower-error" : undefined
                    }
                  />
                  <span aria-hidden="true">°</span>
                </span>
              </label>
              <span className={styles.rangeMark} aria-hidden="true">
                to
              </span>
              <label>
                <span>Through</span>
                <span className={styles.inputWithUnit}>
                  <input
                    name="upperAngle"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="180"
                    step="0.1"
                    value={upperAngleValue}
                    onChange={(event) => changeAngle("upper", event)}
                    aria-invalid={Boolean(fieldErrors.upperAngle)}
                    aria-describedby={
                      fieldErrors.upperAngle ? "upper-error" : undefined
                    }
                  />
                  <span aria-hidden="true">°</span>
                </span>
              </label>
            </div>
            {fieldErrors.lowerAngle ? (
              <p className={styles.fieldError} id="lower-error" role="alert">
                {fieldErrors.lowerAngle}
              </p>
            ) : null}
            {fieldErrors.upperAngle ? (
              <p className={styles.fieldError} id="upper-error" role="alert">
                {fieldErrors.upperAngle}
              </p>
            ) : null}
          </fieldset>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => startSimulation()}
            disabled={!isValid || runStatus === "running"}
          >
            <span>Test it</span>
            <span aria-hidden="true">↗</span>
          </button>
          <p className={styles.buttonNote}>
            Seed {seed.toLocaleString("en-US")} · reproducible
          </p>
        </div>

        <EstimateCard estimate={estimate} />
      </section>

      <section className={styles.narration} aria-live="polite">
        <div className={styles.narrationHeading}>
          <p className={styles.eyebrow}>Backstage</p>
          <p className={styles.stageStatus} aria-live="polite">
            {runStatus === "running"
              ? "Experiment in progress"
              : "The argument continues"}
          </p>
        </div>

        <div className={styles.dialogue} aria-atomic="true">
          <blockquote className={styles.speechRosencrantz}>
            <p>{beat.rosencrantz}</p>
            <cite>Rosencrantz · experimentalist</cite>
          </blockquote>
          <blockquote className={styles.speechGuildenstern}>
            <p>{beat.guildenstern}</p>
            <cite>Guildenstern · theorist</cite>
          </blockquote>
        </div>

        <div className={styles.asideCard}>
          <p>
            <span>Aside</span>
            {beat.aside}
          </p>
          {lessonOpen ? <p className={styles.lesson}>{beat.lesson}</p> : null}
          <div className={styles.dialogueActions}>
            {beat.actions.includes("explain") &&
            beat.actions.includes("continue") ? (
              <button
                key="lesson-toggle"
                type="button"
                onClick={() =>
                  handleDialogueAction(lessonOpen ? "continue" : "explain")
                }
                aria-expanded={lessonOpen}
              >
                {actionLabel(lessonOpen ? "continue" : "explain")}
              </button>
            ) : null}
            {beat.actions.map((action) => {
              if (action === "continue" || action === "explain") return null;
              return (
                <button
                  className={
                    action === "test" || action === "retest"
                      ? styles.actionPrimary
                      : ""
                  }
                  key={action}
                  type="button"
                  onClick={() => handleDialogueAction(action)}
                  disabled={
                    (action === "test" || action === "retest") && !isValid
                  }
                >
                  {actionLabel(action)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <EvidencePanel
        status={runStatus}
        progress={progress}
        result={result}
        error={runError}
        progressAnnouncement={progressAnnouncement}
        onCancel={cancelSimulation}
        onRetest={() => startSimulation((seed + 1) >>> 0)}
      />

      <footer className={styles.footer}>
        <p>The Nearly Orthogonal Society</p>
        <p>A rigorous bound and a seeded experiment—not the last word in geometry.</p>
      </footer>
    </main>
  );
}

function EstimateCard({ estimate }: { estimate: EstimateResult | null }) {
  const estimated = estimate ? estimateStoryTotal(estimate) : null;

  return (
    <aside
      className={styles.estimatePanel}
      aria-labelledby="estimate-title"
      aria-live="polite"
    >
      <p className={styles.sectionNumber} aria-hidden="true">
        II
      </p>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>The prediction</p>
        <h2 id="estimate-title">
          {estimated?.isExact ? "Exact total vectors" : "Estimated total vectors"}
        </h2>
      </div>
      {estimate && estimated ? (
        <>
          <p className={styles.estimateValue}>
            {estimated.log10Total < 15
              ? estimated.total.toLocaleString("en-US")
              : formatLargeEstimate(estimated.log10Total)}
          </p>
          <p className={styles.estimateSecondary}>
            {estimated.isExact
              ? "One distinct direction for every dimension. Exactly."
              : `≈ ${estimated.multiplier.toFixed(4)} × ${estimate.dimension.toLocaleString("en-US")}, rounded down`}
          </p>
          <p className={styles.estimateDisclaimer}>
            {estimated.isExact
              ? "Perfect right angles grow one-for-one."
              : estimated.isCappedByKnownLimit
                ? "At this smaller size, geometry gives us a tighter limit, so the estimate stops there."
                : "An illustrative estimate of the exponential trend—not a claim that the exact maximum is known."}
          </p>
        </>
      ) : (
        <div className={styles.estimateEmpty}>
          <p>—</p>
          <span>Correct the marked field to restore the estimate.</span>
        </div>
      )}
    </aside>
  );
}

function EvidencePanel({
  status,
  progress,
  result,
  error,
  progressAnnouncement,
  onCancel,
  onRetest,
}: {
  status: RunStatus;
  progress: SimulationProgress | null;
  result: SimulationResult | null;
  error: string | null;
  progressAnnouncement: string;
  onCancel: () => void;
  onRetest: () => void;
}) {
  return (
    <section className={styles.evidence} aria-labelledby="evidence-title">
      <div className={styles.evidenceHeading}>
        <div>
          <p className={styles.eyebrow}>The experiment</p>
          <h2 id="evidence-title">Verified vectors found</h2>
        </div>
        <span
          className={`${styles.evidenceLight} ${styles[`light_${status}`] ?? ""}`}
          aria-hidden="true"
        />
      </div>

      {status === "idle" ? (
        <p className={styles.evidenceEmpty}>
          No construction has been attempted. The bound above is awaiting
          constructive evidence.
        </p>
      ) : null}

      {status === "running" ? (
        <div className={styles.runProgress}>
          <p
            className={styles.progressAnnouncement}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {progressAnnouncement}
          </p>
          <div className={styles.progressCopy}>
            <p>
              <strong>{progress?.vectorsFound ?? 0}</strong> vectors currently
              accepted
            </p>
            <p>
              {(progress?.attempts ?? 0).toLocaleString("en-US")} candidates
              tried
            </p>
          </div>
          <progress
            aria-label="Candidate budget"
            value={progress?.attempts ?? 0}
            max={12_000}
          />
          <p className={styles.progressDetail}>
            {formatInteger(progress?.pairChecks ?? 0)} pairwise checks ·
            comparing every new candidate with the current collection
          </p>
          <button
            className={styles.quietButton}
            type="button"
            onClick={onCancel}
          >
            Cancel test
          </button>
        </div>
      ) : null}

      {result && (status === "complete" || status === "capped") ? (
        <>
          <div className={styles.foundResult} aria-live="polite">
            <strong>{result.vectorsFound.toLocaleString("en-US")}</strong>
            <span>verified vectors found</span>
          </div>
          <dl className={styles.evidenceMetrics}>
            <Metric
              label="Candidate attempts"
              value={formatInteger(result.attempts)}
            />
            <Metric
              label="Pairwise checks"
              value={formatInteger(result.pairChecks)}
            />
            <Metric label="Observed minimum" value={formatAngle(result.minAngle)} />
            <Metric label="Observed maximum" value={formatAngle(result.maxAngle)} />
            <Metric
              label="Elapsed"
              value={formatDuration(result.elapsedMilliseconds)}
            />
            <Metric
              label="Stopping reason"
              value={stopReasonLabel(result.stopReason)}
            />
          </dl>
          <p className={styles.evidenceNote}>
            Every pair in this returned collection passed. This is evidence from
            one greedy seeded construction, not an exact optimum.
          </p>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onRetest}
          >
            Test again · new seed
          </button>
        </>
      ) : null}

      {status === "cancelled" ? (
        <div className={styles.runMessage} role="status">
          <p>The test was cancelled. No geometric conclusion has been drawn.</p>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onRetest}
          >
            Start a new test
          </button>
        </div>
      ) : null}

      {status === "error" ? (
        <div className={`${styles.runMessage} ${styles.runError}`} role="alert">
          <p>{error}</p>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onRetest}
          >
            Try again
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function parseNumericInput(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}

export function getFieldErrors(
  dimensionValue: string,
  lowerAngleValue: string,
  upperAngleValue: string,
  values: { dimension: number; lowerAngle: number; upperAngle: number },
): FieldErrors {
  const errors: FieldErrors = {};
  const messages = validateInputs(
    values.dimension,
    values.lowerAngle,
    values.upperAngle,
  );

  if (dimensionValue.trim() === "") errors.dimension = "Enter a dimension.";
  else if (!Number.isFinite(values.dimension))
    errors.dimension = "Dimension must be a number.";
  else if (messages.some((message) => message.startsWith("Dimension"))) {
    errors.dimension = "Dimension must be a positive whole number.";
  }

  if (lowerAngleValue.trim() === "") errors.lowerAngle = "Enter the lower angle.";
  else if (
    messages.some((message) => message.startsWith("Lower angle must be between"))
  ) {
    errors.lowerAngle = "Lower angle must be between 0° and 180°.";
  }

  if (upperAngleValue.trim() === "") errors.upperAngle = "Enter the upper angle.";
  else if (
    messages.some((message) => message.startsWith("Upper angle must be between"))
  ) {
    errors.upperAngle = "Upper angle must be between 0° and 180°.";
  }

  if (messages.some((message) => message.includes("less than upper"))) {
    errors.upperAngle = "Upper angle must be greater than the lower angle.";
  }
  if (messages.some((message) => message.includes("must contain 90"))) {
    errors.upperAngle = "A nearly orthogonal angle range must contain 90°.";
  }
  if (values.lowerAngle === 0 && values.upperAngle === 180) {
    errors.upperAngle =
      "The full 0°–180° range is geometrically degenerate; narrow either angle.";
  }
  return errors;
}

function simulationOptions(
  values: { dimension: number; lowerAngle: number; upperAngle: number },
  seed: number,
) {
  const maxVectors =
    values.dimension >= 10_000 ? 48 : values.dimension >= 1_000 ? 80 : 160;
  return {
    ...values,
    seed,
    maxVectors,
    maxAttempts: 12_000,
    maxMilliseconds: 6_000,
  };
}

export function exactOrthogonalResult(
  dimension: number,
  seed: number,
): SimulationResult {
  return {
    vectorsFound: dimension,
    attempts: dimension,
    pairChecks: (dimension * (dimension - 1)) / 2,
    minAngle: dimension > 1 ? 90 : null,
    maxAngle: dimension > 1 ? 90 : null,
    elapsedMilliseconds: 0,
    seed,
    stopReason: "vector-cap",
  };
}

function actionLabel(action: DialogueAction): string {
  return {
    test: "Test it",
    explain: "What did that mean?",
    continue: "Go on",
    change: "Try another dimension",
    retest: "Test again",
  }[action];
}

function formatInteger(value: number): string {
  return value.toLocaleString("en-US");
}

function formatAngle(value: number | null): string {
  return value === null ? "Not yet observed" : `${value.toFixed(3)}°`;
}

function formatDuration(milliseconds: number): string {
  return milliseconds < 1_000
    ? `${milliseconds} ms`
    : `${(milliseconds / 1_000).toFixed(2)} s`;
}

function formatLargeEstimate(log10Total: number): string {
  const exponent = Math.floor(log10Total);
  const mantissa = 10 ** (log10Total - exponent);
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}

function stopReasonLabel(reason: SimulationResult["stopReason"]): string {
  return {
    "vector-cap": "Safe vector cap reached",
    "attempt-cap": "Candidate budget reached",
    "time-cap": "Time budget reached",
    cancelled: "Cancelled by reader",
  }[reason];
}
