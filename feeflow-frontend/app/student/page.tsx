"use client";
import { useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import Link from "next/link";

export default function StudentPortal() {
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");

  const handlePayment = () => {
    setPaymentState("processing");
    // Simulate network delay for the demo
    setTimeout(() => {
      setPaymentState("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-20 max-w-4xl mx-auto">
      
      {/* Navigation header for easy demoing */}
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Student Portal</h1>
        <Link href="/" className="text-white/50 hover:text-white text-sm underline underline-offset-4">
          Back to Main Dashboard
        </Link>
      </div>

      <GlassCard className="w-full p-8" delay={0.1}>
        
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
            <span className="text-2xl font-bold text-indigo-400">RS</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Rahul Sharma</h2>
            <p className="text-white/50 text-sm font-mono">ID: 24BCE10023</p>
          </div>
        </div>

        {/* Dues Breakdown */}
        <div className="mb-8">
          <h3 className="text-white/70 text-sm font-bold uppercase tracking-wider mb-4">Pending Dues</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
              <span className="text-white">Semester Tuition (Fall)</span>
              <span className="text-white font-mono">₹45,000</span>
            </div>
            
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
              <span className="text-white">Hostel & Mess</span>
              <span className="text-white font-mono">₹7,000</span>
            </div>

            {/* The Dynamic Fee Example */}
            <div className="flex justify-between items-center bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-2">
                <span className="text-red-400">Late Lab Equipment Return</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase">Penalty</span>
              </div>
              <span className="text-red-400 font-mono">₹500</span>
            </div>
          </div>
        </div>

        {/* Total & Action */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div>
            <p className="text-white/50 text-sm mb-1">Total Amount Payable</p>
            <p className="text-4xl font-bold text-white">₹52,500</p>
          </div>

          {paymentState === "idle" && (
            <button 
              onClick={handlePayment}
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-indigo-500/80 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all font-bold tracking-wide flex items-center justify-center gap-2"
            >
              Pay via UPI
            </button>
          )}

          {paymentState === "processing" && (
            <div className="w-full md:w-auto px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing Request...
            </div>
          )}

          {paymentState === "success" && (
            <div className="w-full md:w-auto px-8 py-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Payment Successful
            </div>
          )}
        </div>

      </GlassCard>
    </div>
  );
}