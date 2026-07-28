'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react'
import { GlassCard } from '@/components/glass'
import { studentFees, type FeeItem } from '@/lib/data'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

const WALLET_BALANCE = 25000
const EASE = [0.16, 1, 0.3, 1] as const

const METHODS = [
  { id: 'upi', label: 'UPI', hint: 'GPay · PhonePe · Paytm', icon: Smartphone },
  { id: 'card', label: 'Card', hint: 'Credit / Debit', icon: CreditCard },
  { id: 'netbanking', label: 'Net banking', hint: 'All major banks', icon: Building2 },
  { id: 'wallet', label: 'FeeFlow wallet', hint: formatINR(WALLET_BALANCE), icon: Wallet },
]

const STATUS_STYLES: Record<FeeItem['status'], string> = {
  due: 'glass-orange text-primary',
  paid: 'bg-white/10 text-muted-foreground',
  partial: 'bg-white/10 text-muted-foreground',
}

export function StudentPortal() {
  const dueItems = useMemo(() => studentFees.filter((f) => f.status === 'due'), [])
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(dueItems.map((f) => [f.id, true])),
  )
  const [method, setMethod] = useState('upi')
  const [state, setState] = useState<'idle' | 'processing' | 'done'>('idle')

  const selectedItems = dueItems.filter((f) => selected[f.id])
  const subtotal = selectedItems.reduce((sum, f) => sum + f.amount, 0)
  const convenience = Math.round(subtotal * 0.006)
  const total = subtotal + convenience
  const walletCovers = method === 'wallet' ? Math.min(WALLET_BALANCE, total) : 0

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  async function pay() {
    if (total <= 0) return
    setState('processing')
    await new Promise((r) => setTimeout(r, 1800))
    setState('done')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Fee breakdown */}
      <GlassCard>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">Your fee assignment</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ananya Sharma · Class VIII-B · 2026–27</p>
          </div>
          <span className="glass-orange rounded-full px-3 py-1.5 text-xs font-semibold text-primary">
            {dueItems.length} due
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {studentFees.map((f) => {
            const isPaid = f.status === 'paid'
            const checked = !!selected[f.id]
            return (
              <button
                key={f.id}
                type="button"
                disabled={isPaid}
                onClick={() => toggle(f.id)}
                className={cn(
                  'glass flex items-center gap-4 rounded-2xl p-4 text-left transition-colors',
                  isPaid ? 'opacity-55' : 'hover:bg-white/[0.07]',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                    isPaid
                      ? 'border-white/20 bg-white/10'
                      : checked
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-white/25',
                  )}
                >
                  {(checked || isPaid) && <BadgeCheck className="size-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{f.head}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {f.category} · due {f.due}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium tabular-nums">{formatINR(f.amount)}</p>
                  <span
                    className={cn(
                      'mt-1 inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-medium capitalize',
                      STATUS_STYLES[f.status],
                    )}
                  >
                    {f.status}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Checkout */}
      <div className="flex flex-col gap-6">
        {/* Wallet card */}
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-6">
          <div
            className="absolute -right-10 -top-10 size-40 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, oklch(0.72 0.19 48 / 0.35), transparent 70%)' }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="size-4 text-primary" /> FeeFlow wallet
            </div>
            <Lock className="size-4 text-muted-foreground" />
          </div>
          <p className="relative mt-4 font-display text-3xl font-semibold tabular-nums">
            {formatINR(WALLET_BALANCE)}
          </p>
          <p className="relative mt-1 text-xs text-muted-foreground">Available balance · auto-debit ready</p>
        </div>

        {/* Payment method + summary */}
        <GlassCard>
          <h3 className="font-display text-lg font-semibold tracking-tight">Pay securely</h3>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {METHODS.map((m) => {
              const active = method === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    'flex flex-col gap-1 rounded-2xl border p-3 text-left transition-all',
                    active
                      ? 'glass-orange border-primary/40'
                      : 'glass border-white/10 hover:bg-white/[0.07]',
                  )}
                >
                  <m.icon className={cn('size-4', active ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="mt-1 text-sm font-medium">{m.label}</span>
                  <span className="text-[0.7rem] text-muted-foreground">{m.hint}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-5 text-sm">
            <Row label={`Subtotal (${selectedItems.length} items)`} value={formatINR(subtotal)} />
            <Row label="Convenience fee (0.6%)" value={formatINR(convenience)} muted />
            {walletCovers > 0 && (
              <Row label="Wallet applied" value={`− ${formatINR(walletCovers)}`} muted />
            )}
            <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-medium">Total payable</span>
              <span className="font-display text-xl font-semibold tabular-nums">
                {formatINR(Math.max(0, total - walletCovers))}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={pay}
            disabled={state === 'processing' || total <= 0}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'processing' ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Processing payment…
              </>
            ) : (
              <>
                <Lock className="size-4" /> Pay {formatINR(Math.max(0, total - walletCovers))} securely
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" /> 256-bit encrypted · PCI-DSS compliant · instant receipt
          </p>
        </GlassCard>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {state === 'done' && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setState('idle')}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="glass-strong relative z-10 w-full max-w-md rounded-[2.5rem] p-8 text-center"
            >
              <button
                type="button"
                onClick={() => setState('idle')}
                aria-label="Close"
                className="glass absolute right-5 top-5 flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
                className="glass-orange mx-auto flex size-20 items-center justify-center rounded-full text-primary"
              >
                <CheckCircle2 className="size-11" />
              </motion.span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                Payment successful
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {formatINR(Math.max(0, total - walletCovers))} paid via{' '}
                {METHODS.find((m) => m.id === method)?.label}. Your receipt has been emailed and the
                ledger updated instantly.
              </p>
              <div className="glass mt-6 flex items-center justify-between rounded-2xl p-4 text-left">
                <div>
                  <p className="text-xs text-muted-foreground">Ledger block</p>
                  <p className="font-mono text-sm text-primary">0xblk_4183…a91f</p>
                </div>
                <span className="glass-orange rounded-full px-3 py-1.5 text-xs font-medium text-primary">
                  Reconciled
                </span>
              </div>
              <button
                type="button"
                onClick={() => setState('idle')}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? 'text-muted-foreground' : 'text-foreground'}>{label}</span>
      <span className={cn('tabular-nums', muted ? 'text-muted-foreground' : 'text-foreground')}>
        {value}
      </span>
    </div>
  )
}
