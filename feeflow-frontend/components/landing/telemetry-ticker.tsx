'use client'

import { TrendingUp } from 'lucide-react'
import { liveTelemetry } from '@/lib/data'

export function TelemetryTicker() {
  const items = [...liveTelemetry, ...liveTelemetry]
  return (
    <section className="relative mt-24 w-full">
      <div className="mx-auto mb-5 flex max-w-6xl items-center justify-between px-4">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Real-time architecture telemetry
        </p>
        <span className="hidden text-xs text-muted-foreground sm:inline">hover to pause</span>
      </div>

      <div className="ticker-track group relative overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-ticker flex w-max gap-4 px-4">
          {items.map((t, i) => (
            <div
              key={`${t.label}-${i}`}
              className="glass flex min-w-[15rem] items-center justify-between gap-6 rounded-3xl px-6 py-4"
            >
              <div>
                <p className="text-xs text-muted-foreground">{t.label}</p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums">{t.value}</p>
              </div>
              <span className="glass-orange inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-primary">
                <TrendingUp className="size-3" />
                {t.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
