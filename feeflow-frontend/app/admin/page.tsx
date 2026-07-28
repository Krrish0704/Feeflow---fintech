'use client'

import { PageShell } from '@/components/page-shell'
import { AdminWorkspace } from '@/components/admin/admin-workspace'
import { AdminWaiverDesk } from '@/components/admin/admin-waiver-desk' 
import { AdminCharts } from '@/components/admin/admin-charts'
import { Reveal } from '@/components/reveal'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="min-h-screen bg-background opacity-0" />
  }

  return (
    <PageShell
      eyebrow="Administrator console"
      title="Build fee structures. Govern every change."
      description="A JSONB metadata rule engine means new fee types need zero schema migrations. Everything you stage flows through maker-checker before it can touch a ledger."
    >
      {/* JSONB Fee Builder & Management */}
      <AdminWorkspace />

      {/* Waiver Request Desk with ₹500 Threshold Enforcement */}
      <Reveal className="mt-16" delay={0.03}>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Waiver & Concession Desk</h2>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Waivers up to ₹500 auto-execute into the ledger. Requests above ₹500 automatically route to the Principal governance queue.
          </p>
        </div>
      </Reveal>
      <AdminWaiverDesk />

      {/* Live Collection Charts */}
      <Reveal className="mt-16" delay={0.05}>
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Live collection analytics</h2>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            These charts parse raw CSV feeds and animate into view as you scroll — collection
            velocity, default ageing, and fee adoption across the fiscal year.
          </p>
        </div>
      </Reveal>
      <AdminCharts />
    </PageShell>
  )
}