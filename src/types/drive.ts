export interface DriveFile {
  id: string;
  name?: string;
}

export interface DriveListResponse {
  files: DriveFile[];
}

export interface DriveOptions {
  signal?: AbortSignal;
}
