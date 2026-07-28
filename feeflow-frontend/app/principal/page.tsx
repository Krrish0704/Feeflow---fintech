import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { MetricCards } from '@/components/principal/metric-cards'
import { LedgerTable } from '@/components/principal/ledger-table'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Principal Dashboard · FeeFlow',
  description:
    'Real-time aggregated financial summaries in Lakhs and Crores, backed by an append-only tamper-proof audit ledger.',
}

export default function PrincipalPage() {
  return (
    <PageShell
      eyebrow="Principal dashboard"
      title="The institution's finances, at a glance."
      description="Aggregated collections, dues, and waivers for the fiscal year — every figure reconciled to the bank and traceable to an immutable ledger entry."
    >
      <MetricCards />

      <Reveal className="mt-12" delay={0.05}>
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Audit history</h2>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            The append-only ledger records every collection, waiver, and refund. Each block links
            cryptographically to the one before it, so the history can be verified but never
            rewritten.
          </p>
        </div>
      </Reveal>
      <LedgerTable />
    </PageShell>
  )
}
