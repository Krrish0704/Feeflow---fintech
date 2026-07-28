// Indian currency + numbering helpers (Lakhs / Crores)

/** Format a rupee amount with Indian digit grouping, e.g. ₹1,23,456 */
export function formatINR(amount: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 0
  return (
    '₹' +
    amount.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

/**
 * Compact Indian format using Lakhs (L) and Crores (Cr).
 * e.g. 7500000 -> ₹75 L, 48000000 -> ₹4.8 Cr
 */
export function formatINRCompact(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  if (abs >= 1_00_00_000) {
    return `${sign}₹${trim(abs / 1_00_00_000)} Cr`
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${trim(abs / 1_00_000)} L`
  }
  if (abs >= 1_000) {
    return `${sign}₹${trim(abs / 1_000)} K`
  }
  return `${sign}₹${Math.round(abs)}`
}

function trim(n: number): string {
  // up to 2 decimals, no trailing zeros
  return parseFloat(n.toFixed(2)).toString()
}

/** Short crypto-style hash for ledger/staging display */
export function shortHash(hash: string, lead = 10, tail = 6): string {
  if (hash.length <= lead + tail) return hash
  return `${hash.slice(0, lead)}…${hash.slice(-tail)}`
}
