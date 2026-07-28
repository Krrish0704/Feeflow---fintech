// app/principal/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Lock, 
  Database, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  FileText,
  Download,
  Terminal,
  Layers,
  Cpu
} from 'lucide-react';

export default function PrincipalPortal() {
  const [systemLoad, setSystemLoad] = useState('0.03 ms');
  const [scrolled, setScrolled] = useState(false);
  const [auditLogs, setAuditLogs] = useState([
    { id: 'tx_99b4c1a2', time: '14:22:10', type: 'FEE_STAGED', desc: 'Fee Rule Staged: Cannabis Lab Joint', hash: '0x8f9b4c1a2e3f4d5c6b7a', status: 'COMMITTED' },
    { id: 'tx_88a2e3f4', time: '13:10:45', type: 'MAKER_CHECKER', desc: 'Maker-Checker Sign-off: Safety Module', hash: '0x3c4d5c6b7a89f9b4c1a2', status: 'COMMITTED' },
    { id: 'tx_77f1d2c3', time: '09:44:12', type: 'PAYMENT', desc: 'Student Payment Processed: alex_student_09', hash: '0x1a2e3f4d5c6b7a89f9b4', status: 'COMMITTED' },
  ]);

  // Live telemetry ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((Math.random() * 0.05 + 0.02).toFixed(2) + ' ms');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleExportAudit = () => {
    const reportData = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feeflow-cryptographic-audit-report.json';
    a.click();
  };

  const headerClass = scrolled
    ? 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl bg-white/70 border-b border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
    : 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-md bg-transparent border-b border-transparent';

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] font-sans selection:bg-[#ff7a00] selection:text-white relative overflow-hidden">
      
      {/* SVG GLASS NOISE FILTER */}
      <svg width="0" height="0" className="absolute">
        <filter id="glassNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.02 0" />
        </filter>
      </svg>

      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="fixed top-[-10%] left-[8%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#ff7a00]/25 to-[#ffbe98]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[5%] right-[2%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#7928ca]/15 to-[#ff7a00]/15 blur-[150px] pointer-events-none z-0" />

      {/* HEADER */}
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full bg-white/60 backdrop-blur-2xl border border-black/10 flex items-center justify-center text-[#1a1a1a] font-bold text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
              P
            </div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">Principal Executive Dashboard.</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-black/5 text-xs font-mono text-[#6b6b6b]">
              <Activity className="w-3 h-3 text-[#ff7a00]" />
              <span>Lat: {systemLoad}</span>
            </div>
            <button 
              onClick={handleExportAudit}
              className="px-4 py-2 rounded-full bg-[#1a1a1a] hover:bg-[#333] text-white text-xs font-medium transition-all shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 space-y-10">
        
        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="backdrop-blur-3xl bg-white/50 border border-black/10 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
            <span className="text-xs font-mono text-[#6b6b6b] uppercase tracking-wider">Total Revenue Collected</span>
            <h2 className="text-3xl font-extrabold text-[#1a1a1a]">$148,250.00</h2>
            <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% from last term</span>
            </div>
          </div>

          <div className="backdrop-blur-3xl bg-white/50 border border-black/10 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
            <span className="text-xs font-mono text-[#6b6b6b] uppercase tracking-wider">Active Compliance Rules</span>
            <h2 className="text-3xl font-extrabold text-[#1a1a1a]">38 JSONB Rules</h2>
            <div className="text-xs text-[#ff7a00] font-semibold flex items-center space-x-1">
              <Database className="w-3.5 h-3.5" />
              <span>Zero Schema Migrations</span>
            </div>
          </div>

          <div className="backdrop-blur-3xl bg-white/50 border border-black/10 rounded-3xl p-6 shadow-md space-y-2 relative overflow-hidden">
            <span className="text-xs font-mono text-[#6b6b6b] uppercase tracking-wider">Append-Only Audit Logs</span>
            <h2 className="text-3xl font-extrabold text-[#1a1a1a]">1,240 Entries</h2>
            <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Tamper-Proof</span>
            </div>
          </div>
        </div>

        {/* RECENT AUDIT TRAIL */}
        <div className="backdrop-blur-[50px] bg-white/50 border border-black/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.1)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[2.5rem]" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] font-semibold">Ledger Oversight</span>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mt-1">Cryptographic Append-Only Stream</h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/60 border border-black/10 text-xs font-mono text-emerald-600 font-bold shadow-inner">
              POSTGRES_APPEND_ONLY // VERIFIED
            </div>
          </div>

          <div className="relative mt-6 space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="backdrop-blur-2xl bg-white/60 border border-black/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shadow-sm">
                <div className="space-y-0.5">
                  <div className="text-[#6b6b6b] text-[11px]">
                    [{log.time}] <strong className="text-[#1a1a1a]">{log.id}</strong> • <span className="text-[#ff7a00]">{log.hash}</span>
                  </div>
                  <div className="text-[#1a1a1a] font-sans font-semibold">{log.desc}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white/30 backdrop-blur-3xl py-8 text-center text-xs text-[#6b6b6b] relative z-10 mt-12">
        <p>Cannabis Lab Principal Executive Portal // Advanced Cryptographic Oversight</p>
      </footer>

    </div>
  );
}