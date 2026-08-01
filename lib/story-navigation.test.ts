import { describe, expect, it } from "vitest";

import {
  getPreferredScrollBehavior,
  isInteractiveTarget,
  resolveStoryNavigation,
} from "./story-navigation";

describe("resolveStoryNavigation", () => {
  it("maps vertical keys to adjacent sections without wrapping", () => {
    expect(resolveStoryNavigation("ArrowDown", 1, 5, true)).toEqual({
      kind: "section",
      index: 2,
    });
    expect(resolveStoryNavigation("ArrowUp", 0, 5, true)).toEqual({
      kind: "section",
      index: 0,
    });
  });

  it("maps horizontal keys only when the current section has beats", () => {
    expect(resolveStoryNavigation("ArrowRight", 1, 5, true)).toEqual({
      kind: "beat",
      direction: "next",
    });
    expect(resolveStoryNavigation("ArrowLeft", 3, 5, false)).toEqual({
      kind: "none",
    });
  });
});

describe("isInteractiveTarget", () => {
  it("protects focused controls and editable content", () => {
    for (const tagName of ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]) {
      expect(isInteractiveTarget({ tagName, isContentEditable: false })).toBe(
        true,
      );
    }
    expect(
      isInteractiveTarget({ tagName: "DIV", isContentEditable: true }),
    ).toBe(true);
    expect(
      isInteractiveTarget({ tagName: "DIV", isContentEditable: false }),
    ).toBe(false);
  });
});

describe("getPreferredScrollBehavior", () => {
  it("uses immediate movement when reduced motion is requested", () => {
    expect(getPreferredScrollBehavior(() => ({ matches: true }))).toBe("auto");
    expect(getPreferredScrollBehavior(() => ({ matches: false }))).toBe(
      "smooth",
    );
  });
});
