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

  it("does not retain calculator, worker, simulation, or secondary dialogue modules", async () => {
    const [appEntries, libEntries] = await Promise.all([
      readdir(new URL(".", import.meta.url)),
      readdir(new URL("../lib", import.meta.url)),
    ]);

    expect(appEntries).not.toEqual(
      expect.arrayContaining(["vector-worker.ts", "vector-worker.test.ts"]),
    );
    expect(libEntries).not.toEqual(
      expect.arrayContaining([
        "dialogue.ts",
        "dialogue.test.ts",
        "simulation.ts",
        "simulation.test.ts",
      ]),
    );
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
    expect(css).toMatch(/\.story-controller\s*\{/);
  });
});
