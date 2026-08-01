import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

type ReviewExports = {
  getFieldErrors?: (
    dimensionValue: string,
    lowerAngleValue: string,
    upperAngleValue: string,
    values: { dimension: number; lowerAngle: number; upperAngle: number },
  ) => { dimension?: string; lowerAngle?: string; upperAngle?: string };
  getPreferredScrollBehavior?: (
    matchesReducedMotion: (query: string) => { matches: boolean },
  ) => ScrollBehavior;
  safelyStartWorker?: (
    createWorker: () => Pick<Worker, "postMessage" | "terminate">,
    prepareWorker: (worker: Pick<Worker, "postMessage" | "terminate">) => void,
    message: unknown,
  ) => {
    worker: Pick<Worker, "postMessage" | "terminate"> | null;
    error: string | null;
  };
};

async function reviewExports(): Promise<ReviewExports> {
  return (await import("./page")) as ReviewExports;
}

describe("calculator review regressions", () => {
  it("rejects the geometrically degenerate full angle range", async () => {
    const { getFieldErrors } = await reviewExports();

    expect(getFieldErrors).toBeTypeOf("function");
    expect(getFieldErrors?.("100", "0", "180", {
      dimension: 100,
      lowerAngle: 0,
      upperAngle: 180,
    })).toMatchObject({
      upperAngle: expect.stringMatching(/full 0°–180° range|degenerate/i),
    });
    expect(getFieldErrors?.("100", "88", "92", {
      dimension: 100,
      lowerAngle: 88,
      upperAngle: 92,
    })).toEqual({});
  });

  it("chooses non-smooth scrolling when reduced motion is requested", async () => {
    const { getPreferredScrollBehavior } = await reviewExports();

    expect(getPreferredScrollBehavior).toBeTypeOf("function");
    expect(getPreferredScrollBehavior?.(() => ({ matches: true }))).toBe("auto");
    expect(getPreferredScrollBehavior?.(() => ({ matches: false }))).toBe("smooth");
  });

  it("normalizes synchronous worker construction and startup failures", async () => {
    const { safelyStartWorker } = await reviewExports();
    expect(safelyStartWorker).toBeTypeOf("function");

    expect(
      safelyStartWorker?.(
        () => {
          throw new Error("construction failed");
        },
        () => undefined,
        { type: "start" },
      ),
    ).toEqual({
      worker: null,
      error: "The experiment could not start in this browser.",
    });

    let terminated = false;
    const partialWorker = {
      postMessage() {
        throw new Error("post failed");
      },
      terminate() {
        terminated = true;
      },
    };
    expect(
      safelyStartWorker?.(
        () => partialWorker,
        () => undefined,
        { type: "start" },
      ),
    ).toEqual({
      worker: null,
      error: "The experiment could not start in this browser.",
    });
    expect(terminated).toBe(true);
  });

  it("keeps reviewed accessibility contracts in the rendered source", async () => {
    const [page, css, packageJson, packageLock] = await Promise.all([
      readFile(new URL("./page.tsx", import.meta.url), "utf8"),
      readFile(new URL("./globals.css", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
    ]);

    const inputReset = page.match(
      /function markInputChange[\s\S]*?\n  }/,
    )?.[0];
    expect(inputReset).toMatch(/setRunStatus\("idle"\)/);
    expect(page).toMatch(/key="lesson-toggle"/);
    expect(page).toMatch(/className="progress-announcement" role="status"/);
    expect(page).not.toMatch(/className="run-progress" aria-live/);
    expect(page).toMatch(/role="group" aria-label="Dimension presets"/);
    expect(page).toMatch(/aria-label=\{`Set dimension to/);

    expect(css).toMatch(/--focus-dark:\s*#[0-9a-f]{6}/i);
    expect(css).toMatch(/\.calculator-shell[\s\S]*:focus-visible[\s\S]*var\(--focus-dark\)/);
    expect(css).toMatch(/\.evidence[\s\S]*:focus-visible[\s\S]*var\(--focus-dark\)/);
    expect(css).not.toMatch(
      /\.input-with-unit input:focus-visible\s*\{[^}]*outline:\s*0/,
    );
    expect(css).toMatch(/\.evidence \.eyebrow\s*\{[^}]*#[0-4][0-9a-f]{5}/i);

    expect(JSON.parse(packageJson).name).toBe("nearly-orthogonal-society");
    expect(JSON.parse(packageLock).name).toBe("nearly-orthogonal-society");
    expect(JSON.parse(packageLock).packages[""].name).toBe(
      "nearly-orthogonal-society",
    );
  });
});
