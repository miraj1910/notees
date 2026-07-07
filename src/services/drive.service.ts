import type { NoteData } from "../types/note";
import type { DriveFile, DriveListResponse, DriveOptions } from "../types/drive";
import { appState } from "../state/app-state";
import { DRIVE_API_BASE, DRIVE_UPLOAD_BASE, MIME_TYPE } from "../config/constants";

export const driveService = {
  async get<T>(url: string, options?: DriveOptions): Promise<T> {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${appState.token}` },
      signal: options?.signal,
    });
    return res.json() as Promise<T>;
  },

  async patch<T = void>(url: string, body: NoteData): Promise<T> {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<T>;
  },

  async updateMetadata<T = void>(id: string, body: { name: string }): Promise<T> {
    const res = await fetch(`${DRIVE_API_BASE}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<T>;
  },

  async delete(id: string): Promise<Response> {
    return fetch(`${DRIVE_API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${appState.token}` },
    });
  },

  async createFile(): Promise<DriveFile> {
    const res = await fetch(`${DRIVE_API_BASE}?fields=id`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Untitled",
        mimeType: MIME_TYPE,
      }),
    });
    return res.json() as Promise<DriveFile>;
  },

  async uploadContent(id: string, data: NoteData): Promise<void> {
    await this.patch(`${DRIVE_UPLOAD_BASE}/${id}?uploadType=media`, data);
  },

  async listNotes(): Promise<DriveFile[]> {
    const data = await this.get<DriveListResponse>(
      `${DRIVE_API_BASE}?q=mimeType='${MIME_TYPE}'&spaces=drive&fields=files(id,name,createdTime,modifiedTime)`,
    );
    return Array.isArray(data.files) ? data.files : [];
  },

  async getNoteContent(id: string, options?: DriveOptions): Promise<NoteData> {
    return this.get<NoteData>(`${DRIVE_API_BASE}/${id}?alt=media`, options);
  },

  async saveNoteContent(id: string, payload: NoteData): Promise<void> {
    await Promise.all([
      this.uploadContent(id, payload),
      this.updateMetadata(id, { name: payload.title }),
    ]);
  },
};
