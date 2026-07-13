import { describe, it, expect, vi } from "vitest";
import { debounce } from "../../src/utils/debounce.js";
describe("debounce", () => {
    it("calls the function after the delay", async () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 50);
        debounced();
        expect(fn).not.toHaveBeenCalled();
        await new Promise((r) => setTimeout(r, 60));
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it("cancels previous invocations when called again", async () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 50);
        debounced();
        debounced();
        debounced();
        await new Promise((r) => setTimeout(r, 60));
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it("passes arguments to the wrapped function", async () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 50);
        debounced("a", 1);
        await new Promise((r) => setTimeout(r, 60));
        expect(fn).toHaveBeenCalledWith("a", 1);
    });
    it("supports manual cancellation", async () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 50);
        debounced();
        debounced.cancel();
        await new Promise((r) => setTimeout(r, 60));
        expect(fn).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=debounce.test.js.map