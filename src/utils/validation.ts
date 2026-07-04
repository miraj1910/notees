import { TEMP_PREFIX } from "../config/constants";

export function isTemporaryNoteId(id: string | null): boolean {
  return typeof id === "string" && id.startsWith(TEMP_PREFIX);
}

export function validateAuthConfig(clientId: string): string | null {
  if (window.location.protocol === "file:") {
    return "Open the app through a local server like http://localhost:5500, not as a file:// page.";
  }

  if (!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
    return "Add your Google OAuth Web Client ID in config.js before signing in.";
  }

  return null;
}
