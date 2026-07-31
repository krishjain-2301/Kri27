# 🛡️ Plethora — Hacking Journal & Second Brain OS

<p align="center">
  <img src="public/logo.png" width="120" alt="Plethora Logo" />
</p>

<p align="center">
  <strong>The Ultimate Privacy-First Hacking Journal & Second Brain OS for Cybersecurity Researchers, CTF Players, and Bug Bounty Hunters.</strong>
</p>

<p align="center">
  <a href="https://plethora-htb.vercel.app/"><img src="https://img.shields.io/badge/Live%20App-Plethora-brightgreen?style=for-the-badge&logo=vercel" alt="Live App"></a>
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Database-IndexedDB%20%2F%20Dexie-purple?style=for-the-badge" alt="IndexedDB">
</p>

---

## 🌟 Overview

**Plethora** is a state-of-the-art Second Brain application designed specifically for penetration testers, CTF players, and security enthusiasts. It bridges the gap between external learning platforms and your personal knowledge base by seamlessly syncing your progress from **Hack The Box** and **TryHackMe**, while keeping 100% of your write-ups, notes, and credentials stored **locally in your browser**.

---

## ✨ Key Features

### 🟢 Hack The Box Integration (Green Theme)
- **Automated Sync**: Securely connect your HTB App Token to import Machines, Challenges, Sherlocks, and Academy modules.
- **Root & Ownership Tracking**: Track User Owned vs. Root Owned status and machine difficulty.

### 🔴 TryHackMe Integration (Red Theme)
- **Public Profile Sync**: Simply enter your THM username to pull in completed rooms and walkthrough paths.
- **WAF-Resilient Proxy**: Includes a Next.js server-to-server proxy route (`/api/thm/...`) and client fallbacks to bypass Vercel Security Checkpoint limitations.

### 🔒 100% Local-First & Private Architecture
- **Zero Server Storage**: Everything is persisted locally in your browser using **IndexedDB** (via Dexie.js).
- **Private Credentials**: Your HTB App Token and THM username stay in your browser memory and are never transmitted to external databases.
- **Self-Healing Database**: Automatic deduplication engine (`cleanupDuplicateItems`) purges duplicate records and orphan write-ups on application load.

### 📝 BlockNote Journaling Engine
- **Rich Text & Markdown Editor**: Built on top of BlockNote with instant auto-save, markdown compilation, and inline screenshot pasting.
- **Personal Metadata**: Log perceived difficulty, confidence ratings, mood, review flags, and word count statistics.
- **Daily Notes**: Dedicated daily scratchpad for general study notes, independent of specific machine write-ups.

### 📊 Activity Timeline & Heatmap
- **Contribution Heatmap**: GitHub-style interactive calendar tracking daily hacking and note-taking activity.
- **Chronological Feed**: Searchable activity log capturing machine roots, challenge solves, and journal snapshots.

### ⚡ Command Palette & Global Search
- **Instant Search (`Ctrl+K` / `Ctrl+Q`)**: Keyboard-driven command center to fuzzy search across write-ups, commands, and code snippets in real time.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [Dexie.js](https://dexie.org/) (IndexedDB wrapper) |
| **Editor** | [BlockNote](https://www.blocknotejs.org/) |
| **Icons & Design** | [Lucide React](https://lucide.dev/) |
| **Analytics** | [@vercel/analytics](https://vercel.com/analytics) |
| **Testing** | Node.js Test Runner (`node --test`) & `tsx` |

---

## 🚀 Getting Started

### Local Development / Self-Hosting

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Unit Tests**:
   ```bash
   npx tsx --test tests/htb-provider.test.ts tests/thm-provider.test.ts
   ```

4. **Build Production App**:
   ```bash
   npm run build
   ```

---

<p align="center">
  Created with ❤️ by <strong>Krish Jain</strong> (<a href="https://github.com/krishjain-2301">@krishjain-2301</a>)
</p>
