'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { principalMetrics } from '@/lib/data'
import { formatINRCompact } from '@/lib/format'

const EASE = [0.16, 1, 0.3, 1] as const

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return value
}

function MetricCard({
  metric,
  index,
  active,
}: {
  metric: (typeof principalMetrics)[number]
  index: number
  active: boolean
}) {
  const value = useCountUp(metric.value, active)
  const positive = metric.delta.startsWith('+')
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
      className="glass flex flex-col justify-between rounded-[2rem] p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{metric.label}</p>
        <span
          className={
            positive
              ? 'glass-orange inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium text-primary'
              : 'inline-flex items-center gap-0.5 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-muted-foreground'
          }
        >
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {metric.delta}
        </span>
      </div>
      <p className="mt-6 font-display text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
        {formatINRCompact(value)}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{metric.hint}</p>
    </motion.div>
  )
}

export function MetricCards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {principalMetrics.map((m, i) => (
        <MetricCard key={m.label} metric={m} index={i} active={inView} />
      ))}
    </div>
  )
}
