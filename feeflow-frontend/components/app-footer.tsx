import Link from 'next/link'
import { Waves } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="relative z-10 mx-auto mt-24 w-full max-w-6xl px-4 pb-12">
      <div className="glass flex flex-col items-start justify-between gap-8 rounded-[2.5rem] p-8 sm:p-10 md:flex-row md:items-center">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="glass-orange flex size-9 items-center justify-center rounded-xl text-primary">
              <Waves className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Fee<span className="text-primary">Flow</span>
            </span>
          </div>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
            Institutional fee intelligence engineered for Indian schools — governed, reconciled,
            and audit-ready down to the last rupee.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
          {[
            { href: '/', label: 'Platform' },
            { href: '/admin', label: 'Admin' },
            { href: '/principal', label: 'Principal' },
            { href: '/student', label: 'Student' },
            { href: '/', label: 'Security' },
            { href: '/', label: 'Compliance' },
          ].map((l, i) => (
            <Link
              key={`${l.label}-${i}`}
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © 2026 FeeFlow Technologies · Built for the Indian institutional context · All figures in ₹
      </p>
    </footer>
  )
}
