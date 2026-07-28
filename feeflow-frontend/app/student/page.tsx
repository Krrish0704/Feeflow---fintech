// app/student/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  FileText,
  User
} from 'lucide-react';

type FeeItem = {
  id: string;
  title: string;
  amount: string;
  dueDate: string;
  status: 'PENDING' | 'PAID';
};

const INITIAL_FEES: FeeItem[] = [
  { id: 'FEE-01', title: 'Cannabis Lab Joint Rule & Materials', amount: '180.00', dueDate: '2026-04-15', status: 'PENDING' },
  { id: 'FEE-02', title: 'Advanced Safety Compliance Module', amount: '95.00', dueDate: '2026-05-01', status: 'PAID' },
];

export default function StudentPortal() {
  const [fees, setFees] = useState<FeeItem[]>(INITIAL_FEES);
  const [systemLoad, setSystemLoad] = useState('0.03 ms');
  const [scrolled, setScrolled] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

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

  const handlePay = (id: string) => {
    setFees(prev => prev.map(f => f.id === id ? { ...f, status: 'PAID' } : f));
    setPaymentStatus(`Transaction committed successfully for ${id}! Immutable ledger updated.`);
    setTimeout(() => setPaymentStatus(null), 5000);
  };

  const headerClass = scrolled
    ? 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl bg-white/70 border-b border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
    : 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-md bg-transparent border-b border-transparent';

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] font-sans selection:bg-[#ff7a00] selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="fixed top-[-10%] left-[8%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#ff7a00]/20 to-[#ffbe98]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[5%] right-[2%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#00a8e8]/10 to-[#ff7a00]/10 blur-[150px] pointer-events-none z-0" />

      {/* HEADER */}
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full bg-white/60 backdrop-blur-2xl border border-black/10 flex items-center justify-center text-[#1a1a1a] font-bold text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
              S
            </div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">Student Portal.</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-black/5 text-xs font-mono text-[#6b6b6b]">
              <Activity className="w-3 h-3 text-[#ff7a00]" />
              <span>Lat: {systemLoad}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/60 border border-black/10 text-xs font-medium text-[#1a1a1a] flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>alex_student_09</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-8">
        
        {/* BANNER NOTIFICATION */}
        {paymentStatus && (
          <div className="backdrop-blur-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-lg transition-all">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-medium">{paymentStatus}</span>
          </div>
        )}

        <div className="backdrop-blur-[50px] bg-white/50 border border-black/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-black/10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] font-semibold">Account Ledger</span>
              <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mt-1">Assigned Fees & Payments</h2>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/60 border border-black/10 text-xs font-mono text-[#6b6b6b]">
              Ledger Sync: <strong className="text-emerald-600">VERIFIED</strong>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {fees.map((fee) => (
              <div key={fee.id} className="backdrop-blur-2xl bg-white/60 border border-black/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-[#ff7a00] font-bold">{fee.id}</span>
                    <span className="text-xs text-[#6b6b6b]">• Due: {fee.dueDate}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1a1a1a]">{fee.title}</h4>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-lg font-extrabold text-[#1a1a1a]">${fee.amount}</span>
                  {fee.status === 'PENDING' ? (
                    <button 
                      onClick={() => handlePay(fee.id)}
                      className="px-5 py-2.5 rounded-full bg-[#ff7a00] hover:bg-[#e06b00] text-white text-xs font-semibold shadow-[0_4px_16px_rgba(255,122,0,0.3)] transition-all flex items-center space-x-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Securely</span>
                    </button>
                  ) : (
                    <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PAID & LOGGED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-black/10 bg-white/30 backdrop-blur-3xl py-8 text-center text-xs text-[#6b6b6b] relative z-10 mt-12">
        <p>Cannabis Lab Student Portal // Immutable Ledger Verified</p>
      </footer>
    </div>
  );
}