'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

interface WaiverRequest {
  id: string
  student_id: string
  requested_amount: number
  status: string
  requested_by: string
  reason: string
  resolved_at: string | null
}

export function PrincipalGovernanceQueue() {
  const [waivers, setWaivers] = useState<WaiverRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ id: string; text: string; type: 'success' | 'error' } | null>(null)

  const principalUsername = 'Principal_Governor'

  const fetchPendingWaivers = async () => {
    try {
      const data = await apiFetch('/waivers/pending')
      setWaivers(data)
    } catch (err) {
      console.error('Failed to fetch pending waivers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingWaivers()
  }, [])

  const handleApprove = async (waiverId: string, requestedBy: string) => {
    if (requestedBy === principalUsername) {
      setMessage({
        id: waiverId,
        text: 'Segregation of Duties Violation: You cannot approve a waiver you requested yourself.',
        type: 'error',
      })
      return
    }

    setApprovingId(waiverId)
    setMessage(null)

    try {
      const data = await apiFetch(`/waivers/${waiverId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approved_by: principalUsername }),
      })

      if (data.status === 'success') {
        setMessage({ id: waiverId, text: 'Waiver approved successfully and written to ledger.', type: 'success' })
        setWaivers(waivers.filter((w) => w.id !== waiverId))
      } else {
        setMessage({ id: waiverId, text: data.message || 'Failed to approve waiver.', type: 'error' })
      }
    } catch (err: any) {
      setMessage({ id: waiverId, text: err.message || 'Network connection error.', type: 'error' })
    } finally {
      setApprovingId(null)
    }
  }

  if (loading) {
    return <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading pending governance queue...</div>
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Pending High-Value Waivers (&gt; ₹500)</h3>
        <p className="text-sm text-muted-foreground">
          Maker-checker authorization queue requiring Principal review before posting to the immutable ledger.
        </p>
      </div>

      {waivers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No pending waiver requests require your approval at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {waivers.map((waiver) => (
            <div key={waiver.id} className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">₹{waiver.requested_amount}</span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    Pending Review
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Student ID: {waiver.student_id}</p>
                <p className="text-xs text-muted-foreground">Requested by: <span className="font-medium text-foreground">{waiver.requested_by}</span></p>
                {waiver.reason && <p className="text-xs italic text-muted-foreground">Reason: &ldquo;{waiver.reason}&rdquo;</p>}
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <button
                  onClick={() => handleApprove(waiver.id, waiver.requested_by)}
                  disabled={approvingId === waiver.id}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  {approvingId === waiver.id ? 'Authorizing...' : 'Approve & Commit to Ledger'}
                </button>

                {message && message.id === waiver.id && (
                  <p className={`text-xs ${message.type === 'error' ? 'text-destructive' : 'text-emerald-600'}`}>
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}