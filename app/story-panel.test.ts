import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  StoryPanel,
  bubbleClassName,
  shouldCloseTooltipOnMouseLeave,
  tooltipNextState,
} from "./story-panel";

describe("illustrated story panel", () => {
  it("derives semantic bubble placement classes", () => {
    expect(
      bubbleClassName({ position: "upper-left", tail: "down-right" }),
    ).toBe("story-bubble position-upper-left tail-down-right");
    expect(
      bubbleClassName({ position: "lower-right", tail: "up-left" }),
    ).toBe("story-bubble position-lower-right tail-up-left");
  });

  it("keeps the tooltip expanded when its trigger retains focus after mouse leave", () => {
    expect(shouldCloseTooltipOnMouseLeave(true)).toBe(false);
    expect(shouldCloseTooltipOnMouseLeave(false)).toBe(true);
  });

  it("updates tooltip state for touch/click, hover, focus, Escape, and blur", () => {
    expect(tooltipNextState(false, "click")).toBe(true);
    expect(tooltipNextState(true, "click")).toBe(false);
    expect(tooltipNextState(false, "hover")).toBe(true);
    expect(tooltipNextState(false, "focus")).toBe(true);
    expect(tooltipNextState(true, "escape")).toBe(false);
    expect(tooltipNextState(true, "blur")).toBe(false);
  });

  it("places every mobile speech-overlay dialogue over the artwork", async () => {
    const css = await readFile(new URL("./globals.css", import.meta.url), "utf8");

    expect(css).toMatch(
      /\.story-stage-grid\.story-speech-overlay \.story-dialogue \{[\s\S]*?grid-column: 1;[\s\S]*?grid-row: 2;/,
    );
  });

  it("renders narrator and tooltip semantics alongside both character citations", () => {
    const markup = renderToStaticMarkup(
      createElement(StoryPanel, {
        estimate: null,
        step: {
          id: "right-angle-meeting",
          scene: "right-angle",
          eyebrow: "Two different ideas",
          title: "A perfect right angle",
          image: "/images/two-ideas-right-angle.webp",
          alt: "Two luminous lines meet at a right angle.",
          rosencrantz: "Two lines meet.",
          guildenstern: "They meet at exactly 90°.",
          bubbles: {
            rosencrantz: { position: "upper-left", tail: "down-right" },
            guildenstern: { position: "lower-right", tail: "up-left" },
          },
          aside: "A right angle marks separate directions.",
          contextPanel: {
            narrator: "A right angle is the cleanest possible separation.",
            term: {
              label: "Orthogonal",
              definition: "Directions that meet at exactly 90°.",
              llmConnection: "They interfere very little.",
            },
          },
        },
      }),
    );

    expect(markup).toContain('role="tooltip"');
    expect(markup).toContain('aria-label="Orthogonal"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain(
      'aria-describedby="story-right-angle-meeting-tooltip"',
    );
    expect(markup).toContain('id="story-right-angle-meeting-tooltip"');
    expect(markup).toContain("What the picture establishes");
    expect(markup).toContain("Rosencrantz · experimentalist");
    expect(markup).toContain("Guildenstern · theorist");
  });
});
