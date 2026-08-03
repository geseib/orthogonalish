"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getGuidedEstimate,
  moveStoryStep,
  storySteps,
  type StoryScene,
} from "../lib/story-deck";
import {
  getPreferredScrollBehavior,
  isActivationTarget,
  isInteractiveTarget,
} from "../lib/story-navigation";
import { StoryPanel } from "./story-panel";

const sceneOrder = storySteps.reduce<StoryScene[]>((scenes, step) => {
  if (!scenes.includes(step.scene)) scenes.push(step.scene);
  return scenes;
}, []);

const transitionMilliseconds = 360;

export function keyboardStoryDirection(
  key: string,
): "previous" | "next" | null {
  if (key === "ArrowDown" || key === "PageDown" || key === " " || key === "Spacebar") {
    return "next";
  }
  if (key === "ArrowUp" || key === "PageUp") return "previous";
  return null;
}

export function GuidedStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const transitionLockedRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = storySteps[activeIndex];

  useEffect(
    () => () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    },
    [],
  );

  const releaseNavigationLock = useCallback(() => {
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      transitionLockedRef.current = false;
      return;
    }
    unlockTimerRef.current = setTimeout(() => {
      transitionLockedRef.current = false;
    }, transitionMilliseconds);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: getPreferredScrollBehavior(window.matchMedia.bind(window)),
      block: "start",
    });
  }, []);

  const navigate = useCallback(
    (direction: "previous" | "next") => {
      if (transitionLockedRef.current) return;

      const destination = moveStoryStep(activeIndex, direction);
      if (destination.index === activeIndex) return;

      transitionLockedRef.current = true;
      setActiveIndex(destination.index);
      // Always re-center the destination scene, not just on scene changes, so a
      // page that has drifted a few pixels snaps back on track with one arrow.
      const nextScene = storySteps[destination.index].scene;
      requestAnimationFrame(() => scrollTo(`story-${nextScene}`));
      releaseNavigationLock();
    }, [activeIndex, releaseNavigationLock, scrollTo],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Ignore arrows while the machine overlay is open so the story behind it
      // keeps its place.
      if (document.documentElement.dataset.machineOpen === "true") return;
      if (isInteractiveTarget(event.target as HTMLElement | null)) return;
      const direction = keyboardStoryDirection(event.key);
      if (!direction) return;
      // Space counts as "next", but when a button/anchor is focused it must
      // activate that control instead of advancing the story.
      if (
        (event.key === " " || event.key === "Spacebar") &&
        isActivationTarget(event.target as HTMLElement | null)
      ) {
        return;
      }
      event.preventDefault();
      navigate(direction);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  const firstStepByScene = useMemo(
    () =>
      Object.fromEntries(
        sceneOrder.map((scene) => [
          scene,
          storySteps.find((candidate) => candidate.scene === scene)!,
        ]),
      ) as Record<StoryScene, (typeof storySteps)[number]>,
    [],
  );

  return (
    <div className="guided-story">
      {sceneOrder.map((scene) => {
        const isActive = step.scene === scene;
        const visibleStep = isActive ? step : firstStepByScene[scene];
        const estimate = getGuidedEstimate(visibleStep);
        return (
          <section
            className={`story-scene story-scene-${scene}`}
            id={`story-${scene}`}
            data-story-section
            key={scene}
            aria-labelledby={`story-${scene}-title`}
          >
            <StoryPanel
              step={visibleStep}
              estimate={estimate}
              priority={scene === "cold-open"}
              bubbleGeneration={isActive ? `active-${activeIndex}` : `preview-${scene}`}
            />
          </section>
        );
      })}

      <nav className="story-controller" aria-label="Story navigation">
        <button
          type="button"
          aria-label="Previous story step"
          onClick={() => navigate("previous")}
          disabled={activeIndex === 0}
        >
          ↑
        </button>
        <span aria-live="polite">
          {activeIndex + 1} / {storySteps.length}
        </span>
        <button
          type="button"
          aria-label="Next story step"
          onClick={() => navigate("next")}
          disabled={activeIndex === storySteps.length - 1}
        >
          ↓
        </button>
      </nav>
    </div>
  );
}
