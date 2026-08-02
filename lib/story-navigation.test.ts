import { describe, expect, it } from "vitest";

import {
  getPreferredScrollBehavior,
  isInteractiveTarget,
} from "./story-navigation";

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
