import { describe, expect, it } from "vitest";

import { localBindingConfig } from "../vite.config";

describe("local image optimization bindings", () => {
  it("provides the asset and image bindings used by the worker", () => {
    expect(localBindingConfig).toMatchObject({
      assets: { binding: "ASSETS" },
      images: { binding: "IMAGES" },
    });
  });
});
