'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Hammer } from 'lucide-react';

export default function GithubSyncPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500/20 to-gray-400/20 flex items-center justify-center mx-auto mb-4">
        <GitBranch className="w-10 h-10 text-[var(--color-text-primary)]" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">GitHub Sync</h1>
      <p className="text-sm text-[var(--color-text-tertiary)] max-w-md mx-auto mb-6">
        Automatically generate Markdown files from your challenges and learning entries, then commit and push to GitHub. Coming in Phase 5.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm">
        <Hammer className="w-4 h-4" />
        Coming Soon
      </div>
      <div className="mt-8 glass-card p-5 max-w-md mx-auto text-left">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Planned Repository Structure</h3>
        <pre className="text-xs text-emerald-400 font-mono bg-[var(--color-bg-input)] p-3 rounded-lg border border-[var(--color-border)]">
{`CenWo/
├── README.md
├── Challenges/
│   ├── Lame.md
│   ├── Blue.md
│   └── ...
├── Learning/
│   ├── SQL-Injection.md
│   └── ...
├── Commands/
├── Payloads/
└── Analytics/`}
        </pre>
      </div>
    </motion.div>
  );
}
