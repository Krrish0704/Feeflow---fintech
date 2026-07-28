'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ShieldCheck, LineChart, GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const ROLES = [
  {
    href: '/admin',
    icon: ShieldCheck,
    role: 'Administrator',
    title: 'Design & govern fee structures',
    points: ['JSONB rule builder', 'Maker-checker queue', 'Live collection analytics'],
  },
  {
    href: '/principal',
    icon: LineChart,
    role: 'Principal',
    title: 'Oversee the institution in real time',
    points: ['Aggregated ₹ summaries', 'Tamper-proof audit log', 'Lakhs & Crores at a glance'],
  },
  {
    href: '/student',
    icon: GraduationCap,
    role: 'Student & Parent',
    title: 'Understand and pay dues securely',
    points: ['Itemized fee breakdown', 'Wallet & payment methods', 'Instant secure checkout'],
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function RolePicker() {
  return (
    <section className="relative mx-auto mt-32 max-w-6xl px-4">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
          Three portals, one platform
        </p>
        <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Choose where you work
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
          >
            <Link href={r.href} className="group block h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="glass flex h-full flex-col rounded-[2.5rem] p-8 transition-colors group-hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <span className="glass-orange flex size-12 items-center justify-center rounded-2xl text-primary">
                    <r.icon className="size-6" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {r.role}
                </p>
                <h3 className="mt-2 text-balance font-display text-xl font-semibold leading-snug tracking-tight">
                  {r.title}
                </h3>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  Enter portal
                  <ArrowUpRight className="size-4 text-primary" />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
