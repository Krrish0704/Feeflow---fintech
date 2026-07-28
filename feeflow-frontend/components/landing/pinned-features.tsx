'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Layers, GitBranch, Lock, Boxes } from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    kicker: '01 — Rule engine',
    title: 'JSONB metadata, zero migrations',
    body: 'Model any fee head, slab, concession, or route as flexible JSONB rules. Launch a new charge type in minutes — no schema changes, no downtime, no engineering ticket.',
  },
  {
    icon: GitBranch,
    kicker: '02 — Governance',
    title: 'Maker-checker on every change',
    body: 'Every rule and waiver is staged, hashed, and held for a second pair of eyes. Nothing touches a student ledger without cryptographic approval.',
  },
  {
    icon: Lock,
    kicker: '03 — Ledger',
    title: 'Append-only & tamper-proof',
    body: 'Each transaction chains to the previous hash. The full audit trail is immutable and reconciles to the last rupee, ready for any board or regulator.',
  },
  {
    icon: Boxes,
    kicker: '04 — Scale',
    title: 'Built for Lakhs and Crores',
    body: 'From a single school to a multi-campus trust, FeeFlow settles at institutional volume with sub-second latency and 99.98% reconciliation.',
  },
]

export function PinnedFeatures() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.feature-panel')

      // Pin the whole section while stepping through panels
      const track = document.querySelector('.feature-track') as HTMLElement | null
      if (!track) return

      panels.forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { opacity: 0.25, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 78%',
              end: 'top 40%',
              scrub: true,
            },
          },
        )
        // progress bar reveal
        gsap.fromTo(
          panel.querySelector('.feature-bar'),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top 80%', end: 'top 45%', scrub: true },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative mx-auto mt-32 max-w-6xl px-4">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Sticky heading */}
        <div className="feature-sticky flex h-fit flex-col justify-center lg:sticky lg:top-32">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
            The architecture
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Four systems, one source of truth.
          </h2>
          <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Scroll to walk through the pipeline that turns messy institutional fee policy into a
            governed, reconciled financial system.
          </p>
        </div>

        {/* Scrubbed panels */}
        <div className="feature-track flex flex-col gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.kicker}
              className="feature-panel glass rounded-[2.5rem] p-8"
            >
              <div className="flex items-center gap-4">
                <span className="glass-orange flex size-12 items-center justify-center rounded-2xl text-primary">
                  <f.icon className="size-6" />
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {f.kicker}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{f.body}</p>
              <div className="mt-6 h-px w-full overflow-hidden rounded-full bg-white/10">
                <div className="feature-bar h-full origin-left rounded-full bg-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
