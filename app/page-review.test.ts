import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("retired experiment removal", () => {
  it("brands the public project as lowercase orthogonalish", async () => {
    const [layout, packageJson, packageLock] = await Promise.all([
      readFile(new URL("./layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
    ]);

    expect(JSON.parse(packageJson).name).toBe("orthogonalish");
    expect(JSON.parse(packageLock).name).toBe("orthogonalish");
    expect(layout).toMatch(/const title = "orthogonalish"/);
    expect(layout).toMatch(/illustrated lesson/i);
    expect(layout).not.toMatch(/Nearly Orthogonal Society|Estimate—and then test/);
  });

  it("ships the reviewed orthogonalish social card", async () => {
    const [layout, socialCard] = await Promise.all([
      readFile(new URL("./layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../public/og.png", import.meta.url)),
    ]);

    expect(socialCard.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    expect(socialCard.readUInt32BE(16)).toBe(1200);
    expect(socialCard.readUInt32BE(20)).toBe(630);
    expect(createHash("sha256").update(socialCard).digest("hex")).toBe(
      "2f4c60f534b146a13ddd8d5ae40deeec610a0af2f090181b972bb6340c4982d1",
    );
    expect(layout).toMatch(/url: "\/og\.png"/);
    expect(layout).toMatch(/alt: `\$\{title\}: \$\{illustratedLessonAlt\}`/);
  });

  it("removes the worker, simulation, and dialogue modules once the /machine route is estimator-only", async () => {
    const [appEntries, libEntries] = await Promise.all([
      readdir(new URL(".", import.meta.url)),
      readdir(new URL("../lib", import.meta.url)),
    ]);

    expect(appEntries).not.toContain("vector-worker.ts");
    expect(appEntries).not.toContain("vector-worker.test.ts");
    expect(libEntries).not.toContain("dialogue.ts");
    expect(libEntries).not.toContain("dialogue.test.ts");
    expect(libEntries).not.toContain("simulation.ts");
    expect(libEntries).not.toContain("simulation.test.ts");
  });

  it("keeps the page as a story shell without experiment controls or output", async () => {
    const page = await readFile(new URL("./page.tsx", import.meta.url), "utf8");

    expect(page).not.toMatch(/<input\b/i);
    expect(page).not.toMatch(/preset/i);
    expect(page).not.toMatch(/simulation/i);
    expect(page).not.toMatch(/evidence(?:\s*panel)?/i);
  });

  it("fits each guided story scene to the visual viewport", async () => {
    const css = await readFile(new URL("./globals.css", import.meta.url), "utf8");

    expect(css).toMatch(/\.story-scene\s*\{[^}]*height:\s*100dvh/s);
    expect(css).toMatch(/\.story-scene\s*\{[^}]*overflow:\s*hidden/s);
    expect(css).toMatch(/grid-template-(?:columns|rows):[^;]*minmax\(0,/);
    expect(css).toMatch(/@media\s*\(max-height:\s*700px\)/);
    expect(css).toMatch(/@media\s*\(max-width:\s*620px\)/);
    expect(css).toMatch(/@media\s*\(orientation:\s*landscape\)\s*and\s*\(max-height:\s*520px\)/);
    expect(css).toMatch(/\.story-controller\s*\{/);
  });

  it("puts mobile narrator panels beneath the art while keeping speech on it", async () => {
    const css = await readFile(new URL("./globals.css", import.meta.url), "utf8");

    const narrowPanelRules = css.match(
      /@media\s*\(max-width:\s*620px\)\s*\{([\s\S]*?)@media\s*\(orientation:\s*landscape\)/,
    )?.[1];

    expect(narrowPanelRules).toBeDefined();
    expect(narrowPanelRules).toMatch(
      /\.story-stage-grid\.story-speech-overlay\s+\.story-dialogue\s*\{[\s\S]*?grid-row:\s*2;/,
    );
    expect(narrowPanelRules).toMatch(
      /\.story-stage-grid\.story-speech-overlay\.has-context-panel\s+\.story-context-panel\s*\{[\s\S]*?grid-column:\s*1;[\s\S]*?grid-row:\s*3;/,
    );
  });
});
