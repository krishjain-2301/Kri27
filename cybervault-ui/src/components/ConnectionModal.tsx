'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Shield, Key, User, Play } from 'lucide-react';
import { saveConnectionSettings, runFullSync } from '@/actions/onboarding';

export default function ConnectionModal({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete: () => void }) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'form' | 'syncing' | 'success'>('form');
  
  // Sync state
  const [syncSteps, setSyncSteps] = useState([
    { label: 'Connected', done: false },
    { label: 'Fetching profile...', done: false },
    { label: 'Fetching machines...', done: false },
    { label: 'Fetching challenges...', done: false },
    { label: 'Fetching academy...', done: false },
    { label: 'Comparing local database...', done: false },
    { label: 'Creating journals...', done: false },
    { label: 'Done!', done: false }
  ]);
  const [syncResults, setSyncResults] = useState<any>(null);

  const handleConnect = async () => {
    if (!username || !token) return;
    setStep('syncing');

    // Simulate the granular fetching process for UI UX
    const updateStep = (index: number) => {
      setSyncSteps(prev => prev.map((s, i) => i <= index ? { ...s, done: true } : s));
    };

    updateStep(0); // Connected
    await new Promise(r => setTimeout(r, 600));
    updateStep(1); // Profile
    await new Promise(r => setTimeout(r, 500));
    updateStep(2); // Machines
    
    // In background, actually save and sync
    await saveConnectionSettings(username, token);
    const result = await runFullSync();
    
    updateStep(3); // Challenges
    await new Promise(r => setTimeout(r, 500));
    updateStep(4); // Academy
    await new Promise(r => setTimeout(r, 600));
    updateStep(5); // Comparing
    await new Promise(r => setTimeout(r, 700));
    updateStep(6); // Journals
    await new Promise(r => setTimeout(r, 400));
    updateStep(7); // Done!
    
    setSyncResults(result);
    setTimeout(() => {
      setStep('success');
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="stakent-glass p-8 max-w-md w-full relative overflow-hidden"
        >
          {step === 'form' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Connect Hack The Box</h2>
                  <p className="text-sm text-gray-500">Sync your profile securely.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1 block">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. rakazaka"
                      className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1 block">App Token</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input 
                      type="password" 
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      placeholder="eyJhb..."
                      className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={onClose} className="stakent-pill flex-1 py-3 justify-center border border-[#1a1a20] hover:bg-[#1a1a20]">Cancel</button>
                <button onClick={handleConnect} disabled={!username || !token} className="stakent-btn-primary flex-1 py-3 justify-center !bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  Connect
                </button>
              </div>
            </>
          )}

          {step === 'syncing' && (
            <div className="py-4">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
                Connecting...
              </h2>
              
              <div className="space-y-3 font-mono text-sm">
                {syncSteps.map((s, idx) => (
                  <div key={idx} className={`flex items-center gap-3 transition duration-300 ${s.done ? 'text-white' : 'text-gray-600'}`}>
                    {s.done ? <CheckCircle className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-700" />}
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                <CheckCircle className="w-10 h-10 text-green-400 relative z-10" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">🎉 Welcome to CyberVault</h2>
              <p className="text-gray-400 mb-8">Ready to document your journey.</p>
              
              <div className="flex justify-center gap-4 text-sm font-semibold mb-8">
                <div className="bg-[#0c0c0e] border border-[#1a1a20] px-4 py-2 rounded-xl">
                  <span className="text-green-400 block text-lg">{syncResults?.newEntries || 5}</span>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Imported</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  onClose();
                  onComplete();
                }} 
                className="stakent-btn-primary w-full py-3 justify-center !bg-white !text-black hover:!bg-gray-200"
              >
                Open Dashboard
              </button>
            </div>
          )}
          
          {step === 'success' && (
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
