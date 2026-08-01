export type NavigationDecision =
  | { kind: "none" }
  | { kind: "section"; index: number }
  | { kind: "beat"; direction: "previous" | "next" };

export function resolveStoryNavigation(
  key: string,
  currentSectionIndex: number,
  sectionCount: number,
  currentSectionHasBeats: boolean,
): NavigationDecision {
  if (key === "ArrowDown") {
    return {
      kind: "section",
      index: Math.min(sectionCount - 1, currentSectionIndex + 1),
    };
  }
  if (key === "ArrowUp") {
    return { kind: "section", index: Math.max(0, currentSectionIndex - 1) };
  }
  if (currentSectionHasBeats && key === "ArrowRight") {
    return { kind: "beat", direction: "next" };
  }
  if (currentSectionHasBeats && key === "ArrowLeft") {
    return { kind: "beat", direction: "previous" };
  }
  return { kind: "none" };
}

export function isInteractiveTarget(
  target: { tagName?: string; isContentEditable?: boolean } | null,
): boolean {
  if (!target) return false;
  return (
    Boolean(target.isContentEditable) ||
    ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
      target.tagName?.toUpperCase() ?? "",
    )
  );
}

export function getPreferredScrollBehavior(
  matchesReducedMotion: (query: string) => { matches: boolean },
): ScrollBehavior {
  return matchesReducedMotion("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}
