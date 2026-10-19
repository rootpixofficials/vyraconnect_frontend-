/**
 * Vyra Connect Application Configuration
 * Handles environment-aware URL resolution so scanners and QR codes
 * navigate to the current test domain when on test server/localhost.
 */

export const TEST_APP_URL = "https://phpstack-1650272-6724559.cloudwaysapps.com";
export const LIVE_APP_URL = "https://vyraconnect.in";

/**
 * Returns the active base URL of the application.
 * On browser: window.location.origin
 * On server: NEXT_PUBLIC_APP_URL || TEST_APP_URL
 */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return TEST_APP_URL;
}

/**
 * Rewrites any live production vyraconnect.in scan URL to the current environment URL
 * (e.g. https://vyraconnect.in/scan?token=xyz -> https://phpstack.../scan?token=xyz)
 */
export function rewriteToCurrentDomain(url?: string): string {
  const currentBase = getAppBaseUrl();
  if (!url) {
    return `${currentBase}/scan?token=demo`;
  }
  return url
    .replace("https://vyraconnect.in", currentBase)
    .replace("http://vyraconnect.in", currentBase);
}
