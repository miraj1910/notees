import { describe, it, expect, beforeEach } from "vitest";
import { appState } from "../../src/state/app-state.js";
import { cacheService } from "../../src/services/cache.service.js";
const ts = "2025-01-01T00:00:00.000Z";
function note(overrides = {}) {
    return {
        id: "1",
        title: "Note",
        content: null,
        createdAt: ts,
        updatedAt: ts,
        ...overrides,
    };
}
describe("cacheService", () => {
    beforeEach(() => {
        appState.notesCache = [];
    });
    it("starts with empty cache", () => {
        expect(cacheService.getNotes()).toEqual([]);
    });
    it("stores and retrieves notes", () => {
        cacheService.setNotes([
            note({ id: "1", title: "Note 1", content: null }),
            note({ id: "2", title: "Note 2", content: "hello" }),
        ]);
        expect(cacheService.getNotes()).toHaveLength(2);
        expect(cacheService.findNote("1")?.title).toBe("Note 1");
    });
    it("finds a note by id", () => {
        cacheService.setNotes([note({ id: "abc", title: "Test", content: "content" })]);
        const found = cacheService.findNote("abc");
        expect(found).toBeDefined();
        expect(found?.title).toBe("Test");
    });
    it("returns undefined for missing note", () => {
        cacheService.setNotes([note({ id: "abc", title: "Test" })]);
        expect(cacheService.findNote("nonexistent")).toBeUndefined();
    });
    it("updates a note by id", () => {
        cacheService.setNotes([note({ id: "1", title: "Old" })]);
        cacheService.updateNote("1", { title: "Updated", content: "new content" });
        const found = cacheService.findNote("1");
        expect(found?.title).toBe("Updated");
        expect(found?.content).toBe("new content");
    });
    it("ignores update when id is null", () => {
        cacheService.setNotes([note({ id: "1", title: "Test" })]);
        cacheService.updateNote(null, { title: "Nope" });
        expect(cacheService.findNote("1")?.title).toBe("Test");
    });
    it("adds optimistic note to front", () => {
        cacheService.setNotes([note({ id: "existing", title: "Existing" })]);
        cacheService.addOptimistic({
            id: "temp-1",
            title: "New",
            content: "",
            createdAt: ts,
            updatedAt: ts,
        });
        expect(cacheService.getNotes()).toHaveLength(2);
        expect(cacheService.getNotes()[0].id).toBe("temp-1");
    });
    it("replaces temp id with real id", () => {
        cacheService.setNotes([note({ id: "temp-1", title: "New", content: "" })]);
        cacheService.replaceId("temp-1", "real-id-123");
        const found = cacheService.findNote("real-id-123");
        expect(found).toBeDefined();
        expect(cacheService.findNote("temp-1")).toBeUndefined();
    });
    it("removes a note", () => {
        cacheService.setNotes([
            note({ id: "1", title: "A" }),
            note({ id: "2", title: "B" }),
        ]);
        cacheService.removeNote("1");
        expect(cacheService.getNotes()).toHaveLength(1);
        expect(cacheService.getNotes()[0].id).toBe("2");
    });
    it("creates a snapshot that is independent of the cache", () => {
        cacheService.setNotes([note({ id: "1", title: "Original" })]);
        const snap = cacheService.snapshotNotes();
        cacheService.setNotes([]);
        expect(snap).toHaveLength(1);
        expect(snap[0].id).toBe("1");
    });
});
//# sourceMappingURL=cache-behavior.test.js.map