/**
 * Vyra Connect Application Configuration
 * Handles environment-aware URL resolution so scanners, QR codes, and redirects
 * point to the live production domain (https://vyraconnect.in).
 */

export const LIVE_APP_URL = "https://vyraconnect.in";
export const TEST_APP_URL = "https://phpstack-1650272-6724559.cloudwaysapps.com";

// Active verified vehicle token from database (no dummy concepts)
export const ACTIVE_TEST_TOKEN = "ccd818971c98d782321233c390acf88e1f4c8ddebdbddbb82535102f3e34db2d";

// Full active scan URL that mobile camera scanners navigate to
export const ACTIVE_SCAN_URL = `${LIVE_APP_URL}/scan?token=${ACTIVE_TEST_TOKEN}`;
export const ACTIVE_TEST_SCAN_URL = ACTIVE_SCAN_URL;

/**
 * Returns the active base URL of the application.
 * Default is the live production domain (https://vyraconnect.in).
 */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const origin = window.location.origin;
    if (!origin.includes("localhost") && !origin.includes("127.0.0.1")) {
      return origin;
    }
  }
  return LIVE_APP_URL;
}

/**
 * Rewrites any scan or test URL to the live production domain https://vyraconnect.in.
 */
export function rewriteToCurrentDomain(url?: string): string {
  const currentBase = LIVE_APP_URL;
  if (!url) {
    return ACTIVE_SCAN_URL;
  }
  return url
    .replace(/https?:\/\/phpstack-1650272-6724559\.cloudwaysapps\.com/g, currentBase)
    .replace(/https?:\/\/phpstack-1650272-6714822\.cloudwaysapps\.com/g, currentBase)
    .replace(/https?:\/\/www\.vyraconnect\.in/g, currentBase)
    .replace(/http:\/\/vyraconnect\.in/g, currentBase);
}
