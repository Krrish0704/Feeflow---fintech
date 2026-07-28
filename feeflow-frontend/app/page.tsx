// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ShieldCheck,
  ArrowRight,
  Activity,
  Lock,
  Database,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Check,
  FileText,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Architecture', href: '#features' },
  { label: 'Workspace', href: '#interactive' },
  { label: 'Compliance', href: '#security' },
];

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Database,
    title: 'Dynamic JSONB Rules',
    desc: 'Define fee categories, custom formulas, and condition matrices instantly without modifying database table schemas.',
  },
  {
    icon: ShieldCheck,
    title: 'Maker-Checker Workflow',
    desc: 'Enforce strict segregation of financial duties with dual-authorization staging gates before deployment.',
  },
  {
    icon: Lock,
    title: 'Append-Only Ledger',
    desc: 'Absolute security and tamper-proof financial logging designed to withstand rigorous judge audits.',
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'maker' | 'checker' | 'ledger'>('maker');
  const [systemLoad, setSystemLoad] = useState('0.04 ms');
  const [scrolled, setScrolled] = useState(false);

  const [feeName, setFeeName] = useState('Cannabis Lab Joint Rule');
  const [amount, setAmount] = useState('180.00');
  const [stagedStatus, setStagedStatus] = useState<'idle' | 'staged' | 'approved'>('idle');

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

  const headerClass = scrolled
    ? 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl bg-white/70 border-b border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
    : 'sticky top-0 z-30 transition-all duration-300 backdrop-blur-md bg-transparent border-b border-transparent';

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] font-sans selection:bg-[#ff7a00] selection:text-white relative overflow-hidden">
      
      {/* NOISE & AMBIENT GLOWS */}
      <svg width="0" height="0" className="absolute">
        <filter id="glassNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.02 0" />
        </filter>
      </svg>

      <div className="fixed top-[-10%] left-[8%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#ff7a00]/25 to-[#ffbe98]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[5%] right-[2%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#7928ca]/15 to-[#ff7a00]/15 blur-[150px] pointer-events-none z-0" />

      {/* HEADER WITH FADE-IN */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={headerClass}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full bg-white/60 backdrop-blur-2xl border border-black/10 flex items-center justify-center text-[#1a1a1a] font-bold text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
              C
            </div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">Cannabis Lab.</span>
          </div>

          <div className="hidden md:flex items-center space-x-1 bg-white/40 backdrop-blur-xl border border-black/5 rounded-full px-2 py-1.5">
            {NAV_ITEMS.map((item: NavItem) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-white/60 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-black/5 text-xs font-mono text-[#6b6b6b]">
              <Activity className="w-3 h-3 text-[#ff7a00]" />
              <span>Lat: {systemLoad}</span>
            </div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#interactive"
              className="px-5 py-2.5 rounded-full bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-medium transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex items-center space-x-1.5"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* HERO SECTION WITH SPRING ENTRANCE */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-2xl border border-black/10 text-xs font-medium text-[#4a4a4a] mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff7a00]" />
          <span>Next-Gen Enterprise Compliance & Fee Engine</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#1a1a1a] tracking-tight mb-6 leading-[1.1]"
        >
          Dynamic Fee Control, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] to-[#e0559a]">
            Immutable Ledgers.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto text-[#6b6b6b] text-base sm:text-lg mb-10 leading-relaxed font-normal"
        >
          Designed for high-performance financial systems. Powered by JSONB metadata rules,
          append-only account logs, and strict dual-control Maker-Checker sign-offs.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#interactive"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#e06b00] text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-[#ff7a00]/30"
          >
            <span>Explore Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/50 border border-black/10 text-[#1a1a1a] font-semibold flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>View Architecture</span>
          </motion.a>
        </motion.div>
      </section>

      {/* INTERACTIVE WORKSPACE WITH ANIMATE PRESENCE & SPRING TABS */}
      <section id="interactive" className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="backdrop-blur-[50px] bg-white/50 border border-black/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.1)] overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-black/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] font-semibold">Control Plane</span>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mt-1">Live Transaction Pipeline</h3>
            </div>

            <div className="flex items-center space-x-1 bg-white/40 backdrop-blur-2xl p-1.5 rounded-full border border-black/5">
              {(['maker', 'checker', 'ledger'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    activeTab === tab ? 'text-[#1a1a1a]' : 'text-[#6b6b6b] hover:text-[#1a1a1a]'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/5 z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">
                    {tab === 'maker' ? '1. Maker' : tab === 'checker' ? '2. Checker' : '3. JSONB Ledger'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <AnimatePresence mode="wait">
              {activeTab === 'maker' && (
                <motion.div
                  key="maker"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#ff7a00]/10 text-[#c25f00] text-xs font-semibold border border-[#ff7a00]/25">Step 1: Staging</span>
                    <h4 className="text-2xl font-bold text-[#1a1a1a]">Configure Fee Structures On-The-Fly</h4>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed">
                      Makers can instantiate new dynamic rules, set category parameters, and push custom JSONB metadata payloads directly into the staging queue with zero migrations required.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-[#6b6b6b] mb-1">Fee Rule Title</label>
                        <input
                          type="text"
                          value={feeName}
                          onChange={(e) => setFeeName(e.target.value)}
                          className="w-full bg-white/60 border border-black/10 rounded-2xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#ff7a00]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6b6b6b] mb-1">Base Amount ($)</label>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-white/60 border border-black/10 rounded-2xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#ff7a00]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStagedStatus('staged')}
                        className="px-6 py-3 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold flex items-center space-x-2 shadow-md"
                      >
                        <PlusCircle className="w-4 h-4 text-[#ff7a00]" />
                        <span>{stagedStatus === 'staged' ? 'Rule Staged Successfully!' : 'Stage New Rule'}</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="backdrop-blur-3xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-md space-y-4 font-mono text-xs">
                    <div className="flex justify-between items-center text-[#6b6b6b] border-b border-black/10 pb-3">
                      <span>payload.json</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${stagedStatus === 'staged' ? 'bg-amber-100 text-amber-700' : 'bg-black/5 text-[#6b6b6b]'}`}>
                        {stagedStatus === 'staged' ? 'STAGED_PENDING_REVIEW' : 'DRAFT'}
                      </span>
                    </div>
                    <pre className="text-[#b8560f] overflow-x-auto leading-relaxed">
{`{
  "fee_category": "${feeName}",
  "amount": ${amount},
  "target_department": "Cannabis Lab Operations",
  "conditions": {
    "age_verification": 18,
    "penalty_pct": 2.5
  }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'checker' && (
                <motion.div
                  key="checker"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#ff7a00]/10 text-[#c25f00] text-xs font-semibold border border-[#ff7a00]/25">Step 2: Dual Control</span>
                    <h4 className="text-2xl font-bold text-[#1a1a1a]">Secure Maker-Checker Approval</h4>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed">
                      Prevent unauthorized financial modifications. Checkers verify cryptographically signed staging payloads before anything hits the primary core ledger.
                    </p>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStagedStatus('approved')}
                        className="px-6 py-3 rounded-full bg-[#ff7a00] text-white text-xs font-semibold flex items-center space-x-2 shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>{stagedStatus === 'approved' ? 'Approved & Locked!' : 'Approve Transaction'}</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="backdrop-blur-3xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-md space-y-3 text-xs">
                    <div className="flex justify-between text-[#6b6b6b] py-1.5 border-b border-black/10">
                      <span>Staging ID:</span>
                      <strong className="text-[#1a1a1a]">STG-8842-CL</strong>
                    </div>
                    <div className="flex justify-between text-[#6b6b6b] py-1.5 border-b border-black/10">
                      <span>Initiated By:</span>
                      <strong className="text-[#1a1a1a]">admin_maker_04</strong>
                    </div>
                    <div className="flex justify-between text-[#6b6b6b] py-1.5 border-b border-black/10">
                      <span>Target Rule:</span>
                      <strong className="text-[#1a1a1a]">{feeName}</strong>
                    </div>
                    <div className="flex justify-between text-[#6b6b6b] py-1.5">
                      <span>Integrity Status:</span>
                      <strong className={stagedStatus === 'approved' ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                        {stagedStatus === 'approved' ? 'COMMITTED_TO_LEDGER' : 'PENDING_CHECKER_SIGNATURE'}
                      </strong>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ledger' && (
                <motion.div
                  key="ledger"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#ff7a00]/10 text-[#c25f00] text-xs font-semibold border border-[#ff7a00]/25">Step 3: Immutability</span>
                    <h4 className="text-2xl font-bold text-[#1a1a1a]">Append-Only Core Accounting</h4>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed">
                      All committed transactions write directly to an append-only ledger cluster. No updates or deletions are permitted, guaranteeing full data audit compliance.
                    </p>
                    <div className="flex items-center space-x-2 text-xs font-medium text-[#6b6b6b]">
                      <FileText className="w-4 h-4 text-[#ff7a00]" />
                      <span>Database Engine: PostgreSQL Append-Only JSONB Tables</span>
                    </div>
                  </div>

                  <div className="backdrop-blur-3xl bg-white/60 border border-black/10 rounded-3xl p-6 shadow-md space-y-2 font-mono text-xs">
                    <div className="text-[#1a1a1a] font-bold mb-2">// Ledger Entry #9042 (Immutable Cluster)</div>
                    <div className="text-[#6b6b6b]">tx_hash: <span className="text-[#b8560f]">0x9b4c1a2e3f4d89fa21bc</span></div>
                    <div className="text-[#6b6b6b]">rule_title: <span className="text-[#1a1a1a]">{feeName}</span></div>
                    <div className="text-[#6b6b6b]">amount: <span className="text-[#1a1a1a]">{amount}</span></div>
                    <div className="text-[#6b6b6b]">state: <span className="text-emerald-600 font-bold">COMMITTED_IMMUTABLE</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ARCHITECTURE PILLARS */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">Core Architecture Pillars</h2>
          <p className="text-[#6b6b6b] text-sm mt-2">Built for high reliability and clean hackathon presentation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURE_CARDS.map((card: FeatureCard) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative backdrop-blur-3xl bg-white/50 border border-black/10 rounded-3xl p-8 shadow-sm hover:border-black/20 hover:bg-white/70 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-2xl flex items-center justify-center text-[#ff7a00] mb-6 border border-black/10 group-hover:bg-[#ff7a00]/10 group-hover:border-[#ff7a00]/30 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{card.title}</h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white/30 backdrop-blur-3xl py-8 text-center text-xs text-[#6b6b6b] relative z-10">
        <p>Cannabis Lab FeeFlow System // Animated Glassmorphic Fintech UI</p>
      </footer>
    </div>
  );
}