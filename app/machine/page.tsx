"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ChangeEvent } from "react";

import {
  estimateStoryTotal,
  estimateRandomSet,
  validateInputs,
  type EstimateResult,
} from "../../lib/estimate";
import styles from "./machine.module.css";

const dimensionPresets = [1, 10, 100, 1_000, 10_000, 12_288] as const;

type FieldErrors = {
  dimension?: string;
  lowerAngle?: string;
  upperAngle?: string;
};

export default function MachinePage() {
  const [dimensionValue, setDimensionValue] = useState("100");
  const [lowerAngleValue, setLowerAngleValue] = useState("88");
  const [upperAngleValue, setUpperAngleValue] = useState("92");
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
  const isValid = Object.values(fieldErrors).every((error) => !error);

  const estimate = useMemo<EstimateResult | null>(() => {
    if (!isValid) return null;
    return estimateRandomSet(
      parsedInputs.dimension,
      parsedInputs.lowerAngle,
      parsedInputs.upperAngle,
    );
  }, [isValid, parsedInputs]);

  function changeDimension(event: ChangeEvent<HTMLInputElement>) {
    setDimensionValue(event.target.value);
  }

  function changeAngle(
    field: "lower" | "upper",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    if (field === "lower") setLowerAngleValue(event.target.value);
    else setUpperAngleValue(event.target.value);
  }

  function chooseDimension(value: number) {
    setDimensionValue(String(value));
    dimensionInputRef.current?.focus();
  }

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/">
        ← Back to the story
      </Link>

      <header className={styles.pageHeader}>
        <h1>Rosencrantz&rsquo;s Dimension Expansion Machine</h1>
        <p className={styles.subtitle}>
          Set the geometry and read the estimated number of nearly orthogonal
          directions.
        </p>
      </header>

      <section
        className={styles.calculatorShell}
        aria-labelledby="calculator-title"
      >
        <div className={styles.calculatorPanel}>
          <p className={styles.sectionNumber} aria-hidden="true">
            I
          </p>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Set the terms</p>
            <h2 id="calculator-title">The geometry</h2>
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
        </div>

        <EstimateCard estimate={estimate} />
      </section>
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
              : `≈ ${estimated.multiplier.toFixed(4)} × ${estimate.dimension.toLocaleString("en-US")} dimensions, rounded down`}
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

function formatLargeEstimate(log10Total: number): string {
  const exponent = Math.floor(log10Total);
  const mantissa = 10 ** (log10Total - exponent);
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}
