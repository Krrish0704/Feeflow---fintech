'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GlassCard, GlassSkeleton } from '@/components/glass'
import { InViewMount } from '@/components/in-view'
import {
  collectionVelocityCSV,
  defaultDistributionCSV,
  feeAdoptionCSV,
  parseCSV,
} from '@/lib/data'
import { formatINRCompact } from '@/lib/format'

const velocity = parseCSV(collectionVelocityCSV)
const distribution = parseCSV(defaultDistributionCSV)
const adoption = parseCSV(feeAdoptionCSV)

const ORANGE = 'oklch(0.72 0.19 48)'
const ORANGE_SOFT = 'oklch(0.78 0.14 65)'
const SLATE = 'oklch(0.6 0.08 260)'

function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-2xl px-4 py-3 text-sm">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.dataKey}</span>
          <span className="ml-auto font-medium tabular-nums text-foreground">
            {typeof p.value === 'number' && p.value > 10000
              ? formatINRCompact(p.value)
              : p.value.toLocaleString('en-IN')}
          </span>
        </p>
      ))}
    </div>
  )
}

const axisProps = {
  stroke: 'oklch(0.68 0.012 260)',
  fontSize: 12,
  tickLine: false,
  axisLine: false,
}

export function AdminCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Collection velocity — area */}
      <GlassCard className="lg:col-span-2">
        <ChartHeader
          title="Collection velocity"
          subtitle="Collected vs projected · parsed live from collection_velocity.csv"
        />
        <InViewMount fallback={<GlassSkeleton className="h-72 w-full" />}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocity} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ORANGE} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={ORANGE} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SLATE} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={SLATE} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(Number(v))} width={60} />
                <Tooltip content={<GlassTooltip />} cursor={{ stroke: 'oklch(1 0 0 / 0.1)' }} />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke={SLATE}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#areaProjected)"
                  animationDuration={1400}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke={ORANGE}
                  strokeWidth={3}
                  fill="url(#areaCollected)"
                  animationDuration={1600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </InViewMount>
      </GlassCard>

      {/* Default distribution — bar */}
      <GlassCard>
        <ChartHeader
          title="Default distribution"
          subtitle="Outstanding dues by ageing bucket"
        />
        <InViewMount fallback={<GlassSkeleton className="h-64 w-full" />}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="bucket" {...axisProps} interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(Number(v))} width={54} />
                <Tooltip content={<GlassTooltip />} cursor={{ fill: 'oklch(1 0 0 / 0.04)' }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} animationDuration={1400}>
                  {distribution.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i >= distribution.length - 2 ? 'oklch(0.65 0.15 30)' : ORANGE}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </InViewMount>
      </GlassCard>

      {/* Fee adoption — stacked bar */}
      <GlassCard>
        <ChartHeader
          title="Fee adoption curve"
          subtitle="Active mandates per fee head, by quarter"
        />
        <InViewMount fallback={<GlassSkeleton className="h-64 w-full" />}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoption} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="quarter" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip content={<GlassTooltip />} cursor={{ fill: 'oklch(1 0 0 / 0.04)' }} />
                <Bar dataKey="tuition" stackId="a" fill={ORANGE} radius={[0, 0, 0, 0]} animationDuration={1200} />
                <Bar dataKey="transport" stackId="a" fill={ORANGE_SOFT} animationDuration={1200} />
                <Bar dataKey="hostel" stackId="a" fill={SLATE} animationDuration={1200} />
                <Bar dataKey="activity" stackId="a" fill="oklch(0.7 0.1 200)" radius={[8, 8, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </InViewMount>
      </GlassCard>
    </div>
  )
}

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
