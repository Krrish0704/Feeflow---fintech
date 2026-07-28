export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,oklch(0.22_0.02_60)_0%,oklch(0.16_0.012_260)_45%,oklch(0.12_0.01_260)_100%)]" />

      {/* floating mesh orbs */}
      <div
        className="absolute -left-32 top-[-10%] h-[42rem] w-[42rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, oklch(0.72 0.19 48 / 0.28), transparent 60%)',
          animation: 'float-orb 22s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-15%] top-[20%] h-[38rem] w-[38rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, oklch(0.55 0.09 260 / 0.32), transparent 62%)',
          animation: 'float-orb 28s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[25%] h-[40rem] w-[40rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, oklch(0.65 0.15 30 / 0.22), transparent 60%)',
          animation: 'float-orb 34s ease-in-out infinite',
        }}
      />

      {/* fine grain + vignette */}
      <div className="grain absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_60%,oklch(0.1_0.01_260/0.6)_100%)]" />
    </div>
  )
}
