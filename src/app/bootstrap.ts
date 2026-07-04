import { App } from "./app";
import { sidebar } from "../ui/sidebar";
import { editor } from "../ui/editor";
import { statusBar } from "../ui/status-bar";
import { authService } from "../services/auth.service";

let app: App | null = null;

function initUI(): void {
  sidebar.init({
    notesList: document.getElementById("notes-list") as HTMLUListElement,
    notesCount: document.getElementById("notes-count") as HTMLElement,
  });

  editor.init({
    titleInput: document.getElementById("note-title") as HTMLInputElement,
    contentInput: document.getElementById("note-content") as HTMLTextAreaElement,
    workspaceTitle: document.getElementById("workspace-title") as HTMLElement,
    emptyState: document.getElementById("empty-state") as HTMLElement,
    editorFields: document.getElementById("editor-fields") as HTMLElement,
  });

  statusBar.init({
    saveStatus: document.getElementById("save-status") as HTMLElement,
  });
}

function initApp(): void {
  initUI();
  app = new App();
  app.init();
}

const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
const newNoteBtn = document.getElementById("new-note") as HTMLButtonElement;

loginBtn.addEventListener("click", () => {
  if (authService.isInitialized) {
    authService.requestLogin();
  }
});

newNoteBtn.addEventListener("click", () => {
  app?.createNote();
});

const queue = window.__appBootstrap as Array<() => void>;
if (queue) {
  queue.push(initApp);
}
