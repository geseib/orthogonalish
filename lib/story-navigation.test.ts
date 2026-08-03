import { describe, expect, it } from "vitest";

import {
  getPreferredScrollBehavior,
  isActivationTarget,
  isInteractiveTarget,
} from "./story-navigation";

describe("isInteractiveTarget", () => {
  it("protects text-entry and editable content only", () => {
    for (const tagName of ["INPUT", "TEXTAREA", "SELECT"]) {
      expect(isInteractiveTarget({ tagName, isContentEditable: false })).toBe(
        true,
      );
    }
    for (const tagName of ["BUTTON", "A"]) {
      expect(isInteractiveTarget({ tagName, isContentEditable: false })).toBe(
        false,
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

describe("isActivationTarget", () => {
  it("matches buttons, anchors, and role=button", () => {
    expect(isActivationTarget({ tagName: "BUTTON" })).toBe(true);
    expect(isActivationTarget({ tagName: "A" })).toBe(true);
    expect(isActivationTarget({ tagName: "DIV", role: "button" })).toBe(true);
    expect(isActivationTarget({ tagName: "DIV" })).toBe(false);
    expect(isActivationTarget({ tagName: "INPUT" })).toBe(false);
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
