import { DEFAULT_TITLE, DEFAULT_TITLE_NOTE } from "../config/constants";

export interface EditorElements {
  titleInput: HTMLInputElement;
  contentInput: HTMLTextAreaElement;
  workspaceTitle: HTMLElement;
  emptyState: HTMLElement;
  editorFields: HTMLElement;
}

export const editor = {
  elements: null as EditorElements | null,

  init(elements: EditorElements): void {
    this.elements = elements;
  },

  show(): void {
    const el = this.elements;
    if (!el) return;
    el.emptyState.classList.add("hidden");
    el.editorFields.classList.remove("hidden");
  },

  hide(): void {
    const el = this.elements;
    if (!el) return;
    el.emptyState.classList.remove("hidden");
    el.editorFields.classList.add("hidden");
  },

  setLoading(loading: boolean): void {
    const el = this.elements;
    if (!el) return;
    el.titleInput.readOnly = loading;
    el.contentInput.readOnly = loading;
  },

  populate(title: string, content: string): void {
    const el = this.elements;
    if (!el) return;
    el.titleInput.value = title;
    el.contentInput.value = content;
  },

  updateWorkspaceTitle(title: string): void {
    const el = this.elements;
    if (!el) return;
    el.workspaceTitle.textContent = title || DEFAULT_TITLE_NOTE;
  },

  getTitle(): string {
    return this.elements?.titleInput?.value || DEFAULT_TITLE;
  },

  getContent(): string {
    return this.elements?.contentInput?.value || "";
  },

  reset(): void {
    const el = this.elements;
    if (!el) return;
    el.titleInput.value = "";
    el.contentInput.value = "";
    this.setLoading(false);
    el.workspaceTitle.textContent = DEFAULT_TITLE_NOTE;
    this.hide();
  },
};
