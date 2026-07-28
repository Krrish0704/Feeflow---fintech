import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function GlassCard({
  children,
  className,
  strong = false,
}: {
  children: ReactNode
  className?: string
  strong?: boolean
}) {
  return (
    <div
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-[2.5rem] p-6 sm:p-8',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function GlassBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'glass-orange inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-primary',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function GlassSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'glass animate-pulse rounded-2xl bg-white/[0.06]',
        className,
      )}
    />
  )
}

export function GlassEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-[2rem] px-8 py-12 text-center">
      {icon ? (
        <div className="glass-orange flex size-14 items-center justify-center rounded-2xl text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action}
    </div>
  )
}
