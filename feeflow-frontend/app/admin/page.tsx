// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Lock, 
  Database, 
  PlusCircle, 
  Check, 
  XCircle,
  FileText,
  Sliders
} from 'lucide-react';

type StagedRule = {
  id: string;
  title: string;
  amount: string;
  maker: string;
  status: 'PENDING_CHECKER' | 'APPROVED' | 'REJECTED';
};

const INITIAL_RULES: StagedRule[] = [
  { id: 'STG-9921', title: 'Advanced AI Lab Equipment Fee', amount: '250.00', maker: 'admin_maker_01', status: 'PENDING_CHECKER' },
  { id: 'STG-9922', title: 'Bio-Safety Module Charge', amount: '120.00', maker: 'admin_maker_03', status: 'APPROVED' },
];

export default function AdminPortal() {
  const [rules, setRules] = useState<StagedRule[]>(INITIAL_RULES);
  const [systemLoad, setSystemLoad] = useState('0.04 ms');
  const [scrolled, setScrolled] = useState(false);

  // Maker form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');

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

  const handleStageRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    const newItem: StagedRule = {
      id: `STG-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      amount: newAmount,
      maker: 'current_admin_user',
      status: 'PENDING_CHECKER'
    };
    setRules([newItem, ...rules]);
    setNewTitle('');
    setNewAmount('');
  };

  const handleApprove = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleReject = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const headerClass = scrolled
    ? 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl bg-white/70 border-b border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
    : 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-md bg-transparent border-b border-transparent';

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] font-sans selection:bg-[#ff7a00] selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND GLOWS */}
      <div className="fixed top-[-10%] left-[8%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#ff7a00]/25 to-[#ffbe98]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[5%] right-[2%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#7928ca]/15 to-[#ff7a00]/15 blur-[150px] pointer-events-none z-0" />

      {/* HEADER */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={headerClass}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-2xl border border-black/10 flex items-center justify-center text-[#1a1a1a] font-bold text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
              A
            </div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">Admin Control Plane.</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-black/5 text-xs font-mono text-[#6b6b6b]">
              <Activity className="w-3 h-3 text-[#ff7a00]" />
              <span>Lat: {systemLoad}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/60 border border-black/10 text-xs font-medium text-[#1a1a1a] flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>Maker-Checker Mode</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10 space-y-12">
        
        {/* MAKER SECTION: CREATE FEE RULE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-[50px] bg-white/50 border border-black/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center space-x-2 pb-6 border-b border-black/10">
            <Sliders className="w-5 h-5 text-[#ff7a00]" />
            <h3 className="text-xl font-bold text-[#1a1a1a]">Maker Module: Stage JSONB Fee Rule</h3>
          </div>

          <form onSubmit={handleStageRule} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div>
              <label className="block text-xs font-medium text-[#6b6b6b] mb-1">Rule Title</label>
              <input 
                type="text" 
                placeholder="e.g. Robotics Lab Fee" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className="w-full bg-white/65 border border-black/10 rounded-2xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#ff7a00]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b6b6b] mb-1">Amount ($)</label>
              <input 
                type="text" 
                placeholder="150.00" 
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                required
                className="w-full bg-white/65 border border-black/10 rounded-2xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#ff7a00]"
              />
            </div>
            <div className="flex items-end">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-2.5 rounded-full bg-[#1a1a1a] hover:bg-[#333] text-white text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <PlusCircle className="w-4 h-4 text-[#ff7a00]" />
                <span>Stage to Verification Queue</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* CHECKER SECTION: APPROVAL QUEUE WITH ANIMATE PRESENCE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-[50px] bg-white/50 border border-black/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center space-x-2 pb-6 border-b border-black/10">
            <ShieldCheck className="w-5 h-5 text-[#ff7a00]" />
            <h3 className="text-xl font-bold text-[#1a1a1a]">Checker Module: Staging Queue Verification</h3>
          </div>

          <div className="mt-6 space-y-4">
            <AnimatePresence>
              {rules.map((rule) => (
                <motion.div 
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="backdrop-blur-2xl bg-white/60 border border-black/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-[#ff7a00] font-bold">{rule.id}</span>
                      <span className="text-xs text-[#6b6b6b]">• Maker: {rule.maker}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#1a1a1a]">{rule.title} (${rule.amount})</h4>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    {rule.status === 'PENDING_CHECKER' ? (
                      <>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(rule.id)}
                          className="px-4 py-2 rounded-full bg-[#ff7a00] hover:bg-[#e06b00] text-white text-xs font-semibold shadow-md flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(rule.id)}
                          className="px-4 py-2 rounded-full bg-white/80 border border-black/10 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </motion.button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-full text-xs font-bold border ${rule.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {rule.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

      </main>

      <footer className="border-t border-black/10 bg-white/30 backdrop-blur-3xl py-8 text-center text-xs text-[#6b6b6b] relative z-10 mt-12">
        <p>Cannabis Lab Admin Control Plane // Dual-Control Verification Active</p>
      </footer>
    </div>
  );
}