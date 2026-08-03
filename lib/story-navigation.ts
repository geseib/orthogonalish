export function isInteractiveTarget(
  target: { tagName?: string; isContentEditable?: boolean } | null,
): boolean {
  if (!target) return false;
  return (
    Boolean(target.isContentEditable) ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(
      target.tagName?.toUpperCase() ?? "",
    )
  );
}

export function isActivationTarget(
  target: { tagName?: string; role?: string | null } | null,
): boolean {
  if (!target) return false;
  return (
    ["BUTTON", "A"].includes(target.tagName?.toUpperCase() ?? "") ||
    target.role === "button"
  );
}

export function getPreferredScrollBehavior(
  matchesReducedMotion: (query: string) => { matches: boolean },
): ScrollBehavior {
  return matchesReducedMotion("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}
