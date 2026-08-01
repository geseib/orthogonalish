"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";

import { introScenes, moveBeat } from "../lib/intro-story";
import {
  getPreferredScrollBehavior,
  isInteractiveTarget,
  resolveStoryNavigation,
} from "../lib/story-navigation";

const allSectionIds = [
  "opening",
  "intro-right-angle",
  "intro-one-more",
  "calculator",
  "stage",
  "evidence",
] as const;

export function IntroSequence() {
  const [beatIndexes, setBeatIndexes] = useState([0, 0]);
  const [openLessons, setOpenLessons] = useState([false, false]);

  const changeBeat = useCallback(
    (sceneIndex: number, direction: "previous" | "next") => {
      setBeatIndexes((current) =>
        current.map((beat, index) =>
          index === sceneIndex
            ? moveBeat(beat, introScenes[index].beats.length, direction)
            : beat,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isInteractiveTarget(event.target as HTMLElement | null)) return;

      const sections = allSectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));
      if (sections.length === 0) return;

      const currentIndex = sections.reduce(
        (best, section, index) =>
          Math.abs(section.getBoundingClientRect().top) <
          Math.abs(sections[best].getBoundingClientRect().top)
            ? index
            : best,
        0,
      );
      const sceneIndex = introScenes.findIndex(
        (scene) => scene.id === sections[currentIndex]?.id,
      );
      const decision = resolveStoryNavigation(
        event.key,
        currentIndex,
        sections.length,
        sceneIndex >= 0,
      );

      if (decision.kind === "none") return;
      event.preventDefault();
      if (decision.kind === "beat") {
        changeBeat(sceneIndex, decision.direction);
        return;
      }
      sections[decision.index]?.scrollIntoView({
        behavior: getPreferredScrollBehavior(window.matchMedia.bind(window)),
        block: "start",
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeBeat]);

  return (
    <Fragment>
      {introScenes.map((scene, sceneIndex) => {
        const beatIndex = beatIndexes[sceneIndex];
        const beat = scene.beats[beatIndex];
        const previousSection = sceneIndex === 0 ? "opening" : introScenes[sceneIndex - 1].id;
        const nextSection = introScenes[sceneIndex + 1]?.id ?? "calculator";

        return (
          <section
            className="intro-scene"
            id={scene.id}
            data-story-section
            key={scene.id}
            aria-labelledby={`${scene.id}-title`}
          >
            <div className="intro-scene-heading">
              <p className="eyebrow">
                Scene {scene.number} · {scene.eyebrow}
              </p>
              <h2 id={`${scene.id}-title`}>{scene.title}</h2>
            </div>

            <div className="intro-art-frame">
              <Image
                src={scene.image}
                alt={scene.alt}
                width={1774}
                height={887}
                sizes="(max-width: 620px) 100vw, 90vw"
              />
            </div>

            <div className="intro-dialogue" aria-live="polite" aria-atomic="true">
              <blockquote>
                <p>{beat.rosencrantz}</p>
                <cite>Rosencrantz · experimentalist</cite>
              </blockquote>
              <blockquote>
                <p>{beat.guildenstern}</p>
                <cite>Guildenstern · theorist</cite>
              </blockquote>
            </div>

            <p className="intro-aside">
              <span>Aside</span>
              {beat.aside}
            </p>
            {openLessons[sceneIndex] ? (
              <p className="intro-lesson">{scene.lesson}</p>
            ) : null}

            <div className="intro-controls">
              <button
                type="button"
                aria-label="Previous dialogue beat"
                onClick={() => changeBeat(sceneIndex, "previous")}
                disabled={beatIndex === 0}
              >
                ←
              </button>
              <span>
                {beatIndex + 1} / {scene.beats.length}
              </span>
              <button
                type="button"
                aria-label="Next dialogue beat"
                onClick={() => changeBeat(sceneIndex, "next")}
                disabled={beatIndex === scene.beats.length - 1}
              >
                →
              </button>
              <button
                type="button"
                aria-expanded={openLessons[sceneIndex]}
                onClick={() =>
                  setOpenLessons((current) =>
                    current.map((open, index) =>
                      index === sceneIndex ? !open : open,
                    ),
                  )
                }
              >
                {openLessons[sceneIndex] ? "Go on" : "What did that mean?"}
              </button>
            </div>

            <nav className="story-section-nav" aria-label="Move between story sections">
              <a className="story-up" href={`#${previousSection}`} aria-label="Previous section">
                <span aria-hidden="true">↑</span>
              </a>
              <span>sections</span>
              <a
                className="story-down"
                href={`#${nextSection}`}
                aria-label={`Continue to ${sceneIndex === 0 ? "the next scene" : "the calculator"}`}
              >
                <span aria-hidden="true">↓</span>
              </a>
            </nav>
          </section>
        );
      })}
    </Fragment>
  );
}
