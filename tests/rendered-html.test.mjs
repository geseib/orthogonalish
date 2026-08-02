import { readFile, readdir } from "node:fs/promises";
import { expect, test } from "vitest";

test("replaces the starter preview with the vector theatre", async () => {
  const [page, guidedStory, storyDeck, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/guided-story.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/story-deck.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  expect(storyDeck).toMatch(/How many arrows can stand/);
  expect(guidedStory).toMatch(/Previous story step/);
  expect(guidedStory).toMatch(/Next story step/);
  expect(page).toMatch(/Estimated total vectors/);
  expect(page).toMatch(/Verified vectors found/);
  expect(page).toMatch(/What did that mean\?/);
  expect(page).toMatch(/new Worker/);
  expect(page).toMatch(/workerRef\.current\?\.terminate\(\)/);
  expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);

  expect(layout).toMatch(/title:\s*"The Nearly Orthogonal Society"/);
  expect(layout).toMatch(
    /Estimate—and then test—how many nearly perpendicular vectors/,
  );
  expect(page).not.toMatch(/SkeletonPreview|codex-preview/);
  expect(layout).not.toMatch(/Starter Project|codex-preview/);
  expect(packageJson).not.toMatch(/react-loading-skeleton/);

  const previewFiles = await readdir(
    new URL("../app/_sites-preview", import.meta.url),
  ).catch((error) => {
    if (error?.code === "ENOENT") return [];
    throw error;
  });
  expect(previewFiles).toEqual([]);
});
