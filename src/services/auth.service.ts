import type { TokenResponse, TokenClient } from "../types/auth";
import { env } from "../config/env";
import { appState } from "../state/app-state";
import { AUTH_ERROR_SIGNIN_FAILED } from "../config/constants";
import { logger } from "../utils/logger";

type AuthCallbacks = {
  onSuccess: () => void;
  onError: (message: string) => void;
};

class AuthService {
  private tokenClient: TokenClient | null = null;
  private callbacks: AuthCallbacks | null = null;

  get isInitialized(): boolean {
    return this.tokenClient !== null;
  }

  init(callbacks: AuthCallbacks): void {
    this.callbacks = callbacks;

    if (typeof google === "undefined" || !google.accounts?.oauth2) {
      logger.error("Google Identity Services library not loaded");
      return;
    }

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: env.CLIENT_ID,
      scope: env.SCOPES,
      callback: (resp: TokenResponse) => this.onAuthSuccess(resp),
    });
  }

  requestLogin(): void {
    if (!this.tokenClient) {
      logger.error("Auth not initialized");
      return;
    }
    this.tokenClient.requestAccessToken();
  }

  private onAuthSuccess(resp: TokenResponse): void {
    if (!resp || !resp.access_token) {
      this.callbacks?.onError(AUTH_ERROR_SIGNIN_FAILED);
      return;
    }

    appState.token = resp.access_token;
    this.callbacks?.onSuccess();
  }
}

export const authService = new AuthService();
