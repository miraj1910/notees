import { appState } from "../state/app-state";
import { cacheService } from "../services/cache.service";

export interface SidebarElements {
  notesList: HTMLUListElement;
  notesCount: HTMLElement;
}

export const sidebar = {
  elements: null as SidebarElements | null,

  init(elements: SidebarElements): void {
    this.elements = elements;
  },

  render(): void {
    const el = this.elements;
    if (!el) return;

    el.notesList.innerHTML = "";
    const notes = cacheService.getNotes();
    notes.forEach((note) => this.addItem(note.id, note.title));
    this.updateCount(notes.length);
    this.highlightActive();
  },

  addItem(id: string, title: string): void {
    const el = this.elements;
    if (!el) return;

    const li = document.createElement("li");
    li.className = "note-item";
    li.dataset.id = id;

    const t = document.createElement("div");
    t.className = "note-title";
    t.textContent = title || "Untitled";

    const del = document.createElement("button");
    del.type = "button";
    del.className = "note-delete-btn";
    del.textContent = "🗑";

    li.appendChild(t);
    li.appendChild(del);
    el.notesList.appendChild(li);
  },

  updateItemTitle(id: string | null, title: string): void {
    if (!id) return;
    const titleEl = document.querySelector(
      `.note-item[data-id="${id}"] .note-title`,
    ) as HTMLElement | null;
    if (titleEl) titleEl.textContent = title;
  },

  updateCount(count: number): void {
    const el = this.elements;
    if (!el) return;
    el.notesCount.textContent = `${count} note${count === 1 ? "" : "s"}`;
  },

  highlightActive(): void {
    const items = document.querySelectorAll<HTMLElement>(".note-item");
    items.forEach((item) => {
      item.classList.toggle("active", item.dataset.id === appState.currentNoteId);
    });
  },
};
