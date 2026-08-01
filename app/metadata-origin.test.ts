import { describe, expect, it } from "vitest";

import {
  parseTrustedForwardedHosts,
  resolveMetadataBase,
} from "./metadata-origin";

function headers(values: Record<string, string | null>): Pick<Headers, "get"> {
  return {
    get(name: string) {
      return values[name.toLowerCase()] ?? null;
    },
  };
}

describe("resolveMetadataBase", () => {
  it("prefers Host over forwarded host", () => {
    const origin = resolveMetadataBase(
      headers({
        host: "vectors.example",
        "x-forwarded-host": "spoofed.example",
        "x-forwarded-proto": "https",
      }),
      { trustedForwardedHosts: ["spoofed.example"] },
    );

    expect(origin.href).toBe("https://vectors.example/");
  });

  it("uses an allowlisted forwarded host only when Host is unavailable", () => {
    const origin = resolveMetadataBase(
      headers({
        host: null,
        "x-forwarded-host": "public.example",
        "x-forwarded-proto": "https",
      }),
      { trustedForwardedHosts: ["public.example"] },
    );

    expect(origin.href).toBe("https://public.example/");
  });

  it("rejects untrusted forwarded hosts and malformed protocols", () => {
    const origin = resolveMetadataBase(
      headers({
        host: null,
        "x-forwarded-host": "spoofed.example",
        "x-forwarded-proto": "javascript",
      }),
    );

    expect(origin.href).toBe("http://localhost:3000/");
  });

  it("falls back safely for malformed hosts and fallback schemes", () => {
    const origin = resolveMetadataBase(headers({ host: "example.com/path" }), {
      fallback: "file:///etc/passwd",
    });

    expect(origin.href).toBe("http://localhost:3000/");
  });
});

describe("parseTrustedForwardedHosts", () => {
  it("parses a comma-delimited explicit allowlist", () => {
    expect(parseTrustedForwardedHosts("one.example, two.example:8443")).toEqual([
      "one.example",
      "two.example:8443",
    ]);
  });
});
