import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  StoryPanel,
  bubbleClassName,
  tooltipStateAfter,
  type TooltipState,
} from "./story-panel";
import { storySteps } from "../lib/story-deck";

describe("illustrated story panel", () => {
  it("derives semantic bubble placement classes", () => {
    expect(
      bubbleClassName({ position: "upper-left", tail: "down-right" }),
    ).toBe("story-bubble position-upper-left tail-down-right");
    expect(
      bubbleClassName({ position: "lower-right", tail: "up-left" }),
    ).toBe("story-bubble position-lower-right tail-up-left");
  });

  it("keeps tooltip visibility and ARIA state synchronized across input methods", () => {
    const initial: TooltipState = { isOpen: false, pointerFocusPending: false };
    const interact = (
      actions: Parameters<typeof tooltipStateAfter>[1][],
      start = initial,
    ) => actions.reduce(tooltipStateAfter, start);

    expect(interact(["focus"])).toMatchObject({ isOpen: true });
    expect(interact(["focus", "escape"])).toMatchObject({ isOpen: false });
    expect(interact(["focus", "blur"])).toMatchObject({ isOpen: false });
    expect(interact(["pointer-enter", "focus", "escape"])).toMatchObject({
      isOpen: false,
    });
    expect(interact(["pointer-enter", "pointer-leave"])).toMatchObject({
      isOpen: false,
    });

    const openedByTouchClick = interact(["pointer-down", "focus", "click"]);
    expect(openedByTouchClick).toMatchObject({ isOpen: true });
    expect(interact(["pointer-down", "click"], openedByTouchClick)).toMatchObject({
      isOpen: false,
    });

    expect(interact(["pointer-down", "focus", "click"], {
      isOpen: true,
      pointerFocusPending: false,
    })).toMatchObject({ isOpen: false });
  });

  it("places every mobile speech-overlay dialogue over the artwork", async () => {
    const css = await readFile(new URL("./globals.css", import.meta.url), "utf8");

    expect(css).toMatch(
      /\.story-stage-grid\.story-speech-overlay \.story-dialogue \{[\s\S]*?grid-column: 1;[\s\S]*?grid-row: 2;/,
    );
  });

  it("imports the estimate shape from its defining module", async () => {
    const source = await readFile(
      new URL("./story-panel.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toMatch(
      /import type \{ StoryEstimate \} from "\.\.\/lib\/estimate"/,
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

  it("uses each step ID as the term tooltip reconciliation boundary", () => {
    const steps = [
      {
        id: "right-angle-meeting",
        scene: "right-angle" as const,
        eyebrow: "Two different ideas",
        title: "A perfect right angle",
        rosencrantz: "Two lines meet.",
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
      {
        id: "shared-board",
        scene: "shared-board" as const,
        eyebrow: "The Shared Board",
        title: "A shared space",
        rosencrantz: "One board holds many ideas.",
        aside: "The board is shared.",
        contextPanel: {
          narrator: "A large space keeps unrelated patterns separate.",
          term: {
            label: "Interference",
            definition: "Unwanted overlap between represented features.",
            llmConnection: "Small overlap helps a language model read features.",
          },
        },
      },
    ];

    const tooltipKeys = steps.map((step) => {
      const panel = StoryPanel({ estimate: null, step });
      const contextPanel = panel.props.children.find(
        (child: { props?: { stepId?: string } }) =>
          child?.props?.stepId === step.id,
      );
      const context = contextPanel.type(contextPanel.props);
      const tooltip = context.props.children[3];

      return tooltip.key;
    });

    expect(tooltipKeys).toEqual(["right-angle-meeting", "shared-board"]);
  });

  it("renders the vast-board exchange in its authored turn order", () => {
    const markup = renderToStaticMarkup(
      createElement(StoryPanel, {
        estimate: null,
        step: storySteps.find((step) => step.id === "board-vast")!,
      }),
    );
    const firstGuildenstern =
      "In 12,288 boxes, ordinary coin-flip wobble leaves about 111 unmatched signs: less than one percent.";
    const rosencrantz = "There are more mistakes.";
    const finalGuildenstern =
      "And far less mistake compared with the board.";

    expect(markup).toContain(firstGuildenstern);
    expect(markup).toContain(rosencrantz);
    expect(markup).toContain(finalGuildenstern);
    expect(markup.indexOf(firstGuildenstern)).toBeLessThan(
      markup.indexOf(rosencrantz),
    );
    expect(markup.indexOf(rosencrantz)).toBeLessThan(
      markup.indexOf(finalGuildenstern),
    );
  });
});
