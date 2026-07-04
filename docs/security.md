# Security

## Threat Model

### Assets
- Google OAuth 2.0 access token
- Note data stored in Google Drive
- User's Google account identity

### Trust Boundaries
1. **Browser ↔ Google API**: HTTPS-encrypted communication
2. **In-memory state**: Token stored in JavaScript variable
3. **No server**: All processing happens client-side

### Attack Vectors

| Vector | Risk | Mitigation |
|--------|------|------------|
| XSS | High | No user-generated HTML rendering; content is plain text in textarea |
| Token theft via browser extension | Medium | Token stored in JS variable; same risk as any SPA |
| CSRF | Low | OAuth tokens are not cookies; no state-changing requests from other origins |
| Token interception | Low | All API calls over HTTPS |
| Token expiry | Low | Google GIS handles re-authentication |
| Malicious extension access | Medium | Same risk as any web app; token accessible to any JS running on page |

## Security Boundaries

### Authentication Boundary
```
User Browser ──HTTPS──► Google OAuth 2.0
     │
     ▼
Access Token (memory only)
     │
     ▼
Google Drive API (HTTPS)
```

### Data Flow Security
1. **No storage of secrets**: Token is never written to localStorage, cookies, or IndexedDB
2. **No backend**: No server-side storage of tokens or user data
3. **Minimal scope**: `drive.file` scope limits access to app-created files only
4. **Protocol check**: App refuses to run under `file://` protocol
5. **Config validation**: Client ID validated before enabling sign-in

## OAuth Flow

1. User clicks "Continue with Google"
2. GIS library opens Google's OAuth consent screen
3. User authenticates and grants consent
4. Google returns an access token via redirect URI callback
5. Token stored in memory (`appState.token`)
6. All subsequent Drive API calls use this token

## Data Protection

- All Drive API calls use HTTPS (TLS 1.2+)
- Note content is stored as JSON files in Google Drive
- Google Drive provides encryption at rest
- No app-level encryption (relies on Google Drive's encryption)

## Known Risks

1. **Token in memory**: The access token is stored in a global JavaScript variable and is accessible to any browser extension or script running on the page.
2. **No refresh token**: The implicit grant flow does not provide a refresh token. Users must re-authenticate after token expiry.
3. **No CSP headers**: The app relies on the hosting platform to set appropriate Content Security Policy headers.
