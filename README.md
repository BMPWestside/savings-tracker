# Savings Tracker (standalone app)

Files go in the ROOT of your GitHub repo (no folders): index.html, config.js, manifest.webmanifest, sw.js, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png, favicon.png

## 1. Google Sheet (as bmpwestside@gmail.com)
- Create a Google Sheet. Rename the first tab to `Entries`.
- Share it with your wife as **Viewer**.
- Copy the Sheet ID from the URL (docs.google.com/spreadsheets/d/<ID>/edit).

## 2. Google Cloud Console (console.cloud.google.com, signed in as bmpwestside)
- New project: "Savings Tracker".
- APIs & Services > Library > enable **Google Sheets API**.
- OAuth consent screen (Google Auth Platform): User type External, add app name + your email.
  - Add scopes: `.../auth/spreadsheets` and `.../auth/userinfo.email`.
  - Add both emails as Test users. (Or Publish app to "In production" to avoid the 7-day re-consent in Testing.)
- Credentials > Create credentials > OAuth client ID > **Web application**.
  - Authorized JavaScript origins: `https://YOUR-GITHUB-USERNAME.github.io` (origin only, no repo path).
- Copy the Client ID.

## 3. config.js
Paste CLIENT_ID and SHEET_ID. Put her email in VIEWERS.

## 4. GitHub
- New public repo > Add file > Upload files (all 9 files) > Commit.
- Settings > Pages > Deploy from branch `main` / root.
- Your app: https://YOUR-GITHUB-USERNAME.github.io/REPO-NAME/

## 5. Install on iPhone
Open the link in Safari > Share > Add to Home Screen.
