'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Activity, IndianRupee } from 'lucide-react'
import { GlassBadge } from '@/components/glass'
import { LiveLine } from '@/components/landing/live-line'
import { formatINRCompact } from '@/lib/format'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-40 text-center sm:pt-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <GlassBadge>
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Live ledger · reconciled to ₹0.00
        </GlassBadge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
        className="mt-8 max-w-4xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
      >
        Fee operations,
        <span className="text-primary text-glow-orange"> engineered </span>
        for the institution.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.16 }}
        className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        FeeFlow unifies a JSONB rule engine, maker-checker governance, and an append-only
        tamper-proof ledger — collecting Lakhs to Crores across every classroom, campus, and mandate
        in real time.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.24 }}
        className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Link
          href="/admin"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
        >
          Launch admin console
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/principal"
          className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.08]"
        >
          View principal dashboard
        </Link>
      </motion.div>

      {/* Live telemetry hero card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        className="glass-strong relative mt-16 w-full max-w-4xl overflow-hidden rounded-[2.5rem] p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-left">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Activity className="size-3.5 text-primary" /> Collection velocity · live
            </p>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
              {formatINRCompact(64200000)}
              <span className="ml-2 align-middle text-sm font-medium text-primary">
                this month
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <HeroChip icon={<ShieldCheck className="size-3.5" />} label="Maker-checker on" />
              <HeroChip icon={<IndianRupee className="size-3.5" />} label="Zero migrations" />
            </div>
          </div>
          <div className="w-full max-w-sm">
            <LiveLine />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function HeroChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
  )
}
