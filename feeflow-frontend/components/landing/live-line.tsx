'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BASE = [18, 32, 26, 40, 34, 52, 46, 64, 58, 72]

/** A lightweight animated telemetry sparkline that mutates over time. */
export function LiveLine() {
  const [points, setPoints] = useState(BASE)

  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        const next = prev.slice(1)
        const last = prev[prev.length - 1]
        const drift = last + (Math.random() * 20 - 8)
        next.push(Math.max(12, Math.min(80, drift)))
        return next
      })
    }, 1400)
    return () => clearInterval(id)
  }, [])

  const w = 320
  const h = 120
  const max = 84
  const step = w / (points.length - 1)
  const coords = points.map((p, i) => [i * step, h - (p / max) * h])
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`

  return (
    <div className="glass overflow-hidden rounded-2xl p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="live-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 48)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 48)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#live-fill)"
          initial={false}
          animate={{ d: areaPath }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="oklch(0.72 0.19 48)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ d: linePath }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <circle
          cx={coords[coords.length - 1][0]}
          cy={coords[coords.length - 1][1]}
          r="4"
          fill="oklch(0.72 0.19 48)"
        />
      </svg>
      <div className="mt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground">
        <span>UPI · NEFT · Cards</span>
        <span className="text-primary">● streaming</span>
      </div>
    </div>
  )
}
