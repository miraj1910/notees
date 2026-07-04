interface Window {
  onGoogleLibraryLoad: (() => void) | null;
  __appBootstrap?: Array<() => void>;
  __ENV?: {
    APP_NAME: string;
    APP_ENV: string;
    APP_VERSION: string;
  };
}

declare namespace google.accounts.oauth2 {
  function initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: { access_token: string; error?: string }) => void;
  }): { requestAccessToken(): void };
}
