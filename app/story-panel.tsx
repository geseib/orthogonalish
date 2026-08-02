"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import type { StoryEstimate } from "../lib/estimate";
import type {
  BubblePlacement,
  StoryDialogueTurn,
  StoryProp,
  StorySpeaker,
  StoryStep,
  StoryTooltip,
} from "../lib/story-deck";

const defaultRosencrantzPlacement: BubblePlacement = {
  position: "upper-left",
  tail: "down-right",
};

const defaultGuildensternPlacement: BubblePlacement = {
  position: "lower-right",
  tail: "up-left",
};

export function bubbleClassName(placement: BubblePlacement) {
  return `story-bubble position-${placement.position} tail-${placement.tail}`;
}

export type TooltipState = {
  isOpen: boolean;
  pointerFocusPending: boolean;
};

export type TooltipInteraction =
  | "pointer-down"
  | "pointer-enter"
  | "pointer-leave"
  | "focus"
  | "blur"
  | "click"
  | "escape";

export function tooltipStateAfter(
  state: TooltipState,
  interaction: TooltipInteraction,
): TooltipState {
  switch (interaction) {
    case "pointer-down":
      return { ...state, pointerFocusPending: true };
    case "pointer-enter":
      return { isOpen: true, pointerFocusPending: false };
    case "focus":
      return state.pointerFocusPending ? state : { ...state, isOpen: true };
    case "click":
      return { isOpen: !state.isOpen, pointerFocusPending: false };
    case "pointer-leave":
    case "blur":
    case "escape":
      return { isOpen: false, pointerFocusPending: false };
  }
}

export function StoryPanel({
  step,
  estimate,
  priority = false,
}: {
  step: StoryStep;
  estimate: StoryEstimate | null;
  priority?: boolean;
}) {
  const dialogueTurns = storyDialogueTurns(step);
  const hasSpeechOverlay = Boolean(step.bubbles || step.dialogue);
  const hasContextPanel = Boolean(step.contextPanel);
  const isTitle = step.scene === "title";

  return (
    <div
      className={`story-stage-grid${isTitle ? " story-title-grid" : ""}${hasSpeechOverlay ? " story-speech-overlay" : ""}${hasContextPanel ? " has-context-panel" : ""}`}
      data-dialogue-placement={hasSpeechOverlay ? "overlay" : "beside"}
    >
      <header className="story-heading">
        <p className="eyebrow">{step.eyebrow}</p>
        <h1 id={`story-${step.scene}-title`}>{step.title}</h1>
      </header>

      {step.image ? (
        <div className="story-art-frame">
          <Image
            src={step.image}
            alt={step.alt ?? ""}
            width={1774}
            height={887}
            sizes="(max-width: 620px) 100vw, 68vw"
            priority={priority}
          />
          {step.prop ? <StoryPropOverlay prop={step.prop} /> : null}
        </div>
      ) : (
        <div className="story-title-mark" aria-hidden="true" />
      )}

      {isTitle ? null : (
        <div
          className={`story-dialogue${dialogueTurns.length > 1 ? " has-two-speakers" : ""}${dialogueTurns.length === 3 ? " has-three-turns" : ""}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {dialogueTurns.map((turn, index) => (
            <SpeechBubble
              key={`${turn.speaker}-${index}`}
              speaker={turn.speaker}
              placement={turn.placement}
            >
              {turn.text}
            </SpeechBubble>
          ))}
        </div>
      )}

      {step.guidedInput && estimate ? (
        <aside className="story-estimate" aria-live="polite">
          <span>{step.guidedInput.dimension.toLocaleString("en-US")} dimensions</span>
          <strong>{estimate.total.toLocaleString("en-US")}</strong>
          <small>estimated total vectors · rounded down</small>
        </aside>
      ) : null}

      {step.contextPanel ? (
        <NarratorPanel
          stepId={step.id}
          heading={step.contextPanel.heading}
          narrator={step.contextPanel.narrator}
          aside={step.aside}
          term={step.contextPanel.term}
        />
      ) : (
        <p className="story-aside">
          <span>Aside</span>
          {step.aside}
        </p>
      )}
    </div>
  );
}

function storyDialogueTurns(step: StoryStep): readonly StoryDialogueTurn[] {
  if (step.dialogue) return step.dialogue;

  const turns: StoryDialogueTurn[] = [
    {
      speaker: "rosencrantz",
      text: step.rosencrantz,
      placement: step.bubbles?.rosencrantz ?? defaultRosencrantzPlacement,
    },
  ];

  if (step.guildenstern) {
    turns.push({
      speaker: "guildenstern",
      text: step.guildenstern,
      placement: step.bubbles?.guildenstern ?? defaultGuildensternPlacement,
    });
  }

  return turns;
}

function SpeechBubble({
  speaker,
  placement,
  children,
}: {
  speaker: StorySpeaker;
  placement: BubblePlacement;
  children: ReactNode;
}) {
  const citation =
    speaker === "rosencrantz"
      ? "Rosencrantz · experimentalist"
      : "Guildenstern · theorist";

  return (
    <blockquote className={`${bubbleClassName(placement)} speaker-${speaker}`}>
      <p>{children}</p>
      <cite>{citation}</cite>
    </blockquote>
  );
}

function NarratorPanel({
  stepId,
  heading,
  narrator,
  aside,
  term,
}: {
  stepId: string;
  heading?: string;
  narrator: string;
  aside: string;
  term?: StoryTooltip;
}) {
  return (
    <aside
      className="story-context-panel"
      aria-labelledby={`story-${stepId}-context-title`}
    >
      <h2 id={`story-${stepId}-context-title`}>
        {heading ?? "What the picture establishes"}
      </h2>
      <p className="story-context-copy">{narrator}</p>
      {term ? <TermTooltip key={stepId} stepId={stepId} term={term} /> : null}
      <p className="story-context-aside">
        <span>Aside</span>
        {aside}
      </p>
    </aside>
  );
}

function TermTooltip({ stepId, term }: { stepId: string; term: StoryTooltip }) {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isOpen: false,
    pointerFocusPending: false,
  });
  const tooltipId = `story-${stepId}-tooltip`;
  const transitionTooltip = (interaction: TooltipInteraction) => {
    setTooltipState((state) => tooltipStateAfter(state, interaction));
  };

  return (
    <div
      className="story-term-wrap"
      data-open={tooltipState.isOpen ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") transitionTooltip("pointer-enter");
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") transitionTooltip("pointer-leave");
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          transitionTooltip("blur");
        }
      }}
    >
      <p>Look closer</p>
      <button
        className="story-term"
        type="button"
        aria-label={term.label}
        aria-describedby={tooltipId}
        aria-expanded={tooltipState.isOpen}
        onPointerDown={() => transitionTooltip("pointer-down")}
        onClick={() => transitionTooltip("click")}
        onFocus={() => transitionTooltip("focus")}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            transitionTooltip("escape");
          }
        }}
      >
        {term.label}
        <span aria-hidden="true">?</span>
      </button>
      <span className="story-tooltip" id={tooltipId} role="tooltip">
        <strong>{term.definition}</strong>
        <span>{term.llmConnection}</span>
      </span>
    </div>
  );
}

function StoryPropOverlay({ prop }: { prop: StoryProp }) {
  switch (prop.kind) {
    case "boxes":
      return (
        <div className="story-prop story-prop-boxes" aria-label={prop.label}>
          <strong>{prop.label}</strong>
          <div>{prop.values.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>
        </div>
      );
    case "tags":
      return (
        <div className="story-prop story-prop-tags">
          {prop.values.map((value) => <span key={value}>{value}</span>)}
        </div>
      );
    case "ratio":
      return (
        <div className="story-prop story-prop-ratio">
          <strong>{prop.expression}</strong>
          <span>{prop.caption}</span>
        </div>
      );
    case "vast-board":
      return <div className="story-prop story-prop-vast-board">{prop.count.toLocaleString("en-US")} boxes</div>;
    case "call":
      return (
        <div className="story-prop story-prop-call">
          {prop.lines.map((line) => <strong key={line}>{line}</strong>)}
        </div>
      );
  }
}
