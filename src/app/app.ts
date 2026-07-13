import type { NoteData } from "../types/note";
import { env } from "../config/env";
import { DEBOUNCE_MS } from "../config/constants";
import { appState } from "../state/app-state";
import { authService } from "../services/auth.service";
import { notesService } from "../services/notes.service";
import { cacheService } from "../services/cache.service";
import { sidebar } from "../ui/sidebar";
import { editor } from "../ui/editor";
import { statusBar } from "../ui/status-bar";
import { confirmDelete } from "../ui/dialogs";
import { validateAuthConfig } from "../utils/validation";

export class App {
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    const authError = validateAuthConfig(env.CLIENT_ID);
    if (authError) {
      this.showAuthError(authError);
      return;
    }

    this.setupServiceCallbacks();
    this.setupEventDelegation();
    this.setupEventHandlers();

    authService.init({
      onSuccess: () => this.onAuthSuccess(),
      onError: (message) => this.showAuthError(message),
    });
  }

  private setupServiceCallbacks(): void {
    notesService.setCallbacks({
      onStatus: (text) => statusBar.setStatus(text),
      onNotesChanged: () => sidebar.render(),
      onNoteOpened: ({ title, content }) => {
        editor.show();
        editor.populate(title, content);
        editor.updateWorkspaceTitle(title);
      },
      onEditorReset: () => editor.reset(),
      onEditorLoading: (loading) => editor.setLoading(loading),
    });
  }

  private setupEventDelegation(): void {
    const notesList = document.getElementById("notes-list") as HTMLUListElement;
    notesList.onclick = (event: MouseEvent) => this.handleNotesListClick(event);
  }

  private setupEventHandlers(): void {
    const titleInput = document.getElementById("note-title") as HTMLInputElement;
    const contentInput = document.getElementById("note-content") as HTMLTextAreaElement;

    titleInput.oninput = () => this.scheduleSave();
    contentInput.oninput = () => this.scheduleSave();
  }

  private onAuthSuccess(): void {
    document.getElementById("login-screen")!.style.display = "none";
    document.getElementById("app")!.classList.remove("hidden");

    editor.hide();
    notesService.loadAll();
  }

  private handleNotesListClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const deleteButton = target.closest(".note-delete-btn") as HTMLElement | null;

    if (deleteButton) {
      const noteItem = deleteButton.closest(".note-item") as HTMLElement | null;
      if (noteItem && noteItem.dataset.id) {
        this.deleteNote(noteItem.dataset.id);
      }
      return;
    }

    const noteItem = target.closest(".note-item") as HTMLElement | null;
    if (noteItem && noteItem.dataset.id) {
      notesService.open(noteItem.dataset.id);
    }
  }

  async createNote(): Promise<void> {
    const newNoteBtn = document.getElementById("new-note") as HTMLButtonElement;
    newNoteBtn.disabled = true;
    newNoteBtn.textContent = "Creating...";

    await notesService.create();

    newNoteBtn.disabled = false;
    newNoteBtn.textContent = "New Note";
  }

  private scheduleSave(): void {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
    }

    const draftTitle = editor.getTitle();
    const currentId = appState.currentNoteId;

    editor.updateWorkspaceTitle(draftTitle);
    cacheService.updateNote(currentId, {
      title: draftTitle,
      content: editor.getContent(),
    });
    sidebar.updateItemTitle(currentId, draftTitle);
    statusBar.setStatus("Saving...");

    this.saveTimer = setTimeout(() => this.queueSave(), DEBOUNCE_MS);
  }

  private queueSave(): void {
    const id = appState.currentNoteId;
    if (!id) return;

    if (appState.isSaving) {
      appState.hasPendingSave = true;
      return;
    }

    this.executeSave();
  }

  private async executeSave(): Promise<void> {
    const id = appState.currentNoteId;
    if (!id || appState.isSaving) return;

    const payload: NoteData = {
      title: editor.getTitle(),
      content: editor.getContent(),
    };

    await notesService.save(payload);
  }

  private async deleteNote(id: string): Promise<void> {
    if (!confirmDelete()) return;

    await notesService.remove(id);
  }

  private showAuthError(message: string): void {
    const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
    const authErrorEl = document.getElementById("auth-error") as HTMLElement;

    if (message) {
      authErrorEl.textContent = message;
      authErrorEl.classList.remove("hidden");
      loginBtn.disabled = true;
    }
  }
}
