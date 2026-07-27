"use client";
import Link from "next/link";

import { useState } from "react";
import GlassCard from "../../components/ui/GlassCard";

export default function AdminDashboard() {
  const [feeName, setFeeName] = useState("Late Lab Equipment Return");
  const [baseAmount, setBaseAmount] = useState("500");
  const [condition, setCondition] = useState("penalty_percentage");
  const [conditionValue, setConditionValue] = useState("5");

  return (
    <div className="min-h-screen flex p-6 gap-6 pt-24">
      
      <Link href="/" className="text-left text-white/70 hover:text-white transition py-2 block">
    Home Dashboard
  </Link>
  
  <Link href="/admin" className="text-left text-emerald-400 font-medium py-2 border-l-2 border-emerald-400 pl-3 block">
    Fee Rule Engine
  </Link>
  
  <Link href="/principal" className="text-left text-white/70 hover:text-white transition py-2 block">
    Waiver Approvals (Checker)
  </Link>
  
  <button className="text-left text-white/70 hover:text-white transition py-2 w-full">
    Immutable Ledger
  </button>
      <GlassCard className="w-64 p-6 hidden md:block" delay={0.1}>
        <div className="flex flex-col gap-4">
          <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Maker Menu</h2>
          <button className="text-left text-white/70 hover:text-white transition py-2">Dashboard</button>
          <button className="text-left text-emerald-400 font-medium py-2 border-l-2 border-emerald-400 pl-3">Fee Rule Engine</button>
          <button className="text-left text-white/70 hover:text-white transition py-2">Waiver Requests</button>
          <button className="text-left text-white/70 hover:text-white transition py-2">Immutable Ledger</button>
        </div>
      </GlassCard>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        <GlassCard className="p-8 w-full" delay={0.2}>
          <h1 className="text-3xl font-bold text-white mb-2">Configure Dynamic Fee</h1>
          <p className="text-white/50 mb-8">Deploy a new fee rule to the JSONB engine without altering the schema.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* The Input Form */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Fee Identifier (Name)</label>
                <input 
                  type="text" 
                  value={feeName}
                  onChange={(e) => setFeeName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Base Amount (₹)</label>
                <input 
                  type="number" 
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Rule Type</label>
                  <select 
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                  >
                    <option value="penalty_percentage">Penalty (%)</option>
                    <option value="flat_fee">Flat Fee Addition</option>
                    <option value="discount">Discount Waiver</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Trigger Value</label>
                  <input 
                    type="number" 
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                  />
                </div>
              </div>

              <button className="mt-4 w-full py-4 rounded-xl bg-emerald-500/80 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all font-medium">
                Stage Rule for Checker Approval
              </button>
            </div>

            {/* Live JSON Preview */}
            <div className="flex flex-col">
              <label className="block text-white/70 text-sm mb-2">Live Payload Preview (FastAPI)</label>
              <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-6 font-mono text-sm text-emerald-300 overflow-x-auto shadow-inner relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/50"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/50"></span>
                </div>
                <pre className="mt-6">
{`{
  "event_type": "fee_created",
  "payload": {
    "fee_name": "${feeName}",
    "base_amount": ${baseAmount || 0},
    "dynamic_rules": {
      "type": "${condition}",
      "value": ${conditionValue || 0},
      "active": false,
      "staged_by": "admin_maker"
    }
  }
}`}
                </pre>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>
    </div>
  );
}