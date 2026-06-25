import React from 'react';
import { Folder, FileText, ChevronRight, Search, Hash } from 'lucide-react';

export default function KnowledgePage() {
  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Sidebar - Folder Tree */}
      <div className="w-64 flex-shrink-0 stakent-glass p-4 flex flex-col h-[calc(100vh-120px)]">
        <div className="mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#222] bg-[#0c0c0e]">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search Vault..." 
              className="bg-transparent border-none outline-none text-xs text-gray-300 w-full placeholder-gray-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {/* Active Directory Folder */}
          <div className="mb-2">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white w-full text-left py-1">
              <ChevronRight className="w-3 h-3 transition-transform rotate-90" />
              <Folder className="w-4 h-4 text-yellow-500" />
              Active Directory
            </button>
            <div className="ml-6 space-y-1 mt-1 border-l border-[#222] pl-2">
              <button className="flex items-center gap-2 text-xs text-purple-400 font-medium w-full text-left py-1 hover:text-purple-300 bg-purple-500/10 px-2 rounded">
                <FileText className="w-3 h-3" /> Kerberoasting
              </button>
              <button className="flex items-center gap-2 text-xs text-gray-400 font-medium w-full text-left py-1 hover:text-gray-200 px-2">
                <FileText className="w-3 h-3" /> BloodHound Queries
              </button>
              <button className="flex items-center gap-2 text-xs text-gray-400 font-medium w-full text-left py-1 hover:text-gray-200 px-2">
                <FileText className="w-3 h-3" /> AS-REP Roasting
              </button>
            </div>
          </div>

          {/* Linux PrivEsc Folder */}
          <div className="mb-2">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white w-full text-left py-1">
              <ChevronRight className="w-3 h-3 transition-transform" />
              <Folder className="w-4 h-4 text-blue-500" />
              Linux PrivEsc
            </button>
          </div>

          {/* Web Exploitation Folder */}
          <div className="mb-2">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white w-full text-left py-1">
              <ChevronRight className="w-3 h-3 transition-transform" />
              <Folder className="w-4 h-4 text-green-500" />
              Web Exploitation
            </button>
          </div>
        </div>
      </div>

      {/* Right Content - Markdown Editor/Viewer */}
      <div className="flex-1 stakent-glass p-0 flex flex-col h-[calc(100vh-120px)] overflow-hidden relative">
        {/* Top bar */}
        <div className="h-14 border-b border-[#1a1a20] flex items-center justify-between px-6 bg-[#0c0c0e] rounded-t-[20px]">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <span>Vault</span>
            <span>/</span>
            <span>Active Directory</span>
            <span>/</span>
            <span className="text-white flex items-center gap-1"><Hash className="w-3 h-3 text-purple-500"/> Kerberoasting</span>
          </div>
          <button className="stakent-btn-primary !py-1.5 !px-4 !text-xs">Edit Note</button>
        </div>

        {/* Note Content */}
        <div className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-white border-b border-[#222] pb-4">Kerberoasting (T1558.003)</h1>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            Kerberoasting is a technique that allows an attacker to steal the ticket-granting service (TGS) ticket for a service account, which is encrypted with the NTLM hash of the service account's password. The attacker can then crack the ticket offline to recover the plaintext password.
          </p>

          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> 
            1. Requesting TGS using Impacket
          </h3>
          <div className="bg-[#111114] border border-[#222] p-4 rounded-xl mb-6 relative group">
            <button className="absolute top-3 right-3 text-xs bg-[#222] hover:bg-[#333] text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Copy</button>
            <code className="text-purple-300 font-mono text-sm block">
              impacket-GetUserSPNs -request -dc-ip 10.10.10.100 active.htb/svc_tgs
            </code>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> 
            2. Cracking the Hash with Hashcat
          </h3>
          <div className="bg-[#111114] border border-[#222] p-4 rounded-xl mb-6 relative group">
            <button className="absolute top-3 right-3 text-xs bg-[#222] hover:bg-[#333] text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Copy</button>
            <code className="text-purple-300 font-mono text-sm block">
              hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt
            </code>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl text-purple-200 text-sm flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p><strong>Note:</strong> You don't need administrative privileges to perform Kerberoasting. Any domain user can request a TGS for any service principal name (SPN).</p>
          </div>
        </div>
      </div>

    </div>
  );
}
