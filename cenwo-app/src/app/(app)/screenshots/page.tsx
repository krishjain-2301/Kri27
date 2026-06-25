'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Hammer } from 'lucide-react';

export default function ScreenshotsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
        <Camera className="w-10 h-10 text-purple-400" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Screenshot Vault</h1>
      <p className="text-sm text-[var(--color-text-tertiary)] max-w-md mx-auto mb-6">
        Upload screenshots, automatically extract text with OCR, and link them to challenges. Coming in Phase 3.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm">
        <Hammer className="w-4 h-4" />
        Coming Soon
      </div>
    </motion.div>
  );
}
