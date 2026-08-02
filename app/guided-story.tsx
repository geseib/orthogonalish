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
  isInteractiveTarget,
} from "../lib/story-navigation";
import { StoryPanel } from "./story-panel";

const sceneOrder = storySteps.reduce<StoryScene[]>((scenes, step) => {
  if (!scenes.includes(step.scene)) scenes.push(step.scene);
  return scenes;
}, []);

const transitionMilliseconds = 360;

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
      if (destination.sceneChanged) {
        const nextScene = storySteps[destination.index].scene;
        requestAnimationFrame(() => scrollTo(`story-${nextScene}`));
      }
      releaseNavigationLock();
    }, [activeIndex, releaseNavigationLock, scrollTo],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isInteractiveTarget(event.target as HTMLElement | null)) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        navigate("next");
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        navigate("previous");
      }
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
        const visibleStep = step.scene === scene ? step : firstStepByScene[scene];
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
