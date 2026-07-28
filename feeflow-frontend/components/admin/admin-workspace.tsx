'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  Loader2,
  Plus,
  ShieldQuestion,
  Trash2,
  X,
} from 'lucide-react'
import { GlassCard } from '@/components/glass'
import { initialCheckerQueue, type CheckerItem } from '@/lib/data'
import { formatINR, formatINRCompact } from '@/lib/format'
import { cn } from '@/lib/utils'

type Toast = { id: number; title: string; detail: string }
type Rule = { key: string; value: string }

const FEE_CATEGORIES = ['Tuition', 'Transport', 'Hostel', 'Activity', 'Examination', 'Custom']
const FREQUENCIES = ['One-time', 'Monthly', 'Termly', 'Annual']

function randomHash(prefix: string) {
  const hex = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0'),
  ).join('')
  return `${prefix}${hex.slice(0, 4)}…${hex.slice(-4)}`
}

export function AdminWorkspace() {
  const [queue, setQueue] = useState<CheckerItem[]>(initialCheckerQueue)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [processing, setProcessing] = useState<string | null>(null)

  // form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState(FEE_CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState(FREQUENCIES[2])
  const [rules, setRules] = useState<Rule[]>([{ key: 'grade_min', value: '6' }])
  const [submitting, setSubmitting] = useState(false)

  function pushToast(title: string, detail: string) {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, title, detail }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !amount) return
    setSubmitting(true)
    // simulate POST /fees/structures with JSONB metadata
    await new Promise((r) => setTimeout(r, 1300))

    const metadata = Object.fromEntries(rules.filter((r) => r.key).map((r) => [r.key, r.value]))
    const newItem: CheckerItem = {
      id: `RULE-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${name} — ${category}`,
      detail: `${formatINR(Number(amount))} · ${frequency} · ${JSON.stringify(metadata)}`,
      maker: 'You (Accounts)',
      impact: Number(amount) * 220,
      stagedHash: randomHash('0xstg_'),
    }
    setQueue((q) => [newItem, ...q])
    setSubmitting(false)
    pushToast('Fee structure staged', `${newItem.id} sent to maker-checker · ${newItem.stagedHash}`)
    setName('')
    setAmount('')
    setRules([{ key: 'grade_min', value: '6' }])
  }

  async function resolve(id: string, approved: boolean) {
    setProcessing(id)
    await new Promise((r) => setTimeout(r, 1100))
    const item = queue.find((q) => q.id === id)
    setQueue((q) => q.filter((x) => x.id !== id))
    setProcessing(null)
    pushToast(
      approved ? 'Rule approved & committed' : 'Rule rejected',
      approved
        ? `${item?.id} written to ledger · ${randomHash('0xblk_')}`
        : `${item?.id} returned to maker`,
    )
  }

  function updateRule(i: number, patch: Partial<Rule>) {
    setRules((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  const metadataPreview = JSON.stringify(
    {
      name: name || 'Untitled fee',
      category,
      amount: Number(amount) || 0,
      frequency,
      metadata: Object.fromEntries(rules.filter((r) => r.key).map((r) => [r.key, r.value])),
    },
    null,
    2,
  )

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Fee structure form */}
      <GlassCard>
        <div className="mb-6">
          <h3 className="font-display text-lg font-semibold tracking-tight">Create fee structure</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            POST <code className="text-primary">/fees/structures</code> · JSONB rule engine, zero
            migrations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Fee name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Term II Tuition"
              className="glass-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input">
                {FEE_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-popover text-popover-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Frequency">
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="glass-input">
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f} className="bg-popover text-popover-foreground">
                    {f}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Amount (₹)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              inputMode="numeric"
              placeholder="42000"
              className="glass-input"
            />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                JSONB metadata rules
              </label>
              <button
                type="button"
                onClick={() => setRules((rs) => [...rs, { key: '', value: '' }])}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80"
              >
                <Plus className="size-3.5" /> Add rule
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={rule.key}
                    onChange={(e) => updateRule(i, { key: e.target.value })}
                    placeholder="key"
                    className="glass-input flex-1"
                  />
                  <input
                    value={rule.value}
                    onChange={(e) => updateRule(i, { value: e.target.value })}
                    placeholder="value"
                    className="glass-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setRules((rs) => rs.filter((_, idx) => idx !== i))}
                    className="glass flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive"
                    aria-label="Remove rule"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Payload preview
            </p>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-primary/90">
              {metadataPreview}
            </pre>
          </div>

          <button
            type="submit"
            disabled={submitting || !name || !amount}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Staging structure…
              </>
            ) : (
              <>
                <Plus className="size-4" /> Stage for maker-checker
              </>
            )}
          </button>
        </form>
      </GlassCard>

      {/* Maker-checker queue */}
      <GlassCard>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">Maker-checker queue</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pending rules & waivers awaiting a second approval</p>
          </div>
          <span className="glass-orange rounded-full px-3 py-1.5 text-xs font-semibold text-primary">
            {queue.length} pending
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {queue.map((item) => {
              const busy = processing === item.id
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-3xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary">{item.id}</span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            item.impact < 0
                              ? 'bg-white/10 text-muted-foreground'
                              : 'glass-orange text-primary',
                          )}
                        >
                          {item.impact < 0 ? '−' : '+'}
                          {formatINRCompact(Math.abs(item.impact))}
                        </span>
                      </div>
                      <p className="mt-2 truncate font-medium">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Maker · {item.maker}</span>
                    <span className="font-mono text-primary/80">{item.stagedHash}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => resolve(item.id, true)}
                      disabled={busy}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                      {busy ? 'Committing…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => resolve(item.id, false)}
                      disabled={busy}
                      className="glass inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:text-destructive disabled:opacity-60"
                    >
                      <X className="size-4" /> Reject
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {queue.length === 0 && (
            <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
              <span className="glass-orange flex size-14 items-center justify-center rounded-2xl text-primary">
                <ShieldQuestion className="size-7" />
              </span>
              <h4 className="font-display font-semibold">Queue is clear</h4>
              <p className="max-w-xs text-sm text-muted-foreground">
                Every staged rule has been reviewed. New submissions will appear here for approval.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Toast stack */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong pointer-events-auto flex items-start gap-3 rounded-2xl p-4"
            >
              <span className="glass-orange mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl text-primary">
                <CheckCircle2 className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-medium">{t.title}</p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{t.detail}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
