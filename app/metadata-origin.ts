type HeaderReader = Pick<Headers, "get">;

type MetadataOriginOptions = {
  trustedForwardedHosts?: readonly string[];
  fallback?: string;
};

const defaultFallback = "http://localhost:3000";

/** Resolves a safe request origin for absolute social metadata URLs. */
export function resolveMetadataBase(
  requestHeaders: HeaderReader,
  options: MetadataOriginOptions = {},
): URL {
  const protocol = safeProtocol(requestHeaders.get("x-forwarded-proto"));
  const directHost = firstHeaderValue(requestHeaders.get("host"));
  const directOrigin = parseOrigin(directHost, protocol ?? inferredProtocol(directHost));

  if (directOrigin) return directOrigin;

  const forwardedHost = firstHeaderValue(requestHeaders.get("x-forwarded-host"));
  const forwardedOrigin = parseOrigin(
    forwardedHost,
    protocol ?? inferredProtocol(forwardedHost),
  );
  const trustedHosts = normalizedTrustedHosts(options.trustedForwardedHosts ?? []);

  if (forwardedOrigin && trustedHosts.has(forwardedOrigin.host.toLowerCase())) {
    return forwardedOrigin;
  }

  return safeFallback(options.fallback);
}

export function parseTrustedForwardedHosts(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
}

function firstHeaderValue(value: string | null): string | null {
  return value?.split(",")[0]?.trim() || null;
}

function safeProtocol(value: string | null): "http" | "https" | null {
  const protocol = firstHeaderValue(value)?.toLowerCase();
  return protocol === "http" || protocol === "https" ? protocol : null;
}

function inferredProtocol(host: string | null): "http" | "https" {
  if (!host) return "https";
  const normalized = host.toLowerCase();
  const hostname = normalized.startsWith("[")
    ? normalized.slice(0, normalized.indexOf("]") + 1)
    : normalized.split(":")[0];
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
    ? "http"
    : "https";
}

function parseOrigin(host: string | null, protocol: "http" | "https"): URL | null {
  if (!host || /[\\/@?#\s]/.test(host)) return null;

  try {
    const origin = new URL(`${protocol}://${host}`);
    if (origin.protocol !== "http:" && origin.protocol !== "https:") return null;
    if (origin.username || origin.password || origin.pathname !== "/") return null;
    return origin;
  } catch {
    return null;
  }
}

function normalizedTrustedHosts(hosts: readonly string[]): Set<string> {
  const normalized = hosts
    .map((host) => parseOrigin(host.trim(), "https")?.host.toLowerCase())
    .filter((host): host is string => Boolean(host));
  return new Set(normalized);
}

function safeFallback(value: string | undefined): URL {
  try {
    const fallback = new URL(value ?? defaultFallback);
    if (
      (fallback.protocol === "http:" || fallback.protocol === "https:") &&
      !fallback.username &&
      !fallback.password
    ) {
      return new URL(fallback.origin);
    }
  } catch {
    // Fall through to the known-safe local origin.
  }
  return new URL(defaultFallback);
}
