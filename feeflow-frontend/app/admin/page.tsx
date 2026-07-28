  import type { Metadata } from 'next'
  import { PageShell } from '@/components/page-shell'
  import { AdminWorkspace } from '@/components/admin/admin-workspace'
  import { AdminCharts } from '@/components/admin/admin-charts'
  import { Reveal } from '@/components/reveal'

  export const metadata: Metadata = {
    title: 'Admin Console · FeeFlow',
    description:
      'Design JSONB-driven fee structures, govern them through maker-checker, and watch collection analytics render live from CSV feeds.',
  }

  export default function AdminPage() {
    return (
      <PageShell
        eyebrow="Administrator console"
        title="Build fee structures. Govern every change."
        description="A JSONB metadata rule engine means new fee types need zero schema migrations. Everything you stage flows through maker-checker before it can touch a ledger."
      >
        <AdminWorkspace />

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
