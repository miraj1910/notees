import type { Note } from "../types/note";
import type { DriveFile, DriveListResponse } from "../types/drive";
import { appState } from "../state/app-state";
import { DRIVE_API_BASE, DRIVE_UPLOAD_BASE, MIME_TYPE, NOTES_FILE_NAME } from "../config/constants";
import { logger } from "../utils/logger";

async function assertOk(res: Response): Promise<Response> {
  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`Drive API ${res.status}: ${body}`);
  }
  return res;
}

export const driveService = {
  async findOrCreateNotesFile(): Promise<DriveFile> {
    const searchUrl =
      `${DRIVE_API_BASE}?q=name='${NOTES_FILE_NAME}'` +
      `&spaces=appDataFolder` +
      `&fields=files(id,name,createdTime,modifiedTime)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${appState.token}` },
    });
    const data: DriveListResponse = await assertOk(searchRes).then((r) => r.json());

    if (Array.isArray(data.files) && data.files.length > 0) {
      const sorted = data.files.sort(
        (a, b) =>
          new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime(),
      );
      return sorted[0];
    }

    const createRes = await fetch(`${DRIVE_API_BASE}?fields=id`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: NOTES_FILE_NAME,
        mimeType: MIME_TYPE,
        parents: ["appDataFolder"],
      }),
    });
    const file: DriveFile = await assertOk(createRes).then((r) => r.json());

    const initRes = await fetch(`${DRIVE_UPLOAD_BASE}/${file.id}?uploadType=media`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": MIME_TYPE,
      },
      body: JSON.stringify([]),
    });
    await assertOk(initRes);

    return file;
  },

  async downloadAllNotes(fileId: string): Promise<Note[]> {
    const res = await fetch(`${DRIVE_API_BASE}/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${appState.token}` },
    });
    const text = await assertOk(res).then((r) => r.text());

    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        logger.warn("notes.json content is not an array, resetting");
        return [];
      }
      return data as Note[];
    } catch {
      logger.warn("Failed to parse notes.json, starting fresh");
      return [];
    }
  },

  async uploadAllNotes(fileId: string, notes: Note[]): Promise<void> {
    const res = await fetch(`${DRIVE_UPLOAD_BASE}/${fileId}?uploadType=media`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": MIME_TYPE,
      },
      body: JSON.stringify(notes),
    });
    await assertOk(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${DRIVE_API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${appState.token}` },
    });
    await assertOk(res);
  },
};
