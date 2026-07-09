# Plethora

Plethora is an advanced Second Brain and Cybersecurity OS, built specifically for hackers, bug bounty hunters, and security researchers. It natively syncs with Hack The Box to track your progress and provides a robust, browser-based journaling system for your write-ups.

## Screenshots

<p align="center">
  <img src="docs/screenshots/dashboard.png" width="49%" alt="Dashboard" />
  <img src="docs/screenshots/timeline.png" width="49%" alt="Activity Timeline" />
</p>
<p align="center">
  <img src="docs/screenshots/challenges.png" width="49%" alt="HTB Challenges" />
  <img src="docs/screenshots/journals.png" width="49%" alt="Journal Hub" />
</p>

## Features

- **100% Client-Side & Private**: Everything is stored completely within your browser using IndexedDB (via Dexie.js). Your private write-ups and API keys never touch any backend server.
- **Hack The Box Auto-Sync**: Connect your HTB App Token to automatically pull in your active and completed Machines, Challenges, and Sherlocks via a built-in CORS proxy.
  - **Smart Auto-Sync**: Set a custom background interval (e.g., 30 minutes) to seamlessly fetch new items while you work.
- **Global Activity Timeline**: A unified, searchable chronological feed tracking every action you take (solving machines, updating journals, adding screenshots, and more).
- **Rich Journaling Engine**: A powerful BlockNote-based editor with instant auto-save, markdown compilation, and inline screenshot pasting. Images are stored safely as base64 Data URIs directly in your local browser storage.
- **Command Palette (Ctrl+Q)**: A fully keyboard-driven command center.
  - **Instant Search**: Instantly search thousands of journals using a fast client-side search engine.
  - **Quick Navigation**: Jump instantly to your Dashboard, Journal Hub, or Daily Notes.
- **Daily Notes**: A dedicated space for general studying, scratchpads, and meeting notes, kept completely separate from your HTB write-ups.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Hack The Box App Token (for syncing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krishjain-2301/Kri27.git
   cd Kri27/cybervault-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

4. Open Plethora:
   Navigate to `http://localhost:3000` in your browser.

## First Setup
1. Open Plethora in your browser and click **Connect Hack The Box**.
2. To get your App Token, navigate to the [Hack The Box Dashboard](https://app.hackthebox.com/).
3. Click on **HTB Labs** and select **Start Playing**.
4. Once you reach the labs website, navigate to your **Profile Settings**.
5. Go to the **App Tokens** section and generate a new token.
6. Copy the generated token, paste it into Plethora, and click connect! Plethora will securely save this to your local browser database and begin importing your progress.

## Architecture & Security
Plethora uses a pure client-side architecture powered by **Next.js** and **IndexedDB** (via Dexie.js). 
Because there is no backend database, all of your notes, screenshots, and your sensitive HTB App Token are siloed securely within your own browser storage. You can safely deploy this application to Vercel (or any edge provider) for free, knowing that your data remains 100% private to your device.
