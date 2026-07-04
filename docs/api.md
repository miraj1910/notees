# API Documentation

The app communicates directly with the **Google Drive API v3**. There are no custom backend endpoints.

## Authentication

All requests require an OAuth 2.0 access token in the `Authorization: Bearer {token}` header. The token is obtained via Google Identity Services (GIS) OAuth 2.0 implicit grant flow.

## Endpoints

### List Notes

```
GET https://www.googleapis.com/drive/v3/files
  ?q=mimeType='application/json'
  &spaces=drive
  &fields=files(id,name)
```

Response:
```json
{
  "files": [
    { "id": "abc123", "name": "My Note" }
  ]
}
```

### Read Note Content

```
GET https://www.googleapis.com/drive/v3/files/{fileId}?alt=media
```

Response:
```json
{
  "title": "My Note",
  "content": "Note body text..."
}
```

### Create Note

```
POST https://www.googleapis.com/drive/v3/files?fields=id
Content-Type: application/json

{
  "name": "Untitled",
  "mimeType": "application/json"
}
```

Response:
```json
{
  "id": "new-file-id"
}
```

### Save Note Content

```
PATCH https://www.googleapis.com/upload/drive/v3/files/{fileId}?uploadType=media
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note body text..."
}
```

### Update Note Title (Metadata)

```
PATCH https://www.googleapis.com/drive/v3/files/{fileId}
Content-Type: application/json

{
  "name": "My Note"
}
```

### Delete Note

```
DELETE https://www.googleapis.com/drive/v3/files/{fileId}
```

## Data Model

Each note is stored as a separate JSON file in Google Drive.

### File Structure on Drive:
```json
{
  "title": "My Note Title",
  "content": "The body text of the note..."
}
```

### In-Memory Cache Structure:
```typescript
interface Note {
  id: string;        // Google Drive file ID
  title: string;     // Display name (synced with Drive file name)
  content: string | null;  // Null until loaded from Drive
}
```

## Scope

The app uses the `https://www.googleapis.com/auth/drive.file` scope, which restricts access to only files created by the app or explicitly selected by the user.
