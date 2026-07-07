"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Editor } from "@tiptap/react";
import type { Note } from "@/types/note";
import { appState } from "@/state/app-state";
import { DEFAULT_TITLE, DEBOUNCE_MS } from "@/config/constants";
import { notesService } from "@/services/notes.service";
import { authService } from "@/services/auth.service";
import { cacheService } from "@/services/cache.service";
import { confirmDelete } from "@/ui/dialogs";
import { isTemporaryNoteId } from "@/utils/validation";

interface ActiveNote {
  title: string;
  content: string;
}

interface NotesContextValue {
  notes: Note[];
  currentNoteId: string | null;
  activeNote: ActiveNote | null;
  isAuthenticated: boolean;
  saveStatus: string;
  isCreatingNote: boolean;
  noteLoading: boolean;
  authError: string;
  titleRef: React.RefObject<HTMLInputElement | null>;
  editorRef: React.MutableRefObject<Editor | null>;
  login: () => void;
  createNote: () => Promise<void>;
  openNote: (id: string) => void;
  deleteNote: (id: string) => Promise<void>;
  onTitleChange: () => void;
  onContentChange: () => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Ready");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const titleRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync appState -> React state
  const syncFromAppState = useCallback(() => {
    setNotes([...appState.notesCache]);
    setCurrentNoteId(appState.currentNoteId);
    setIsCreatingNote(appState.isCreatingNote);
  }, []);

  // Initialize app
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (
        typeof google === "undefined" ||
        !google.accounts?.oauth2
      ) {
        await new Promise<void>((resolve) => {
          const check = () => {
            if (
              typeof google !== "undefined" &&
              google.accounts?.oauth2
            ) {
              resolve();
            } else {
              requestAnimationFrame(check);
            }
          };
          check();
        });
      }

      if (!mounted) return;

      authService.init({
        onSuccess: () => {
          if (!mounted) return;
          setIsAuthenticated(true);
          setAuthError("");
          notesService.loadAll().then(() => syncFromAppState());
        },
        onError: (msg) => {
          if (!mounted) return;
          setAuthError(msg);
        },
      });

      notesService.setCallbacks({
        onStatus: (text) => {
          if (!mounted) return;
          setSaveStatus(text);
        },
        onNotesChanged: () => {
          if (!mounted) return;
          syncFromAppState();
        },
        onNoteOpened: ({ title, content }) => {
          if (!mounted) return;
          setActiveNote({ title, content });
          setNoteLoading(false);
          syncFromAppState();
        },
        onEditorReset: () => {
          if (!mounted) return;
          setActiveNote(null);
          setNoteLoading(false);
          syncFromAppState();
        },
        onEditorLoading: (loading) => {
          if (!mounted) return;
          setNoteLoading(loading);
        },
      });
    };

    init();

    return () => {
      mounted = false;
    };
  }, [syncFromAppState]);

  const login = useCallback(() => {
    if (authService.isInitialized) {
      authService.requestLogin();
    }
  }, []);

  const createNote = useCallback(async () => {
    if (appState.isCreatingNote) return;
    setSaveStatus("Creating...");
    await notesService.create();
    syncFromAppState();
  }, [syncFromAppState]);

  const performSave = useCallback(async () => {
    const id = appState.currentNoteId;
    if (!id || isTemporaryNoteId(id)) {
      setSaveStatus("Saved");
      return;
    }

    const title = titleRef.current?.value || DEFAULT_TITLE;
    const content = editorRef.current?.getHTML() || "";

    setSaveStatus("Saving...");

    try {
      await notesService.save({ title, content });
      syncFromAppState();
      setSaveStatus("Saved");
    } catch {
      setSaveStatus("Error Saving");
    }
  }, [syncFromAppState]);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current !== null) {
      clearTimeout(saveTimerRef.current);
    }

    const currentId = appState.currentNoteId;
    const draftTitle = titleRef.current?.value || DEFAULT_TITLE;
    const draftContent = editorRef.current?.getHTML() || "";

    cacheService.updateNote(currentId, {
      title: draftTitle,
      content: draftContent,
    });

    setSaveStatus("Unsaved Changes");

    saveTimerRef.current = setTimeout(() => {
      performSave();
    }, DEBOUNCE_MS);
  }, [performSave]);

  const openNote = useCallback(
    (id: string) => {
      if (id === appState.currentNoteId) return;

      if (saveTimerRef.current !== null) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      const currentId = appState.currentNoteId;
      if (currentId && saveStatus === "Unsaved Changes" && !isTemporaryNoteId(currentId)) {
        const title = titleRef.current?.value || DEFAULT_TITLE;
        const content = editorRef.current?.getHTML() || "";
        cacheService.updateNote(currentId, { title, content });
      }

      notesService.open(id);
    },
    [saveStatus],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!confirmDelete()) return;
      setSaveStatus("Deleting...");
      await notesService.remove(id);
      syncFromAppState();
    },
    [syncFromAppState],
  );

  const onTitleChange = useCallback(() => {
    scheduleSave();
  }, [scheduleSave]);

  const onContentChange = useCallback(() => {
    scheduleSave();
  }, [scheduleSave]);

  const value: NotesContextValue = {
    notes,
    currentNoteId,
    activeNote,
    isAuthenticated,
    saveStatus,
    isCreatingNote,
    noteLoading,
    authError,
    titleRef,
    editorRef,
    login,
    createNote,
    openNote,
    deleteNote,
    onTitleChange,
    onContentChange,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}
