import { describe, it, expect, beforeEach } from "vitest";
import { appState } from "../../src/state/app-state.js";
import { cacheService } from "../../src/services/cache.service.js";

describe("cacheService", () => {
  beforeEach(() => {
    appState.notesCache = [];
  });

  it("starts with empty cache", () => {
    expect(cacheService.getNotes()).toEqual([]);
  });

  it("stores and retrieves notes", () => {
    cacheService.setNotes([
      { id: "1", title: "Note 1", content: null },
      { id: "2", title: "Note 2", content: "hello" },
    ]);

    expect(cacheService.getNotes()).toHaveLength(2);
    expect(cacheService.findNote("1")?.title).toBe("Note 1");
  });

  it("finds a note by id", () => {
    cacheService.setNotes([{ id: "abc", title: "Test", content: "content" }]);

    const found = cacheService.findNote("abc");
    expect(found).toBeDefined();
    expect(found?.title).toBe("Test");
  });

  it("returns undefined for missing note", () => {
    cacheService.setNotes([{ id: "abc", title: "Test", content: null }]);

    expect(cacheService.findNote("nonexistent")).toBeUndefined();
  });

  it("updates a note by id", () => {
    cacheService.setNotes([{ id: "1", title: "Old", content: null }]);

    cacheService.updateNote("1", { title: "Updated", content: "new content" });
    const note = cacheService.findNote("1");
    expect(note?.title).toBe("Updated");
    expect(note?.content).toBe("new content");
  });

  it("ignores update when id is null", () => {
    cacheService.setNotes([{ id: "1", title: "Test", content: null }]);
    cacheService.updateNote(null, { title: "Nope" });
    expect(cacheService.findNote("1")?.title).toBe("Test");
  });

  it("adds optimistic note to front", () => {
    cacheService.setNotes([{ id: "existing", title: "Existing", content: null }]);
    cacheService.addOptimistic({
      id: "temp-1",
      title: "New",
      content: "",
    });

    expect(cacheService.getNotes()).toHaveLength(2);
    expect(cacheService.getNotes()[0].id).toBe("temp-1");
  });

  it("replaces temp id with real id", () => {
    cacheService.setNotes([{ id: "temp-1", title: "New", content: "" }]);
    cacheService.replaceId("temp-1", "real-id-123");

    const note = cacheService.findNote("real-id-123");
    expect(note).toBeDefined();
    expect(cacheService.findNote("temp-1")).toBeUndefined();
  });

  it("removes a note", () => {
    cacheService.setNotes([
      { id: "1", title: "A", content: null },
      { id: "2", title: "B", content: null },
    ]);
    cacheService.removeNote("1");

    expect(cacheService.getNotes()).toHaveLength(1);
    expect(cacheService.getNotes()[0].id).toBe("2");
  });

  it("creates a snapshot that is independent of the cache", () => {
    cacheService.setNotes([{ id: "1", title: "Original", content: null }]);
    const snap = cacheService.snapshotNotes();
    cacheService.setNotes([]);

    expect(snap).toHaveLength(1);
    expect(snap[0].id).toBe("1");
  });
});
