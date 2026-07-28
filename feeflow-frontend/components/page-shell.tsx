import type { ReactNode } from 'react'
import { AmbientBackground } from '@/components/ambient-background'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { GlassBadge } from '@/components/glass'
import { Reveal } from '@/components/reveal'

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <AmbientBackground />
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 pt-36 sm:pt-40">
        <Reveal>
          <GlassBadge>{eyebrow}</GlassBadge>
          <h1 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Reveal>
        <div className="mt-14">{children}</div>
      </div>
      <AppFooter />
    </main>
  )
}
