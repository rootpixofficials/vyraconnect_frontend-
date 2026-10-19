/**
 * Vyra Connect Application Configuration
 * Handles environment-aware URL resolution so scanners and QR codes
 * always navigate to the public test domain (never localhost or production live domain during testing).
 */

export const TEST_APP_URL = "https://phpstack-1650272-6724559.cloudwaysapps.com";
export const LIVE_APP_URL = "https://vyraconnect.in";

// Active verified vehicle token from database (no dummy concepts)
export const ACTIVE_TEST_TOKEN = "ccd818971c98d782321233c390acf88e1f4c8ddebdbddbb82535102f3e34db2d";

// Full active test scan URL that mobile camera scanners navigate to
export const ACTIVE_TEST_SCAN_URL = `${TEST_APP_URL}/scan?token=${ACTIVE_TEST_TOKEN}`;

/**
 * Returns the active public test base URL of the application.
 * Never returns localhost so mobile camera scans always open on external devices.
 */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const origin = window.location.origin;
    // Disallow localhost and production live domain during test mode
    if (!origin.includes("localhost") && !origin.includes("127.0.0.1") && !origin.includes("vyraconnect.in")) {
      return origin;
    }
  }
  return TEST_APP_URL;
}

/**
 * Rewrites any live production vyraconnect.in scan URL to the test environment URL
 * (e.g. https://vyraconnect.in/scan?token=xyz -> https://phpstack.../scan?token=xyz)
 */
export function rewriteToCurrentDomain(url?: string): string {
  const currentBase = TEST_APP_URL;
  if (!url) {
    return ACTIVE_TEST_SCAN_URL;
  }
  return url
    .replace("https://www.vyraconnect.in", currentBase)
    .replace("http://www.vyraconnect.in", currentBase)
    .replace("https://vyraconnect.in", currentBase)
    .replace("http://vyraconnect.in", currentBase);
}
