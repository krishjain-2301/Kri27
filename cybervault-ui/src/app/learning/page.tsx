import React from 'react';
import { BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react';

export default function LearningPage() {
  const modules = [
    { 
      title: "Linux Fundamentals", 
      status: "Completed", 
      started: "12 June", 
      completed: "14 June", 
      time: "4h 12m", 
      difficulty: "Easy",
      skills: ["Linux", "Permissions", "Bash", "Users"]
    },
    { 
      title: "Active Directory Enumeration & Attacks", 
      status: "In Progress", 
      started: "20 June", 
      completed: "-", 
      time: "12h 5m", 
      difficulty: "Hard",
      skills: ["Kerberos", "BloodHound", "LDAP", "WinRM"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" /> Learning (Academy)
          </h1>
          <p className="text-gray-500 text-sm">Your personal notes and key takeaways from HTB Academy.</p>
        </div>
      </div>

      <div className="space-y-6">
        {modules.map((m, i) => (
          <div key={i} className="stakent-glass p-8 hover:border-[#333] transition">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{m.title}</h3>
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className={`px-2 py-1 rounded border ${m.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                    {m.status}
                  </span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Started: {m.started}</span>
                  {m.status === 'Completed' && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed: {m.completed}</span>}
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time: {m.time}</span>
                  <span className="text-gray-300">Diff: {m.difficulty}</span>
                </div>
              </div>
              <button className="stakent-btn-primary !py-2 !px-4 text-sm">View Journal →</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {m.skills.map(s => (
                <span key={s} className="text-xs bg-[#1a1a20] border border-[#222] px-3 py-1 rounded-full text-gray-400">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
