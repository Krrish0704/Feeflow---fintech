"use client";
import { useState, useEffect } from "react";
import GlassCard from "../../components/ui/GlassCard";

// Define what the data looks like coming from FastAPI
interface PendingRule {
  id: string;
  fee_name: string;
  base_amount: number;
  type: string;
  value: number;
  created_at: string;
}

export default function PrincipalDashboard() {
  const [status, setStatus] = useState<"pending" | "approved">("pending");
  const [pendingRequests, setPendingRequests] = useState<PendingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data from FastAPI when the page loads
  useEffect(() => {
    const fetchPendingRules = async () => {
      try {
        // Replace this URL with your actual GET endpoint!
        const response = await fetch("http://localhost:8000/api/v1/fees/pending");
        if (response.ok) {
          const data = await response.json();
          setPendingRequests(data); // Assuming backend returns an array of rules
        }
      } catch (error) {
        console.error("Failed to fetch pending rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRules();
  }, []);

  // 2. Function to authorize the rule (PUT/POST request)
  const handleAuthorize = async (id: string) => {
    try {
      // Replace with your actual authorize endpoint!
      const response = await fetch(`http://localhost:8000/api/v1/fees/${id}/authorize`, {
        method: "POST",
      });
      
      if (response.ok) {
        setStatus("approved");
      } else {
        alert("Authorization failed on the backend.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Network Error while authorizing.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 pt-24 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Governor Command Center</h1>
        <p className="text-white/50">Secure Authorization & Maker-Checker Inbox</p>
      </div>

      <div className="flex gap-6 h-[70vh]">
        {/* Left Sidebar: The Dynamic Queue */}
        <GlassCard className="w-1/3 p-4 overflow-y-auto" delay={0.1}>
          <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 px-2">
            Pending Authorizations ({pendingRequests.length})
          </h2>
          
          {isLoading ? (
            <p className="text-white/50 text-sm px-2 animate-pulse">Loading from Postgres...</p>
          ) : pendingRequests.length === 0 ? (
            <p className="text-white/50 text-sm px-2">No pending requests.</p>
          ) : (
            pendingRequests.map((req, index) => (
              <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 mb-3 cursor-pointer hover:bg-white/15 transition relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-400 text-xs font-bold tracking-wider">[PENDING]</span>
                </div>
                <h3 className="text-white font-medium">{req.fee_name}</h3>
                <p className="text-white/60 text-sm mt-1">Base: ₹{req.base_amount}</p>
              </div>
            ))
          )}
        </GlassCard>

        {/* Right Main Panel: Action View */}
        <GlassCard className="flex-1 p-8 flex flex-col relative overflow-hidden" delay={0.2}>
          {status === "approved" && (
             <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm z-10 flex flex-col items-center justify-center border-2 border-emerald-500/50 rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-emerald-400 tracking-wide">AUTHORIZED</h2>
                <p className="text-emerald-400/70 mt-2 font-mono">Ledger securely appended via FastAPI.</p>
             </div>
          )}

          <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Select a request from the queue</h2>
              <p className="text-white/50 mt-1">Review the JSONB payload before cryptographically signing.</p>
            </div>
          </div>

          <div className="mt-auto flex gap-4">
            <button className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all font-medium">
              Reject
            </button>
            <button 
              onClick={() => handleAuthorize("placeholder-id")}
              className="flex-1 py-4 rounded-xl bg-emerald-500/80 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all font-bold tracking-wide flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Cryptographically Authorize
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}