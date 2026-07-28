'use client'

import { motion } from 'framer-motion'
import { Link2, ShieldCheck } from 'lucide-react'
import { GlassCard } from '@/components/glass'
import { ledgerEntries } from '@/lib/data'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const TYPE_STYLES: Record<string, string> = {
  FEE_COLLECTION: 'glass-orange text-primary',
  WAIVER_APPLIED: 'bg-white/10 text-muted-foreground',
  REFUND_ISSUED: 'bg-white/10 text-muted-foreground',
}

export function LedgerTable() {
  return (
    <GlassCard className="overflow-hidden">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">
            Append-only ledger
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Every entry chains to the previous hash · immutable & reconciled
          </p>
        </div>
        <span className="glass-orange inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-primary">
          <ShieldCheck className="size-3.5" /> Tamper-proof
        </span>
      </div>

      {/* header row (desktop) */}
      <div className="hidden grid-cols-[1.1fr_1.4fr_0.9fr_1.3fr] gap-4 border-b border-white/10 px-4 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
        <span>Block · time</span>
        <span>Student / event</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Hash chain</span>
      </div>

      <div className="flex flex-col">
        {ledgerEntries.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
            className="grid grid-cols-2 items-center gap-x-4 gap-y-2 border-b border-white/[0.06] px-4 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[1.1fr_1.4fr_0.9fr_1.3fr]"
          >
            <div>
              <p className="font-mono text-sm text-foreground">{e.id}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{e.ts}</p>
            </div>
            <div className="text-right md:text-left">
              <span
                className={cn(
                  'inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium',
                  TYPE_STYLES[e.type] ?? 'bg-white/10 text-muted-foreground',
                )}
              >
                {e.type.replace('_', ' ').toLowerCase()}
              </span>
              <p className="mt-1 text-sm text-muted-foreground">{e.student}</p>
            </div>
            <div className="md:text-right">
              <p
                className={cn(
                  'font-medium tabular-nums',
                  e.amount < 0 ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {e.amount < 0 ? '−' : '+'}
                {formatINR(Math.abs(e.amount))}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1 md:text-right">
              <p className="flex items-center gap-1.5 font-mono text-xs text-primary/90 md:justify-end">
                <Link2 className="size-3.5 shrink-0" />
                {e.hash}
              </p>
              <p className="mt-0.5 font-mono text-[0.7rem] text-muted-foreground md:text-right">
                prev {e.prev}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Showing latest 6 of 4,182 blocks · full chain verified to genesis
      </p>
    </GlassCard>
  )
}
