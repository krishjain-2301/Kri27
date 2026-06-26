# Plethora

Plethora is an advanced Second Brain and Cybersecurity OS, built specifically for hackers, bug bounty hunters, and security researchers. It natively syncs with Hack The Box to track your progress and provides a robust, local-first journaling system for your write-ups.

## Features

- Local-First & Private: Everything is stored locally in an SQLite database. Your private write-ups never touch the cloud.
- Hack The Box Auto-Sync: Connect your HTB App Token to automatically pull in your active and completed Machines, Challenges, and Sherlocks.
  - Smart Auto-Sync: Set a custom background interval (e.g. 30 minutes) to seamlessly fetch new items while you work, with smart catch-up logic when you reopen the app.
- Global Activity Timeline: A unified, searchable chronological feed tracking every action you take (solving machines, updating journals, adding screenshots, and more).
- GitHub-Style Study Heatmap: A visual 90-day contribution grid on your timeline to track your daily hacking consistency, with dynamic streak and action tracking on your dashboard.
- Rich Journaling Engine: A powerful BlockNote-based editor with instant auto-save, markdown compilation, and inline screenshot pasting.
- Command Palette (Ctrl+Q): A fully keyboard-driven command center.
  - FTS5 Search: Instantly search thousands of journals using an ultra-fast SQLite Full-Text Search engine.
  - Dynamic Command Extraction: Type a command like nmap into the palette, and Plethora will automatically extract matching bash/powershell commands from your past write-ups and tell you exactly where you used them.
  - Quick Navigation: Jump instantly to your Dashboard, Journal Hub, or Daily Notes.
- Daily Notes: A dedicated space for general studying, scratchpads, and meeting notes, kept completely separate from your HTB write-ups.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Hack The Box App Token (for syncing)

### Installation

1. Clone the repository:
   git clone https://github.com/krishjain-2301/Kri27.git
   cd Kri27/cybervault-ui

2. Install dependencies:
   npm install

   (Note for Python users: Node.js uses package.json exactly like a requirements.txt file. Running the command above will automatically read the package.json file and install all required libraries into a local node_modules folder.)

3. Run the application:
   npm run dev

4. Open Plethora:
   Navigate to http://localhost:3001 in your browser.

## First Setup
1. When you first open the Dashboard, click "Connect Hack The Box".
2. Enter your HTB App Token (You can generate this in your HTB Profile Settings).
3. Plethora will securely save this token to your local database and immediately begin importing your Machines and Challenges.
4. Go to the Journal Hub to start writing!

## Architecture & Security
Plethora uses a local SQLite database (vault.db) stored inside the CyberVault_Data/ directory. This directory is strictly ignored in .gitignore, ensuring your private notes, screenshots, and HTB App Tokens are never accidentally pushed to a remote repository.
