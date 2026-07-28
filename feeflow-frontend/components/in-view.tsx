'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Renders children only once they scroll into view, so charts and other
 * mount-animated widgets play their reveal as the user scrolls down.
 */
export function InViewMount({
  children,
  className,
  fallback,
}: {
  children: ReactNode
  className?: string
  fallback?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {inView ? children : fallback ?? null}
    </motion.div>
  )
}
