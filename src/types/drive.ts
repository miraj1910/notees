export interface DriveFile {
  id: string;
  name?: string;
  createdTime?: string;
  modifiedTime?: string;
}

export interface DriveListResponse {
  files: DriveFile[];
}

export interface DriveOptions {
  signal?: AbortSignal;
}
