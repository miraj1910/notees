export interface TokenResponse {
  access_token: string;
  error?: string;
}

export interface TokenClient {
  requestAccessToken(): void;
}
