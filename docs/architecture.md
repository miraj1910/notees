# Architecture

## Overview

Blackline Notes is a single-page application (SPA) with zero backend. It uses Google Identity Services (GIS) for authentication and Google Drive API v3 for storage. The entire application runs client-side in the browser.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
├─────────────────────────────────────────────────────┤
│                  src/main.ts                         │
│                     │                                │
│          ┌──────────┴──────────┐                     │
│          │                     │                     │
│    config/env.ts      app/bootstrap.ts               │
│          │                     │                     │
│          │              ┌──────┴──────┐              │
│          │              │             │              │
│          │        config/       services/            │
│          │        constants.ts    auth.service.ts    │
│          │                       drive.service.ts   │
│          │                       notes.service.ts   │
│          │                       cache.service.ts   │
│          │              │             │              │
│          │              │     ┌───────┴───────┐      │
│          │              │     │               │      │
│          │              │  state/        ui/         │
│          │              │  app-state.ts   sidebar.ts │
│          │              │  note-state.ts  editor.ts  │
│          │              │                 status-bar │
│          │              │                 dialogs.ts │
│          │              │     │               │      │
│          │              │     └───────┬───────┘      │
│          │              │             │              │
│          │              │     utils/                  │
│          │              │     debounce.ts             │
│          │              │     logger.ts               │
│          │              │     validation.ts           │
│          │              │     storage.ts              │
└──────────┴──────────────┴─────┴──────────────────────┘
```

## Layer Responsibilities

### 1. UI Layer (`src/ui/`)
- Renders DOM elements
- Handles DOM interactions
- Contains no business logic
- Receives data, updates DOM

### 2. State Layer (`src/state/`)
- Holds all application state
- Provides snapshot capability
- Single source of truth

### 3. Service Layer (`src/services/`)
- Contains business logic
- Communicates with external APIs
- Manages cache operations
- Handles OAuth flow

### 4. Utility Layer (`src/utils/`)
- Pure utility functions
- No side effects
- Reusable across layers

### 5. Config Layer (`src/config/`)
- Environment configuration
- Application constants
- Generated from `.env` at build time

## Data Flow

```
User Action (click, type)
    │
    ▼
UI Module (src/ui/)
    │
    ▼
App Orchestrator (src/app/app.ts)
    │
    ▼
Service Layer (src/services/)
    │
    ▼
State Update (src/state/)
    │
    ▼
UI Re-render (via callbacks)
```

## Init Flow

1. `index.html` loads: sets up `__appBootstrap` queue
2. Google Identity Services script loads: calls `onGoogleLibraryLoad()` → runs bootstrap queue
3. TypeScript modules load: `main.ts` → `bootstrap.ts` → register init function in queue
4. Bootstrap function runs: initializes UI modules, creates App instance
5. App instance initializes: validates config, sets up service callbacks, initializes auth
6. User clicks login: auth service requests OAuth token
7. On auth success: hides login screen, loads notes list from Drive

## State Management

State is managed via a singleton `AppState` class (`src/state/app-state.ts`). All state mutations go through this object, providing a single source of truth. Individual services and UI modules read from and write to this shared state.

Key state properties:
- `token`: OAuth access token
- `currentNoteId`: Currently open note ID
- `notesCache`: In-memory cache of all notes
- `isSaving` / `hasPendingSave`: Save operation serialization
- `activeOpenController`: AbortController for canceling stale requests
