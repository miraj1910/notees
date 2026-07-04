import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { isTemporaryNoteId, validateAuthConfig } from "../../src/utils/validation.js";

describe("isTemporaryNoteId", () => {
  it("returns true for temp- prefixed ids", () => {
    expect(isTemporaryNoteId("temp-12345")).toBe(true);
    expect(isTemporaryNoteId("temp-abc")).toBe(true);
  });

  it("returns false for normal Drive file ids", () => {
    expect(isTemporaryNoteId("1abc2def3ghi")).toBe(false);
    expect(isTemporaryNoteId("")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isTemporaryNoteId(null)).toBe(false);
  });
});

describe("validateAuthConfig", () => {
  beforeAll(() => {
    vi.stubGlobal("window", {
      location: { protocol: "http:" },
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("returns null for valid config", () => {
    const result = validateAuthConfig("real-client-id.apps.googleusercontent.com");
    expect(result).toBeNull();
  });

  it("returns error for placeholder client ID", () => {
    const result = validateAuthConfig("YOUR_GOOGLE_CLIENT_ID");
    expect(result).toBe(
      "Add your Google OAuth Web Client ID in config.js before signing in.",
    );
  });

  it("returns error for empty client ID", () => {
    const result = validateAuthConfig("");
    expect(result).toBe(
      "Add your Google OAuth Web Client ID in config.js before signing in.",
    );
  });

  it("returns error for file:// protocol", () => {
    vi.stubGlobal("window", {
      location: { protocol: "file:" },
    });

    const result = validateAuthConfig("real-client-id");
    expect(result).toBe(
      "Open the app through a local server like http://localhost:5500, not as a file:// page.",
    );
  });
});
