'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Shield, Key, User, Play, AlertCircle, RefreshCw } from 'lucide-react';
import { saveConnectionSettings } from '@/actions/onboarding';
import { runSyncPreview, runSyncCommit } from '@/actions/sync';

export default function ConnectionModal({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete: () => void }) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'form' | 'syncing' | 'preview' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  
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
    setErrorMsg('');

    try {
      // 1. Save settings
      await saveConnectionSettings(username, token);
      
      // 2. Fetch Preview
      const updateStep = (index: number) => {
        setSyncSteps(prev => prev.map((s, i) => i <= index ? { ...s, done: true } : s));
      };
      updateStep(0);
      
      const preview = await runSyncPreview();
      updateStep(4);
      setPreviewData(preview);
      
      setTimeout(() => {
        setStep('preview');
      }, 500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect.');
      setStep('error');
    }
  };

  const handleCommit = async () => {
    setStep('syncing');
    setSyncSteps(prev => prev.map(s => ({ ...s, done: true }))); // fast forward visual loading

    try {
      const result = await runSyncCommit(previewData);
      if (!result.success) throw new Error(result.error);
      
      setSyncResults(result);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to commit sync.');
      setStep('error');
    }
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

          {step === 'error' && (
            <div className="py-6 text-center animate-in zoom-in duration-300">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
              <p className="text-sm text-red-400 mb-6 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{errorMsg}</p>
              <button onClick={() => setStep('form')} className="stakent-btn-primary w-full py-3 justify-center">Try Again</button>
            </div>
          )}

          {step === 'preview' && previewData && (
            <div className="py-2 animate-in zoom-in duration-300">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-400" /> Sync Preview
              </h2>
              <p className="text-sm text-gray-400 mb-6">Review the changes before importing to your local vault.</p>

              <div className="space-y-3 mb-6 bg-[#0c0c0e] border border-[#1a1a20] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">New Items Detected</span>
                  <span className="text-green-400 font-bold">{previewData.newItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Updates to Existing Items</span>
                  <span className="text-purple-400 font-bold">{previewData.updatedItems.length}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-[#1a1a20]">
                  <span className="text-sm text-gray-500">Journal Overwrites</span>
                  <span className="text-gray-500 font-bold">0 (Protected)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('form')} className="stakent-pill flex-1 py-3 justify-center border border-[#1a1a20] hover:bg-[#1a1a20]">Cancel</button>
                <button onClick={handleCommit} className="stakent-btn-primary flex-1 py-3 justify-center !bg-white !text-black">
                  Proceed & Import
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-2 animate-in zoom-in duration-500">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#1a1a20]">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                  <CheckCircle className="w-8 h-8 text-green-400 relative z-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Sync Complete</h2>
                  <p className="text-gray-400 text-sm">Successfully merged with local vault in {(syncResults?.durationMs/1000).toFixed(2)}s.</p>
                </div>
              </div>
              
              <div className="mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">What's New</h3>
                {previewData?.newItems.length === 0 && previewData?.updatedItems.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Already up to date.</p>
                ) : (
                  <div className="space-y-2">
                    {previewData?.newItems.map((item: any, i: number) => (
                      <div key={`new-${i}`} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/5">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 font-medium truncate">{item.name}</span>
                        <span className="text-xs text-green-500/70 ml-auto flex-shrink-0">New {item.type}</span>
                      </div>
                    ))}
                    {previewData?.updatedItems.map((item: any, i: number) => (
                      <div key={`upd-${i}`} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/5">
                        <RefreshCw className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="text-gray-300 font-medium truncate">{item.name}</span>
                        <span className="text-xs text-purple-500/70 ml-auto flex-shrink-0">Updated Status</span>
                      </div>
                    ))}
                  </div>
                )}
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
