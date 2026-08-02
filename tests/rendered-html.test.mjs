import { readFile, readdir } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import { StoryPanel } from "../app/story-panel";

test("replaces the starter preview with the vector theatre", async () => {
  const [page, guidedStory, storyDeck, layout, css, packageJson, packageLock] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/guided-story.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/story-deck.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
  ]);

  expect(storyDeck).toMatch(/How many arrows can stand/);
  expect(storyDeck).toMatch(/Are we ideas\?/);
  expect(storyDeck).toMatch(/At present, rather active ones/);
  expect(guidedStory).toMatch(/Previous story step/);
  expect(guidedStory).toMatch(/Next story step/);
  expect(page).not.toMatch(
    /new Worker|Test it|Verified vectors found|Candidate attempts/,
  );
  expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);

  expect(JSON.parse(packageJson).name).toBe("orthogonalish");
  expect(JSON.parse(packageLock).name).toBe("orthogonalish");
  expect(layout).toMatch(/const title = "orthogonalish"/);
  expect(layout).toMatch(/illustrated lesson/i);
  expect(layout).not.toMatch(/Nearly Orthogonal Society|Estimate—and then test/);
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

test("renders each optional lesson tooltip as a collapsed accessible control", () => {
  const html = renderToStaticMarkup(
    createElement(StoryPanel, {
      estimate: null,
      step: {
        id: "rendered-tooltip",
        scene: "right-angle",
        eyebrow: "A precise term",
        title: "A picture with optional depth",
        image: "/images/two-ideas-right-angle.webp",
        alt: "Two perpendicular glowing lines.",
        rosencrantz: "Show me the extra definition if I ask for it.",
        aside: "The default story remains complete without the definition.",
        bubbles: {
          rosencrantz: { position: "upper-left", tail: "down-right" },
        },
        contextPanel: {
          narrator: "The term is supplementary rather than required reading.",
          term: {
            label: "Orthogonal",
            definition: "Directions meeting at exactly 90 degrees.",
            llmConnection: "Separated features can interfere less.",
          },
        },
      },
    }),
  );

  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('aria-describedby="story-rendered-tooltip-tooltip"');
  expect(html).toContain('id="story-rendered-tooltip-tooltip"');
  expect(html).toContain('role="tooltip"');
});
