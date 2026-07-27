import GlassCard from "../components/ui/GlassCard";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-20">
      
      {/* Main Dashboard Container */}
      <GlassCard className="w-full max-w-5xl p-10 text-center" delay={0.1}>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-4">
          FeeFlow Command Center
        </h1>
        <p className="text-lg text-white/60 mb-12">
          Bank-grade infrastructure for offline processing & dynamic fee routing.
        </p>
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <GlassCard className="p-6 bg-white/5 border-white/10" delay={0.3}>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Real-time Revenue</h3>
            <p className="text-4xl font-light text-emerald-400">₹24,50,000</p>
          </GlassCard>
          
          <GlassCard className="p-6 bg-white/5 border-white/10" delay={0.4}>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Pending Waivers</h3>
            <p className="text-4xl font-light text-amber-400">12</p>
            <p className="text-xs text-amber-400/50 mt-2">Requires Principal Auth</p>
          </GlassCard>
          
          <GlassCard className="p-6 bg-white/5 border-white/10" delay={0.5}>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Offline Sync Queue</h3>
            <p className="text-4xl font-light text-indigo-400">0</p>
            <p className="text-xs text-indigo-400/50 mt-2">Ledger fully reconciled</p>
          </GlassCard>

        </div>
      </GlassCard>
      
    </div>
  );
}