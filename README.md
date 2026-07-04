# Blackline Notes

A dark, focused, client-side note-taking application that syncs your notes directly to **Google Drive** — no backend server required.

> **Live demo**: [github.com/miraj1910/notes-app](https://github.com/miraj1910/notes-app)

---

## Features

- **Google OAuth 2.0 sign-in** — Authenticate with your Google account using Google Identity Services.
- **Create notes** — Instantly create new notes with a temporary ID for immediate UI feedback before the Drive API responds.
- **Edit notes** — Inline title and content editing with a seamless writing experience.
- **Auto-save** — Debounced auto-save (800ms) after you stop typing. Saves content and metadata simultaneously.
- **List notes** — Sidebar lists all your JSON notes from Google Drive with real-time count.
- **Open notes** — Click any note in the sidebar to load it. Race-condition-safe with `AbortController` to handle rapid switching.
- **Delete notes** — Optimistic UI removal with full rollback on failure. Confirmation dialog before delete.
- **Real-time status indicator** — See "Saving...", "Saved", "Save failed", "Loading note...", "Creating...", "Deleting...", and more.
- **In-memory caching** — Loaded note content is cached so switching back is instant.
- **Responsive design** — Fully responsive with breakpoints at 420px, 640px, 980px, 1280px, and 1500px.
- **Dark theme** — Deep dark backgrounds (`#090909`) with warm gold accent (`#d8a25e`), glassmorphism panels, and ambient glow.
- **No server required** — Runs entirely in the browser. All data stored in your Google Drive.

---

## Tech Stack

| Category           | Technology                                                     |
| ------------------ | -------------------------------------------------------------- |
| Language           | JavaScript (ES6+, vanilla, no frameworks)                      |
| HTML               | HTML5                                                          |
| CSS                | CSS3 with custom properties, `backdrop-filter`, responsive grid |
| Fonts              | Manrope (sans-serif), IBM Plex Mono (monospace) — Google Fonts |
| Authentication     | Google Identity Services (GIS) — `accounts.google.com/gsi/client` |
| Storage / Backend  | Google Drive API v3                                            |
| API Protocol       | REST over HTTPS to `www.googleapis.com/drive/v3/files`         |
| Hosting            | Any static file server (Netlify, GitHub Pages, VS Code Live Server) |

---

## Architecture

Blackline Notes is a **single-page application (SPA)** with zero server-side code. The architecture follows a simple event-driven pattern:

```
User Action → DOM Event → JS Handler → Google Drive API → UI Update
```

### Key modules in `app.js`:

| Module               | Lines   | Description                                      |
| -------------------- | ------- | ------------------------------------------------ |
| State                | 1–16    | Global variables: token, cache, flags            |
| DOM refs             | 18–35   | Cached element references                        |
| Google Library Load  | 38–57   | Initializes OAuth client on GIS script load      |
| Auth                 | 59–73   | Handles token response, shows/hides login        |
| Drive Helpers        | 75–104  | `driveGET()`, `drivePATCH()`, `driveUpdateMetadata()` |
| Load Notes           | 106–130 | Fetches file list from Drive                     |
| Load Single Note     | 132–140 | Fetches note content by ID                       |
| Sidebar              | 142–168 | Renders note list and individual items           |
| Open Note            | 170–232 | Opens a note with caching and race-condition handling |
| Create Note          | 234–310 | Creates Drive file with optimistic UI            |
| Auto-save            | 312–377 | Debounced save with serialization and retry      |
| Delete Note          | 379–430 | Optimistic delete with rollback                  |
| UI Helpers           | 432–474 | Status, loading state, cache updates             |
| Event Delegation     | 476–490 | Click handling on the notes list                 |
| Config Validation    | 492–514 | Protocol and Client ID checks                    |

---

## API

The app communicates directly with the **Google Drive API v3**. There are no custom backend endpoints.

### List Notes

```
GET https://www.googleapis.com/drive/v3/files
  ?q=mimeType='application/json'
  &spaces=drive
  &fields=files(id,name)
Authorization: Bearer {token}
```

### Read Note Content

```
GET https://www.googleapis.com/drive/v3/files/{fileId}?alt=media
Authorization: Bearer {token}
```

### Create Note

```
POST https://www.googleapis.com/drive/v3/files?fields=id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Untitled",
  "mimeType": "application/json"
}
```

### Save Note Content

```
PATCH https://www.googleapis.com/upload/drive/v3/files/{fileId}?uploadType=media
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note body text..."
}
```

### Update Note Title (Metadata)

```
PATCH https://www.googleapis.com/drive/v3/files/{fileId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Note"
}
```

### Delete Note

```
DELETE https://www.googleapis.com/drive/v3/files/{fileId}
Authorization: Bearer {token}
```

---

## Data Model

Each note is stored as a separate **JSON file** in your Google Drive.

### File structure on Drive:

```json
{
  "title": "My Note Title",
  "content": "The body text of the note..."
}
```

### In-memory cache structure:

```javascript
notesCache = [
  {
    id: string,       // Google Drive file ID
    title: string,    // Display name (synced with Drive file name)
    content: string | null  // Null until loaded
  }
]
```

---

## Security

- **Client-side only** — The OAuth access token never touches a server; it stays in the browser's memory in a JavaScript variable.
- **Minimal Google scope** — Uses `drive.file` scope. The app can only access files it creates or that the user explicitly selects. It cannot see other Drive files.
- **No token persistence** — The token is never stored in `localStorage` or cookies. Page refresh requires re-authentication.
- **No backend** — No passwords, no user database, no server-side secrets. All security is delegated to Google OAuth.
- **Protocol check** — The app refuses to run under `file://` protocol (requires a web server).
- **Configuration validation** — Checks that the Client ID is set and not a placeholder before enabling sign-in.

### Important security notes:

- The access token is stored in a global mutable variable (`let token`) and is accessible to any browser extension or XSS script running on the page.
- Token expiry is handled by Google's GIS library, which may prompt the user to re-authenticate.
- All Drive API calls are made over HTTPS.

---

## Setup & Running

### Prerequisites

- A web server (VS Code Live Server, Python `http.server`, nginx, etc.)
- A **Google Cloud project** with the Drive API enabled and OAuth 2.0 Web Client credentials

### 1. Clone the repository

```bash
git clone https://github.com/miraj1910/notes-app.git
cd notes-app
```

### 2. Configure Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project or select an existing one.
3. Enable the **Google Drive API**.
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**.
5. Choose **Web application** as the application type.
6. Add your domain to **Authorized JavaScript origins** (e.g., `http://localhost:5500`).
7. Copy the generated **Client ID**.

### 3. Set the Client ID

Open `config.js` and replace the value:

```javascript
window.APP_CONFIG = {
  CLIENT_ID: "YOUR_CLIENT_ID.apps.googleusercontent.com"
};
```

### 4. Serve the files

Using Python:

```bash
python3 -m http.server 8000
```

Using VS Code: Right-click `index.html` → **Open with Live Server**.

### 5. Open in browser

Navigate to `http://localhost:8000` (or your server's port).

---

## Deployment

Since the app is a static site, deploy to any static hosting:

- **GitHub Pages** — Push to `gh-pages` branch or configure from the repo settings.
- **Netlify** — Drag-and-drop the project folder or connect the Git repository.
- **Vercel** — Connect the Git repository; no build command needed.
- **Firebase Hosting** — Use `firebase deploy`.
- **Any web server** — Copy the 4 files (`index.html`, `app.js`, `config.js`, `style.css`) to your server's web root.

**Important**: The deployed domain must be added to **Authorized JavaScript origins** in the Google Cloud Console.

### Files to deploy

```
index.html
app.js
config.js
style.css
```

No build step, no package managers, no dependencies to install.

---

## Configuration

All configuration is in `config.js`:

```javascript
window.APP_CONFIG = {
  CLIENT_ID: "874527368898-hif9voa0tommi94lmvvvjpaokmq5jciu.apps.googleusercontent.com"
};
```

The OAuth scope is hardcoded in `app.js:2`:

```javascript
const SCOPES = "https://www.googleapis.com/auth/drive.file";
```

---

## Dependencies

### External (loaded via CDN)

| Resource                     | URL                                                        |
| ---------------------------- | ---------------------------------------------------------- |
| Google Identity Services     | `https://accounts.google.com/gsi/client`                   |
| Google Fonts — Manrope       | `https://fonts.googleapis.com/css2?family=Manrope:...`     |
| Google Fonts — IBM Plex Mono | `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:...` |

### Zero internal dependencies

No npm packages, no bundlers, no frameworks, no CSS libraries, no build tools.

---

## Project Structure

```
notes-app/
├── index.html        # HTML entry point / UI shell (83 lines)
├── app.js            # Main application logic (514 lines)
├── config.js         # Google OAuth client ID (3 lines)
└── style.css         # All styles, responsive breakpoints (663 lines)
```

---

## State Management

All state is held in global JavaScript variables:

| Variable                | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `token`                 | OAuth 2.0 access token                               |
| `tokenClient`           | Google OAuth client instance                         |
| `currentNoteId`         | Currently open note's Drive file ID                  |
| `notesCache`            | Array of `{ id, title, content }` for all notes      |
| `isCreatingNote`        | Prevents duplicate note creation                     |
| `isSaving`              | Serializes save operations                           |
| `hasPendingSave`        | Queues a retry if a save arrives during an active one |
| `saveTimer`             | `setTimeout` ID for 800ms debounce                   |
| `activeOpenRequestId`   | Counter for tracking the latest open request         |
| `activeOpenController`  | `AbortController` to cancel stale requests           |

---

## Error Handling

| Scenario                     | Behavior                                                       |
| ---------------------------- | -------------------------------------------------------------- |
| Auth failure                 | Shows error in the login card                                  |
| Load notes failure           | Sets status to "Failed to load notes"                          |
| Open note failure            | Sets status to "Failed to open note"; ignores `AbortError`     |
| Create note failure          | Removes temporary note from cache, reverts UI                  |
| Save failure                 | Sets status to "Save failed"; queues retry when possible       |
| Delete failure               | Rolls back `notesCache` and re-renders the list                |
| `file://` protocol           | Blocks startup with a descriptive error                        |
| Missing / placeholder Client ID | Blocks sign-in with a setup guide error                    |
| Rapid note switching         | Cancels stale requests via `AbortController`                   |

---

## Browser Support

The app targets modern browsers that support:

- `async` / `await`
- `fetch` API
- `AbortController`
- `backdrop-filter`
- CSS Grid
- CSS Custom Properties
- `env(safe-area-inset-*)`

---

## License

[MIT](LICENSE)

---

## Author

**Miraj** — [github.com/miraj1910](https://github.com/miraj1910)
