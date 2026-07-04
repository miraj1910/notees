import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Blackline Notes",
  description: "A darker, focused writing space that keeps your notes synced to Google Drive.",
};

const appName = process.env.APP_NAME || "Blackline Notes";
const appEnv = process.env.APP_ENV || "development";
const appVersion = process.env.APP_VERSION || "1.0.0";

const bootstrapSetup = `
window.__ENV = {
  APP_NAME: ${JSON.stringify(appName)},
  APP_ENV: ${JSON.stringify(appEnv)},
  APP_VERSION: ${JSON.stringify(appVersion)}
};
window.__appBootstrap = window.__appBootstrap || [];
window.__appBootstrap.push = function(fn) {
  [].push.call(this, fn);
  if (this._ready) fn();
};
window.onGoogleLibraryLoad = function() {
  window.__appBootstrap._ready = true;
  window.__appBootstrap.forEach(function(fn) { fn(); });
};
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: bootstrapSetup }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
